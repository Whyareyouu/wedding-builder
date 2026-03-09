import { useMemo } from "react";
import { Marck_Script, Great_Vibes, Cormorant_Garamond } from "next/font/google";

type fontVariants = "MarckScript" | "GreatVibes" | "Cormorant";

// Responsive размеры: мобильный (по умолчанию) -> десктопный (sm:)
const sizes = {
  xs: "text-xs sm:text-xs", // xs остается xs на всех экранах
  sm: "text-xs sm:text-sm",
  md: "text-sm sm:text-md",
  lg: "text-md sm:text-lg",
  xl: "text-lg sm:text-xl",
  xxl: "text-xl sm:text-xxl",
  subtitle: "text-xl sm:text-subtitle",
  title: "text-subtitle sm:text-title",
} as const;

type TypographyProps = {
  asChild?: string;
  fontSize?: keyof typeof sizes;
  font?: fontVariants;
  fontWeight?: "400" | "600";
  className?: HTMLElement["className"];
};

const MarckScriptFont = Marck_Script({
  style: "normal",
  subsets: ["latin"],
  weight: ["400"],
});

const CormorantFont = Cormorant_Garamond({
  style: ["normal", "italic"],
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
});

const GreatVibesFont = Great_Vibes({
  style: "normal",
  subsets: ["latin"],
  weight: ["400"],
});

export const Typography = ({
  asChild,
  fontSize = "sm",
  font,
  fontWeight,
  children,
  className,
}: React.PropsWithChildren<TypographyProps>) => {
  const selectedFont = useMemo(() => {
    switch (font) {
      case "MarckScript":
        return MarckScriptFont;
      case "GreatVibes":
        return GreatVibesFont;
      case "Cormorant":
        return CormorantFont;
      default:
        return MarckScriptFont;
    }
  }, [font]);

  return <span className={`${selectedFont.className} ${sizes[fontSize]} ${className}`}>{children}</span>;
};
