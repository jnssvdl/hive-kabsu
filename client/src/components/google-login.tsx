import { Button } from "./ui/button";
import { FaGoogle } from "react-icons/fa";
import { useAuth } from "./auth-context";

export function GoogleLogin() {
  const { googleLogin } = useAuth();

  return (
    <Button onClick={googleLogin} className="rounded-full" size={"lg"}>
      <FaGoogle className="mr-1" />
      Sign in with Google
    </Button>
  );
}
