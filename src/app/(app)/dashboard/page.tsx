<<<<<<< HEAD
"use client";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const DashBoardPage = () => {
  const router = useRouter();

  const session = useSession();

  useEffect(() => {
    console.log(session);
  }, [session]);

  return (
    <div>
      This is dashboard {session.data?.user?.email}
      <Button
        onClick={() => {
          signOut();
          router.push("/sign-in");
        }}
      >
        Click me
      </Button>
    </div>
  );
};

export default DashBoardPage;
=======
import React from "react";

const Dashbaord = () => {
  return <div></div>;
};

export default Dashbaord;
>>>>>>> 3f31b618e627b117f5778ffab5b3b529932a5bf9
