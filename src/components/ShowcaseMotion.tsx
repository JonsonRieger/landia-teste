import { useEffect, useRef } from "react";

const FRAME_COUNT = 240;
const frameUrl = (frame: number) =>
  `/showcase-motion-v1/frame-${String(frame).padStart(3, "0")}.webp`;

let prepareCurrent: (() => Promise<void>) | undefined;
// Complete pin measurement before native smooth scrolling starts; otherwise
// ScrollTrigger's initial refresh can cancel an in-flight anchor scroll.
export const prepareShowcaseMotion = () => prepareCurrent?.() ?? Promise.resolve();

/** Local, demand-loaded film frames. No video playback or tracking events. */
export default function ShowcaseMotion() {
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    const canvas = canvasRef.current;
    const title = titleRef.current;
    if (!track || !viewport || !canvas || !title) return;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;

    let disposed = false;
    let started = false;
    let active = false;
    let target = 0;
    let drawn = -1;
    let renderRequest = 0;
    let direction = 1;
    let cleanupAnimation: (() => void) | undefined;
    let initialization: Promise<void> | undefined;
    const abort = new AbortController();
    const frames = new Map<number, ImageBitmap | HTMLImageElement>();
    const pending = new Set<number>();
    const failed = new Set<number>();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const release = (image: ImageBitmap | HTMLImageElement) => {
      if ("close" in image) image.close();
    };

    const draw = () => {
      renderRequest = 0;
      if (disposed || frames.size === 0) return;
      // While the requested frame loads, keep the nearest decoded frame visible.
      const nearest = frames.has(target) ? target : [...frames.keys()].reduce((a, b) =>
        Math.abs(a - target) <= Math.abs(b - target) ? a : b,
      );
      if (nearest === drawn) return;
      context.drawImage(frames.get(nearest)!, 0, 0, 720, 1280);
      canvas.style.opacity = "1";
      drawn = nearest;
    };
    const requestDraw = () => {
      if (!renderRequest && !disposed) renderRequest = requestAnimationFrame(draw);
    };

    // Bound decoded memory to 24 frames (~84 MiB), rather than decoding 240 at once.
    const prune = () => {
      const farthest = [...frames.keys()].sort((a, b) => Math.abs(b - target) - Math.abs(a - target));
      while (frames.size > 24 && farthest.length) {
        const index = farthest.shift()!;
        release(frames.get(index)!);
        frames.delete(index);
      }
    };

    const load = async (index: number) => {
      pending.add(index);
      try {
        const response = await fetch(frameUrl(index), { signal: abort.signal, cache: "force-cache" });
        if (!response.ok) throw new Error("Frame unavailable");
        const blob = await response.blob();
        let image: ImageBitmap | HTMLImageElement;
        if (typeof createImageBitmap === "function") {
          image = await createImageBitmap(blob);
        } else {
          const url = URL.createObjectURL(blob);
          try {
            const element = new Image();
            element.decoding = "async";
            element.src = url;
            await element.decode();
            image = element;
          } finally {
            URL.revokeObjectURL(url);
          }
        }
        if (disposed) { release(image); return; }
        frames.set(index, image);
        prune();
        requestDraw();
      } catch {
        if (!disposed) failed.add(index);
      } finally {
        pending.delete(index);
        if (!disposed) pump();
      }
    };

    function pump() {
      if (!active || disposed) return;
      const candidates = [target];
      // Prioritize the scroll direction, with a small reverse buffer.
      if (!reducedMotion.matches) {
        for (let offset = 1; offset <= 12; offset++) {
          candidates.push(target + offset * direction, target - offset * direction);
        }
      }
      for (const index of candidates) {
        if (pending.size >= 3) break;
        if (index < 0 || index >= FRAME_COUNT || frames.has(index) || pending.has(index) || failed.has(index)) continue;
        // The target plus 23 neighbours fit the decoded cache without eviction loops.
        if (Math.abs(index - target) === 12 && index !== target + direction * 12) continue;
        void load(index);
      }
    }

    const start = async () => {
      if (started) return;
      started = true;
      if (reducedMotion.matches) {
        target = FRAME_COUNT - 1;
        pump();
        return;
      }
      pump();
      try {
        // Neither GSAP nor ScrollTrigger is part of the initial route download.
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"), import("gsap/ScrollTrigger"),
        ]);
        if (disposed) return;
        gsap.registerPlugin(ScrollTrigger);
        const playhead = { frame: 0 };
        const update = () => {
          const next = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(playhead.frame)));
          if (next !== target) direction = next > target ? 1 : -1;
          target = next;
          const fade = Math.min(1, playhead.frame / ((FRAME_COUNT - 1) * 0.075));
          title.style.opacity = String(1 - fade);
          title.style.transform = `translate3d(0, ${-24 * fade}px, 0)`;
          requestDraw();
          pump();
        };
        const tween = gsap.to(playhead, {
          frame: FRAME_COUNT - 1,
          ease: "none",
          onUpdate: update,
          scrollTrigger: {
            trigger: track,
            start: "top top",
            end: "bottom bottom",
            pin: viewport,
            pinSpacing: false,
            scrub: 0.18,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: update,
          },
        });
        cleanupAnimation = () => { tween.scrollTrigger?.kill(); tween.kill(); };
        // Pin creation queues a refresh and a scroll-position restoration.
        // Wait for both animation frames before releasing the hero anchor.
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        });
      } catch {
        // Preserve a usable static section if the optional animation chunk fails.
        track.dataset.static = "true";
        target = FRAME_COUNT - 1;
        pump();
      }
    };

    const prepare = () => {
      active = true;
      return initialization ??= start();
    };
    prepareCurrent = prepare;
    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      if (active) { void prepare(); pump(); }
    }, { rootMargin: "700px 0px" });
    observer.observe(track);

    // Rebuild only this component when the accessibility preference changes.
    const onMotionChange = () => {
      cleanupAnimation?.();
      cleanupAnimation = undefined;
      started = false;
      initialization = undefined;
      title.style.opacity = "1";
      title.style.transform = "";
      target = 0;
      if (active) void prepare();
    };
    reducedMotion.addEventListener("change", onMotionChange);

    return () => {
      disposed = true;
      if (prepareCurrent === prepare) prepareCurrent = undefined;
      observer.disconnect();
      abort.abort();
      cleanupAnimation?.();
      reducedMotion.removeEventListener("change", onMotionChange);
      cancelAnimationFrame(renderRequest);
      frames.forEach(release);
      frames.clear();
    };
  }, []);

  return (
    <div ref={trackRef} className="forge-cinema-track">
      <div ref={viewportRef} className="forge-cinema-viewport">
        <img className="forge-cinema-poster" src={frameUrl(0)} width={720} height={1280}
          loading="lazy" decoding="async" alt="Mockups de landing pages criadas com o método Land-IA" />
        <canvas ref={canvasRef} className="forge-cinema-canvas" width={720} height={1280} aria-hidden="true" />
        <div ref={titleRef} className="forge-cinema-heading">
          <span className="forge-cinema-kicker">04 / O RESULTADO FINAL</span>
          <h2>ENTÃO TOMA! COM OS PROMPTS CERTOS,<span>VOCÊ TEM RESULTADOS COMO ESSES:</span></h2>
          <p>Algumas páginas criadas com o método Land-IA</p>
        </div>
      </div>
    </div>
  );
}
