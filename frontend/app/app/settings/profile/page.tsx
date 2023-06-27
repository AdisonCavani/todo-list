import SettingsCard from "@components/app/settings/card";
import { auth } from "@lib/auth";
import { ExternalLink } from "@ui/ext-link";
import md5 from "md5";

async function Page() {
  const session = await auth();
  const { email, firstName, lastName, image } = session!.user;

  return (
    <>
      <SettingsCard
        type="input"
        title="Your Email"
        summary="This is your email address."
        hint="This value cannot be changed. It's your unique identifier."
        inputDisabled
        inputValue={email!}
      />

      <SettingsCard
        type="input"
        title="Your Name"
        summary="This is your first and last name."
        hint="You can change your name using selected OAuth2 provider."
        inputDisabled
        inputValue={`${firstName} ${lastName}`}
      />

      <SettingsCard
        type="avatar"
        title="Your Avatar"
        summary="This is your avatar."
        avatarFallback={`${firstName} ${lastName}`}
        avatarSrc={image ?? `https://www.gravatar.com/avatar/${md5(email!)}`}
        hint={
          <>
            If your using Google, read{" "}
            <ExternalLink href="https://support.google.com/mail/answer/35529">
              this
            </ExternalLink>
            . For AWS Cognito users we&apos;re using{" "}
            <ExternalLink href="https://gravatar.com">Gravatar</ExternalLink>.
          </>
        }
      />
    </>
  );
}

export default Page;
