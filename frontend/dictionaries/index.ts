import "server-only";

export type LangDictionary = Awaited<ReturnType<(typeof dictionaries)["en"]>>;
export type Languages = keyof typeof dictionaries;

const dictionaries = {
  en: () => import("./en.json").then((module) => module.default),
  pl: () => import("./pl.json").then((module) => module.default),
};

export const getDictionary = async (locale: Languages) =>
  dictionaries[locale]();
