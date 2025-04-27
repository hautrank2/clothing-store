import { useEffect, useState, useRef } from "react";

interface UseStickyDetectOptions {
  topOffset?: number | string; // px, %, rem
}

const convertRemToPx = (rem: string) => {
  const remValue = parseFloat(rem);
  const fontSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  );
  return remValue * fontSize;
};

const formatDistance = (d: number | string): string => {
  if (typeof d === "number") return `${d}px`;
  if (d.endsWith("px") || d.endsWith("%")) return d;
  if (d.endsWith("rem")) return `${convertRemToPx(d)}px`;
  throw new Error("Unsupported unit, please use px, %, or rem.");
};

export function useStickyDetect(
  ref: React.RefObject<HTMLElement | null>,
  options?: UseStickyDetectOptions
) {
  const { topOffset = 0 } = options || {};
  const [isSticky, setIsSticky] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    if (!sentinelRef.current) {
      const sentinel = document.createElement("div");
      sentinel.style.height = "1px";
      sentinel.style.position = "absolute";
      sentinel.style.top = "0px";
      sentinel.style.left = "0px";
      sentinel.style.width = "100%";
      sentinelRef.current = sentinel;
      ref.current.parentElement?.insertBefore(sentinel, ref.current);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
        rootMargin: `-${formatDistance(topOffset)} 0px 0px 0px`,
      }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      observer.disconnect();
      sentinelRef.current?.remove();
    };
  }, [ref, topOffset]);

  return isSticky;
}
