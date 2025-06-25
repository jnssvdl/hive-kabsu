import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../lib/firebase";

export function GoogleLogin() {
  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user.email?.endsWith("@cvsu.edu.ph")) {
        alert("Only @cvsu.edu.ph emails are allowed");
        return;
      }

      const idToken = await user.getIdToken();

      const res = await fetch("/api/auth/firebase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: idToken }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("yappr_token", data.token);
      alert("Logged in!");
    } catch (err) {
      console.error(err);
      alert("Login failed.");
    }
  };

  return <button onClick={login}>Sign in with Google</button>;
}
