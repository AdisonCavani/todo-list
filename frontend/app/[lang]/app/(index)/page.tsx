import App from "@components/app/app";
import AuthWrapper from "@components/auth-wrapper";
import ReactQueryWrapper from "@components/react-query-wrapper";
import { tasks } from "@db/schema";
import { db } from "@db/sql";
import { auth } from "@lib/auth";
import { twindConfig, type ColorRecordType } from "@lib/twind";
import { getDictionary } from "dictionaries";
import { eq } from "drizzle-orm";
import type { LocaleParams } from "i18n-config";

export const metadata = {
  title: "App",
  themeColor: [
    {
      color: (twindConfig.colors.blue as ColorRecordType)[600],
      media: "(prefers-color-scheme: light)",
    },
    {
      color: (twindConfig.colors.neutral as ColorRecordType)[800],
      media: "(prefers-color-scheme: dark)",
    },
  ],
};

async function Page({ params: { lang } }: LocaleParams) {
  const session = await auth();
  const response = await db
    .select()
    .from(tasks)
    .where(eq(tasks.userId, session!.user.id));

  const locale = await getDictionary(lang);

  return (
    <AuthWrapper>
      <ReactQueryWrapper>
        <App initialTasks={response} lang={lang} locale={locale} />
      </ReactQueryWrapper>
    </AuthWrapper>
  );
}

export default Page;
