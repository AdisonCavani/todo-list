import { auth } from "@lib/auth";
import SignInButton from "./sign-in-btn";

async function SignInWrapper() {
  const { user } = await auth();

  return <SignInButton user={user} />;
}

export default SignInWrapper;
