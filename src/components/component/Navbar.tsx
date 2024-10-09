"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "../ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <nav className="p-4 md-p-6 shadow-md bg-gray-900 text-white z-10 relative">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link href="#" className="text-xl font-bold mb-4 md:mb-0">
          Incognito Message
        </Link>
        {session ? (
          <>
            <span>Welcome, {user?.username || user?.email}</span>
            <Button
              onClick={() => signOut()}
              className="w-full md:w-auto bg-slate-100 text-black"
              variant="outline"
            >
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button
              className="w-full md:w-auto bg-slate-100 text-black"
              variant="outline"
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
