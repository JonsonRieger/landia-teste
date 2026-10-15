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
    const bufferRadius = window.matchMedia("(pointer: coarse), (max-width: 767px)").matches ? 6 : 12;
    const maxDecodedFrames = bufferRadius * 2;
    let bitmapSupported = typeof createImageBitmap === "function";

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

    // Limit decoded frames to 12 on touch/mobile (~42 MiB), 24 on desktop.
    const prune = () => {
      const farthest = [...frames.keys()].sort((a, b) => Math.abs(b - target) - Math.abs(a - target));
      while (frames.size > maxDecodedFrames && farthest.length) {
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
        let image: ImageBitmap | HTMLImageElement | undefined;
        if (bitmapSupported) {
          try {
            image = await createImageBitmap(blob);
          } catch {
            // Some WebViews expose the API but reject WebP bitmap decoding.
            bitmapSupported = false;
          }
        }
        if (!image) {
          const url = URL.createObjectURL(blob);
          try {
            const element = new Image();
            element.decoding = "async";
            await new Promise<void>((resolve, reject) => {
              element.onload = () => resolve();
              element.onerror = () => reject(new Error("Frame unavailable"));
              element.src = url;
            });
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
      for (let offset = 1; offset <= bufferRadius; offset++) {
        candidates.push(target + offset * direction, target - offset * direction);
      }
      for (const index of candidates) {
        if (pending.size >= 3) break;
        if (index < 0 || index >= FRAME_COUNT || frames.has(index) || pending.has(index) || failed.has(index)) continue;
        // Keep the candidate window within the decoded-cache capacity.
        if (Math.abs(index - target) === bufferRadius && index !== target + direction * bufferRadius) continue;
        void load(index);
      }
    }

    const update = (progress: number) => {
      if (disposed) return;
      const frame = Math.max(0, Math.min(1, progress)) * (FRAME_COUNT - 1);
      const next = Math.round(frame);
      if (next !== target) direction = next > target ? 1 : -1;
      target = next;
      const fade = Math.min(1, progress / 0.075);
      title.style.opacity = String(1 - fade);
      // Reduced motion removes decorative travel and catch-up animation,
      // but never skips the user-controlled frame sequence.
      title.style.transform = reducedMotion.matches ? "" : `translate3d(0, ${-24 * fade}px, 0)`;
      requestDraw();
      pump();
    };
    const distance = () => Math.max(1, track.offsetHeight - viewport.offsetHeight);

    const startNativeFallback = () => {
      // Keep scrubbing functional if the optional GSAP chunks cannot load.
      // Local transforms avoid changing global scroll/viewport settings.
      let pendingScroll = 0;
      const sync = () => {
        pendingScroll = 0;
        if (disposed) return;
        const travel = Math.max(0, Math.min(distance(), -track.getBoundingClientRect().top));
        viewport.style.transform = `translate3d(0, ${travel}px, 0)`;
        update(travel / distance());
      };
      const schedule = () => {
        if (!pendingScroll) pendingScroll = requestAnimationFrame(sync);
      };
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule, { passive: true });
      sync();
      cleanupAnimation = () => {
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
        cancelAnimationFrame(pendingScroll);
        viewport.style.transform = "";
      };
    };

    const start = async () => {
      if (started) return;
      started = true;
      pump();
      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"), import("gsap/ScrollTrigger"),
        ]);
        if (disposed) return;
        gsap.registerPlugin(ScrollTrigger);
        const trigger = ScrollTrigger.create({
          trigger: track,
          start: "top top",
          // Use the actual pinned height: mobile browser chrome can change
          // innerHeight independently of our stable svh scene.
          end: () => `+=${distance()}`,
          pin: viewport,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => update(self.progress),
          onRefresh: (self) => update(self.progress),
        });
        cleanupAnimation = () => { trigger.kill(); };
        update(trigger.progress);
        // Finish the queued pin refresh before the hero's native anchor scroll.
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        });
      } catch {
        if (disposed) return;
        cleanupAnimation?.();
        startNativeFallback();
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

    return () => {
      disposed = true;
      if (prepareCurrent === prepare) prepareCurrent = undefined;
      observer.disconnect();
      abort.abort();
      cleanupAnimation?.();
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
