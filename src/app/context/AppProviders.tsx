import React from "react";
import ContextProvider from "./ContextProvider";

interface Props {
  children: React.ReactNode;
}

export default function AppProviders({ children }: Props) {
  return <ContextProvider>{children}</ContextProvider>;
}
