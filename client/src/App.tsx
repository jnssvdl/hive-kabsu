import { useEffect } from "react";
import { io } from "socket.io-client";

function App() {
  useEffect(() => {
    const token = localStorage.getItem("yappr_token"); // your app's custom JWT

    const socket = io("http://localhost:3000", {
      auth: { token },
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return <div>Check your console for socket status</div>;
}

export default App;
