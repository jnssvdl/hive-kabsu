import { auth, provider } from "@/lib/firebase";
import { onAuthStateChanged, signInWithPopup, type User } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  googleLogin: () => Promise<User | null>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (
        process.env.NODE_ENV === "production" &&
        !user.email?.endsWith("@cvsu.edu.ph")
      ) {
        await auth.signOut();
        setUser(null);
        toast.error("Only @cvsu.edu.ph emails are allowed");
        return null;
      }

      setUser(user);
      return user;
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
      return null;
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();

      setUser(null);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
