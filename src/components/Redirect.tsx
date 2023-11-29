import { useRouter } from "next/router";
import React from "react";

interface RedirectProps {
  children?: React.ReactNode;
  path: string;
}

const Redirect: React.FC<RedirectProps> = ({ path }) => {
  const router = useRouter();
  void router.push(path);
  return <></>;
};

export default Redirect;
