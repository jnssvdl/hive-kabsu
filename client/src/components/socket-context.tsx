import React, { createContext, useContext, useEffect, useState } from "react";
import { socket } from "../lib/socket";
import { useAuth } from "./auth-context";

type SocketContextType = {
  socket: typeof socket;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const { user } = useAuth();

  useEffect(() => {
    const connectSocket = async () => {
      if (!user) {
        socket.disconnect();
        return;
      }

      try {
        const token = await user.getIdToken();

        socket.auth = { token };

        socket.connect();
      } catch (error) {
        console.error("Error getting token:", error);
      }
    };

    connectSocket();

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used within a SocketProvider");
  return ctx;
};
