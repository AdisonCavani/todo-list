"use client";

import GoogleLogo from "@images/google.svg";
import { IconBrandGithub } from "@tabler/icons-react";
import { Button } from "@ui/button";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

function LoginButtons() {
  const [disabled, setDisabled] = useState<boolean>(false);

  const [loadingGithub, setLoadingGithub] = useState<boolean>(false);
  const [loadingGoogle, setLoadingGoogle] = useState<boolean>(false);

  return (
    <>
      {/* Github */}
      <Button
        onClick={() => {
          setDisabled(true);
          setLoadingGithub(true);
          signIn("github", {
            callbackUrl: "/app",
          });
        }}
        disabled={disabled}
        loading={loadingGithub}
        icon={<IconBrandGithub size={20} />}
      >
        Continue with Github
      </Button>

      {/* Google */}
      <Button
        variant="outline"
        onClick={() => {
          setDisabled(true);
          setLoadingGoogle(true);
          signIn("google", {
            callbackUrl: "/app",
          });
        }}
        disabled={disabled}
        loading={loadingGoogle}
        icon={
          <Image
            src={GoogleLogo}
            alt="Google logo"
            width={20}
            height={20}
            className="size-5"
          />
        }
      >
        Continue with Google
      </Button>
    </>
  );
}

export default LoginButtons;
