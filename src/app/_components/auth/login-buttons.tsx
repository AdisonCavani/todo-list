import Link from "@components/router/link";
import { buttonVariants } from "@components/ui/button";
import GoogleLogo from "@images/google.svg";
import { IconBrandGithub } from "@tabler/icons-react";
import Image from "next/image";

function LoginButtons() {
  return (
    <>
      {/* Github */}
      <Link href="/auth/github" className={buttonVariants()}>
        <IconBrandGithub size={20} />
        Continue with Github
      </Link>

      {/* Google */}
      <Link
        href="/auth/google"
        className={buttonVariants({ variant: "outline" })}
      >
        <Image
          src={GoogleLogo}
          alt="Google logo"
          width={20}
          height={20}
          className="size-5"
        />
        Continue with Google
      </Link>
    </>
  );
}

export default LoginButtons;
