import { useEffect } from "react";
import { GoogleLogin } from "./components/google-login";

function App() {
  useEffect(() => {
    fetch("/api/ping")
      .then((res) => res.text())
      .then((text) => console.log("Backend says:", text))
      .catch((err) => console.error("Error talking to backend:", err));
  }, []);

  return (
    <main>
      <h1>Hello, World</h1>
      <GoogleLogin />
    </main>
  );
}

export default App;
