import { useTheme } from "next-themes";
import { memo, useEffect } from "react";

const Theme = ({ theme }: { theme: "light" | "dark" }) => {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(theme);
  }, [setTheme, theme]);

  return null;
};

export default memo(Theme);
