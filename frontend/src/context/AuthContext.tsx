import { createContext, useContext, useEffect, useState } from "react";
import { subscribeAuth, loginWithGoogle, logout } from "../lib/firebase";
import { api } from "../lib/api";

type BackendUser = { _id: string; name?: string; email?: string };

type AuthCtx = {
  firebaseUser: any;
  backendUser: BackendUser | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({
  firebaseUser: null,
  backendUser: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [backendUser, setBackendUser] = useState<BackendUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return subscribeAuth(async (u) => {
      setFirebaseUser(u);
      if (u?.email) {
        const res = await api.post("/users/upsert", {
          firebaseId: u.uid,
          email: u.email,
          name: u.displayName,
        });
        setBackendUser(res.data);
      } else {
        setBackendUser(null);
      }
      setLoading(false);
    });
  }, []);

  return (
    <Ctx.Provider
      value={{
        firebaseUser,
        backendUser,
        loading,
        login: async () => {
          await loginWithGoogle();
        },
        logout: async () => {
          await logout();
        },
      }}
    >
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => useContext(Ctx);
