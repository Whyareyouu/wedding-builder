export const Wrapper = ({ children }: React.PropsWithChildren) => {
  return <div className="flex flex-col max-w-screen-md w-full mx-auto">{children}</div>;
};
