"use client";
import { useSession } from "next-auth/react";

export default function Component() {
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    return <div>Signed in as {session.user.email}</div>;
  }
  return <div>Not signed in</div>;
}
