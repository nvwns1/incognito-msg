import NextAuth from "next-auth/next";
<<<<<<< HEAD
import options from "./options";
=======

import { options } from "./options";
>>>>>>> 3f31b618e627b117f5778ffab5b3b529932a5bf9

const handler = NextAuth(options);

export { handler as GET, handler as POST };
