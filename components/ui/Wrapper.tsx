type WrapperProps = React.PropsWithChildren<{
  backgroundImage?: string;
}>;

export const Wrapper = ({ children, backgroundImage }: WrapperProps) => {
  return (
    <div
      className="relative min-h-screen"
      style={
        backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }
          : undefined
      }
    >
      <div className="flex flex-col max-w-screen-md w-full mx-auto px-2 md:px-0">{children}</div>
    </div>
  );
};
