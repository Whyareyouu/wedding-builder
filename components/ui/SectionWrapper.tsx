"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useLayoutEffect, useRef, useState, useEffect, useMemo } from "react";
import { ILayout, ISectionDecorations } from "@/types/blocks/config";

type DeviceMode = "desktop" | "laptop" | "mobile";

type Props = {
  className?: HTMLElement["className"];
  decorations?: ILayout["decorations"];
  laptopDecorations?: ILayout["decorations"];
  mobileDecorations?: ILayout["decorations"];
  groupId?: string;
};

const REFERENCE_WIDTH = 1920;
const MIN_SCALE = 0.5;
const LAPTOP_BREAKPOINT = 1280;
const MOBILE_BREAKPOINT = 540;

export const SectionWrapper = ({
  children,
  className,
  decorations,
  laptopDecorations,
  mobileDecorations,
}: React.PropsWithChildren<Props>) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : REFERENCE_WIDTH,
  );

  const scale = useMemo(() => Math.max(MIN_SCALE, Math.min(1, windowWidth / REFERENCE_WIDTH)), [windowWidth]);

  const deviceMode: DeviceMode = useMemo(() => {
    if (windowWidth < MOBILE_BREAKPOINT) return "mobile";
    if (windowWidth < LAPTOP_BREAKPOINT) return "laptop";
    return "desktop";
  }, [windowWidth]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const update = () => {
      setRect(sectionRef.current!.getBoundingClientRect());
    };

    update();
    window.addEventListener("scroll", update);
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // --- Утилиты позиционирования ---

  const resolveVerticalPosition = (position: ISectionDecorations["position"], rect: DOMRect, elementHeight: number) => {
    const sectionTop = rect.top + window.scrollY;
    const sectionBottom = sectionTop + rect.height;

    if (position.top !== undefined) {
      if (position.top.includes("%")) {
        const percent = parseFloat(position.top);
        return sectionTop + (rect.height * percent) / 100 + "px";
      }
      return sectionTop + parseFloat(position.top) + "px";
    }

    if (position.bottom !== undefined) {
      return sectionBottom - parseFloat(position.bottom) - elementHeight + "px";
    }

    return sectionTop + "px";
  };

  /** Desktop: overlap-коррекция + clamp к краям viewport */
  const resolveDesktopHorizontal = (position: ISectionDecorations["position"], rect: DOMRect, elementWidth: number) => {
    if (!position.left && !position.right) {
      return { left: "0px", right: "0px" };
    }

    const bodyWidth = document.body.getBoundingClientRect().width;

    if (position.left) {
      const leftCord = bodyWidth * (parseFloat(position.left) / 100);
      let finalLeft = leftCord;

      if (leftCord + elementWidth >= rect.left) {
        finalLeft = leftCord - (leftCord + elementWidth - rect.left);
      }

      return { left: `${Math.round(Math.max(0, finalLeft))}px` };
    }

    if (position.right) {
      const rightCord = bodyWidth * (parseFloat(position.right) / 100);
      let finalRight = rightCord;

      const elementLeftEdge = bodyWidth - rightCord - elementWidth;
      if (elementLeftEdge <= rect.right) {
        finalRight = rightCord - (rect.right - elementLeftEdge);
      }

      return { right: `${Math.round(Math.max(0, finalRight))}px` };
    }
  };

  /** Laptop & Mobile: позиция напрямую из конфига, без overlap-коррекции */
  const resolveDirectHorizontal = (position: ISectionDecorations["position"]) => {
    if (position.left) return { left: position.left };
    if (position.right) return { right: position.right };
    return { left: "0px" };
  };

  // --- Выбор активного набора декораций ---

  const activeDecorations = useMemo(() => {
    switch (deviceMode) {
      case "mobile":
        return mobileDecorations ?? null;
      case "laptop":
        // Fallback: если laptop-декорации не заданы — пробуем desktop
        return laptopDecorations ?? null;
      case "desktop":
        return decorations ?? null;
    }
  }, [deviceMode, decorations, laptopDecorations, mobileDecorations]);

  // --- Рендер ---

  const portalLayer =
    rect && activeDecorations && activeDecorations.length > 0
      ? createPortal(
          <>
            {activeDecorations.map((decoration, index) => {
              const scaledWidth = Math.round(decoration.width * scale);
              const scaledHeight = Math.round(decoration.height * scale);

              const top = resolveVerticalPosition(decoration.position, rect, scaledHeight);

              const horizontal =
                deviceMode === "desktop"
                  ? resolveDesktopHorizontal(decoration.position, rect, scaledWidth)
                  : resolveDirectHorizontal(decoration.position);

              return (
                <div
                  key={`${deviceMode}-${index}`}
                  className={`absolute pointer-events-none ${decoration.className || ""}`}
                  style={{
                    position: "absolute",
                    top,
                    left: horizontal?.left,
                    right: horizontal?.right,
                    zIndex: 0,
                  }}
                >
                  <Image
                    src={decoration.path}
                    alt=""
                    width={scaledWidth}
                    height={scaledHeight}
                    className="opacity-30"
                  />
                </div>
              );
            })}
          </>,
          document.body,
        )
      : null;

  return (
    <>
      <section ref={sectionRef} className="relative flex flex-col gap-16 pt-10 sm:pt-20 items-center">
        <div className={`relative z-10 w-full flex flex-col gap-16 items-center ${className}`}>{children}</div>
      </section>
      {portalLayer}
    </>
  );
};
