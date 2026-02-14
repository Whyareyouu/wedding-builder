import { useMemo } from "react";
import { Marck_Script, Great_Vibes, Cormorant_Garamond } from "next/font/google";

type fontVariants = "MarckScript" | "GreatVibes" | "Cormorant";

const sizes = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-md",
  lg: "text-lg",
  xl: "text-xl",
  xxl: "text-xxl",
  subtitle: "text-subtitle",
  title: "text-title",
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
  // const Tag = asChild ?? "span";
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
