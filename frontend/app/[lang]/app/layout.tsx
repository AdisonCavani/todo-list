import Header from "@components/app/header";
import { Toaster } from "@ui/toaster";
import { getDictionary } from "dictionaries";
import type { LocaleParams } from "i18n-config";
import type { PropsWithChildren } from "react";

async function Layout({
  children,
  params: { lang },
}: PropsWithChildren<LocaleParams>) {
  const locale = await getDictionary(lang);

  return (
    <>
      <Header locale={locale} />
      {children}
      <Toaster />
    </>
  );
}

export default Layout;
