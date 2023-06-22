import { client } from "@api/client";
import App from "@components/app/app";
import AuthWrapper from "@components/auth-wrapper";
import ReactQueryWrapper from "@components/react-query-wrapper";
import { auth } from "@lib/auth";
import { ColorRecordType, twindConfig } from "@lib/twind";

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

async function Page() {
  const session = await auth();

  const response = await client("/tasks").get({
    jwtToken: session?.user.access_token!,
    queryParameters: {
      pageSize: 100,
    },
  });

  return (
    <AuthWrapper>
      <ReactQueryWrapper>
        <App
          initialData={response?.data ?? []}
          token={session?.user.access_token!}
        />
      </ReactQueryWrapper>
    </AuthWrapper>
  );
}

export default Page;
