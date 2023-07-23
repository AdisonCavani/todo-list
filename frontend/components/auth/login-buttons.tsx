"use client";

import GoogleLogo from "@images/google.svg";
import { IconBrandGithub } from "@tabler/icons-react";
import { Button } from "@ui/button";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

type Props = {
  text: string;
};

function LoginButtons({ text }: Props) {
  const [loadingGithub, setLoadingGithub] = useState<boolean>(false);
  const [loadingGoogle, setLoadingGoogle] = useState<boolean>(false);

  return (
    <>
      {/* Github */}
      <Button
        onClick={() => {
          setLoadingGithub(true);
          signIn("github", {
            callbackUrl: "/app",
          });
        }}
        loading={loadingGithub}
        icon={<IconBrandGithub size={20} />}
      >
        {text} Github
      </Button>

      {/* Google */}
      <Button
        variant="outline"
        onClick={() => {
          setLoadingGoogle(true);
          signIn("google", {
            callbackUrl: "/app",
          });
        }}
        loading={loadingGoogle}
        icon={
          <Image
            src={GoogleLogo}
            alt="Google logo"
            width={20}
            height={20}
            className="h-5 w-5"
          />
        }
      >
        {text} Google
      </Button>
    </>
  );
}

export default LoginButtons;
