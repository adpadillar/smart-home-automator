import React from "react";

interface TypographyH1Props {
  children?: React.ReactNode;
}

export const TypographyH1: React.FC<TypographyH1Props> = ({ children }) => {
  return (
    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      {children}
    </h1>
  );
};

export function TypographyP({ children }: { children?: React.ReactNode }) {
  return <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>;
}
