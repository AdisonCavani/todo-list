import Footer from "@components/home/footer";
import Header from "@components/home/header";
import { auth } from "@lib/auth";
import { getDictionary } from "dictionaries";
import type { LocaleParams } from "i18n-config";
import type { PropsWithChildren } from "react";

async function Layout({
  children,
  params: { lang },
}: PropsWithChildren<LocaleParams>) {
  const session = await auth();
  const locale = await getDictionary(lang);

  return (
    <>
      <Header session={session} locale={locale} />
      {children}
      <Footer locale={locale} />
    </>
  );
}

export default Layout;
