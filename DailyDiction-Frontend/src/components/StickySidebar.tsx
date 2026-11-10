"use client";

import React, { useEffect, useRef } from "react";

interface StickySidebarProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  topOffset?: number;
  bottomOffset?: number;
  minBreakpoint?: number;
}

export default function StickySidebar({
  children,
  className = "lg:col-span-4 lg:self-stretch",
  innerClassName = "space-y-6",
  topOffset = 96, // sama dengan top-24
  bottomOffset = 24, // jarak aman dari tepi bawah layar
  minBreakpoint = 1024, // default lg (1024px), isi 1280 untuk xl
}: StickySidebarProps) {
  const containerRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    type Mode = "static" | "top" | "bottom" | "free";
    let mode: Mode = "free";
    let freeOffset = 0;
    let lastScrollY = window.scrollY;

    const resetStyles = () => {
      inner.style.position = "";
      inner.style.top = "";
      mode = "static";
      freeOffset = 0;
    };

    const update = (isResize = false) => {
      // Nonaktifkan sticky saat tampilan masih stack 1 kolom (mobile/tablet)
      if (window.innerWidth < minBreakpoint) {
        resetStyles();
        lastScrollY = window.scrollY;
        return;
      }

      const viewportHeight = window.innerHeight;
      const containerRect = container.getBoundingClientRect();
      const innerRect = inner.getBoundingClientRect();

      const containerHeight = containerRect.height;
      const sidebarHeight = innerRect.height;

      // Jika konten kiri lebih pendek atau sama dengan tinggi sidebar, biarkan normal
      if (containerHeight <= sidebarHeight + 2) {
        resetStyles();
        lastScrollY = window.scrollY;
        return;
      }

      const maxOffset = Math.max(0, containerHeight - sidebarHeight);
      const fitsInViewport =
        sidebarHeight <= viewportHeight - topOffset - bottomOffset;

      // Jika seluruh sidebar muat di layar, pakai sticky top biasa
      if (fitsInViewport) {
        inner.style.position = "sticky";
        inner.style.top = `${topOffset}px`;
        mode = "top";
        freeOffset = 0;
        lastScrollY = window.scrollY;
        return;
      }

      const minTop = viewportHeight - sidebarHeight - bottomOffset;
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY;
      const scrollingUp = currentScrollY < lastScrollY;
      lastScrollY = currentScrollY;

      if (mode === "static") {
        mode = "free";
        freeOffset = 0;
        inner.style.position = "relative";
        inner.style.top = "0px";
      }

      if (isResize) {
        if (mode === "bottom") {
          if (containerRect.top >= minTop) {
            inner.style.position = "relative";
            inner.style.top = "0px";
            mode = "free";
            freeOffset = 0;
          } else {
            inner.style.position = "sticky";
            inner.style.top = `${minTop}px`;
          }
        } else if (mode === "top") {
          if (containerRect.top >= topOffset) {
            inner.style.position = "relative";
            inner.style.top = "0px";
            mode = "free";
            freeOffset = 0;
          } else {
            inner.style.position = "sticky";
            inner.style.top = `${topOffset}px`;
          }
        } else {
          freeOffset = Math.max(0, Math.min(maxOffset, freeOffset));
          if (containerRect.top + freeOffset <= minTop) {
            inner.style.position = "sticky";
            inner.style.top = `${minTop}px`;
            mode = "bottom";
            freeOffset = 0;
          } else {
            inner.style.position = "relative";
            inner.style.top = `${freeOffset}px`;
          }
        }
        return;
      }

      if (scrollingDown) {
        if (mode === "top") {
          freeOffset = Math.max(
            0,
            Math.min(maxOffset, innerRect.top - containerRect.top)
          );
          inner.style.position = "relative";
          inner.style.top = `${freeOffset}px`;
          mode = "free";
        }

        if (mode === "free") {
          const currentTop = containerRect.top + freeOffset;
          if (currentTop <= minTop) {
            inner.style.position = "sticky";
            inner.style.top = `${minTop}px`;
            mode = "bottom";
            freeOffset = 0;
          }
        }
      } else if (scrollingUp) {
        if (mode === "bottom") {
          freeOffset = Math.max(
            0,
            Math.min(maxOffset, innerRect.top - containerRect.top)
          );
          if (containerRect.top >= topOffset) {
            inner.style.position = "relative";
            inner.style.top = "0px";
            mode = "free";
            freeOffset = 0;
          } else if (containerRect.top + freeOffset >= topOffset) {
            inner.style.position = "sticky";
            inner.style.top = `${topOffset}px`;
            mode = "top";
            freeOffset = 0;
          } else {
            inner.style.position = "relative";
            inner.style.top = `${freeOffset}px`;
            mode = "free";
          }
        } else if (mode === "free") {
          if (containerRect.top >= topOffset) {
            freeOffset = 0;
            inner.style.position = "relative";
            inner.style.top = "0px";
          } else if (
            freeOffset > 0 &&
            containerRect.top + freeOffset >= topOffset
          ) {
            inner.style.position = "sticky";
            inner.style.top = `${topOffset}px`;
            mode = "top";
            freeOffset = 0;
          }
        } else if (mode === "top") {
          if (containerRect.top >= topOffset) {
            inner.style.position = "relative";
            inner.style.top = "0px";
            mode = "free";
            freeOffset = 0;
          }
        }
      }
    };

    const onScroll = () => update(false);
    const onResize = () => update(true);

    update(true);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    const resizeObserver = new ResizeObserver(() => update(true));
    resizeObserver.observe(container);
    resizeObserver.observe(inner);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      resizeObserver.disconnect();
    };
  }, [topOffset, bottomOffset, minBreakpoint]);

  return (
    <aside ref={containerRef} className={`w-full ${className}`}>
      <div ref={innerRef} className={innerClassName}>
        {children}
      </div>
    </aside>
  );
}