type Props = {
  className?: HTMLElement["className"];
};

export const SectionWrapper = ({ children, className }: React.PropsWithChildren<Props>) => {
  return <section className={`flex flex-col gap-16 pt-20 items-center ${className}`}>{children}</section>;
};
