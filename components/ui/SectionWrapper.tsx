"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { ILayout, ISectionDecorations } from "@/types/blocks/config";

type Props = {
  className?: HTMLElement["className"];
  decorations?: ILayout["decorations"];
  mobileDecorations?: ILayout["decorations"];
  groupId?: string;
};

const MOBILE_BREAKPOINT = 1280; // xl breakpoint

export const SectionWrapper = ({
  children,
  className,
  decorations,
  mobileDecorations,
}: React.PropsWithChildren<Props>) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const update = () => {
      const r = sectionRef.current!.getBoundingClientRect();
      setRect(r);
    };

    update();
    window.addEventListener("scroll", update);
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

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

  const resolveHorizontalPosition = (
    position: ISectionDecorations["position"],
    rect: DOMRect,
    elementWidth: number,
  ) => {
    if (!position.left && !position.right) {
      return { left: "0px", right: "0px" };
    }

    const windowWidth = document.body.getBoundingClientRect().width;

    if (position.left) {
      const leftCord = windowWidth * (parseFloat(position.left) / 100);
      const elementRightEdge = leftCord + elementWidth;

      if (elementRightEdge >= rect.left) {
        const overlap = Math.ceil(elementRightEdge - rect.left);
        return { left: `${Math.ceil(leftCord - overlap)}px` };
      }

      return { left: `${leftCord}px` };
    }

    if (position.right) {
      const rightCord = windowWidth * (parseFloat(position.right) / 100);
      const elementLeftEdge = windowWidth - rightCord - elementWidth;

      if (elementLeftEdge <= rect.right) {
        const overlap = Math.ceil(rect.right - elementLeftEdge);
        return { right: `${Math.ceil(rightCord - overlap)}px` };
      }

      return { right: `${rightCord}px` };
    }
  };

  // Мобильные декорации — простое позиционирование,
  // могут залезать на контент (без overlap-коррекции)
  const resolveMobileHorizontalPosition = (position: ISectionDecorations["position"]) => {
    if (position.left) return { left: position.left };
    if (position.right) return { right: position.right };
    return { left: "0px" };
  };

  const resolveMobileVerticalPosition = (
    position: ISectionDecorations["position"],
    rect: DOMRect,
    elementHeight: number,
  ) => {
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

  const activeDecorations = isMobile ? mobileDecorations : decorations;

  const portalLayer =
    rect && (activeDecorations || []).length > 0
      ? createPortal(
          <>
            {activeDecorations!.map((decoration, index) => {
              if (isMobile) {
                const top = resolveMobileVerticalPosition(decoration.position, rect, decoration.height);
                const horizontal = resolveMobileHorizontalPosition(decoration.position);

                return (
                  <div
                    key={`mobile-${index}`}
                    className={`absolute pointer-events-none ${decoration.className || ""}`}
                    style={{
                      position: "absolute",
                      top,
                      ...horizontal,
                      zIndex: 0,
                    }}
                  >
                    <Image
                      src={decoration.path}
                      alt=""
                      width={decoration.width}
                      height={decoration.height}
                      className="opacity-30"
                    />
                  </div>
                );
              }

              // Desktop — без left-декораций (как было), с overlap-коррекцией
              const computedTop = resolveVerticalPosition(decoration.position, rect, decoration.height);

              if (decoration.position.left) return null;

              const computedHorizontal = resolveHorizontalPosition(decoration.position, rect, decoration.width);

              return (
                <div
                  key={`desktop-${index}`}
                  className={`absolute pointer-events-none hidden xl:block ${decoration.className || ""}`}
                  style={{
                    position: "absolute",
                    top: computedTop,
                    left: computedHorizontal?.left,
                    right: computedHorizontal?.right,
                    zIndex: 0,
                  }}
                >
                  <Image
                    src={decoration.path}
                    alt=""
                    width={decoration.width}
                    height={decoration.height}
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
