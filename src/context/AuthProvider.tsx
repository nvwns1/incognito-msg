"use client";

import { SessionProvider } from "next-auth/react";

<<<<<<< HEAD
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default AuthProvider;
=======
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
>>>>>>> 3f31b618e627b117f5778ffab5b3b529932a5bf9
