import { useTheme } from "next-themes";
import React from "react";
import { useEffect } from "react";

const Theme = ({ theme }: { theme: "light" | "dark" }) => {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(theme);
  }, [setTheme, theme]);

  return null;
};

export default React.memo(Theme);