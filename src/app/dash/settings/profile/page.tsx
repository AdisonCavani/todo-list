import SettingsCard from "@components/app/settings/card";
import { auth } from "@lib/auth";
import { getGravatarUrl } from "@lib/utils";
import { IconExternalLink } from "@tabler/icons-react";

async function Page() {
  const { user } = await auth();
  const { email, name } = user!;

  return (
    <>
      <SettingsCard
        type="input"
        title="Your Email"
        summary="This is your email address."
        hint="This value cannot be changed. It's your unique identifier."
        inputDisabled
        inputValue={email}
      />

      <SettingsCard
        type="input"
        title="Your Name"
        summary="This is your first and last name."
        hint="You can change your name in your OAuth2 provider."
        inputDisabled
        inputValue={name}
      />

      <SettingsCard
        type="avatar"
        title="Your Avatar"
        summary="This is your avatar."
        avatarFallback={name}
        avatarSrc={await getGravatarUrl(email, 80)}
        hint={
          <>
            You can change your avatar on{" "}
            <a
              href="https://www.gravatar.com"
              rel="noopener"
              target="_blank"
              className="inline-flex items-center gap-x-1 text-blue-500 underline-offset-4 hover:underline"
            >
              Gravatar.com
              <IconExternalLink size={14} className="underline" />
            </a>
          </>
        }
      />
    </>
  );
}

export default Page;
