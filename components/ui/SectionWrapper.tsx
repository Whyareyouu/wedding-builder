"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ILayout } from "@/types/blocks/config";

type Props = {
  className?: HTMLElement["className"];
  decorations?: ILayout["decorations"];
};

export const SectionWrapper = ({ children, className, decorations }: React.PropsWithChildren<Props>) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  const resolveVerticalPosition = (position: any, rect: DOMRect, elementHeight: number) => {
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

  const portalLayer =
    mounted && rect && (decorations || []).length > 0
      ? createPortal(
          <>
            {decorations!.map((decoration, index) => {
              const computedTop = resolveVerticalPosition(decoration.position, rect, decoration.height);

              return (
                <div
                  key={index}
                  className={`absolute pointer-events-none hidden xl:block ${decoration.className || ""}`}
                  style={{
                    position: "absolute",
                    top: computedTop,
                    left: decoration.position.left,
                    right: decoration.position.right,
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
