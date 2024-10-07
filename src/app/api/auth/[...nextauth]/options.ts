<<<<<<< HEAD
import dbConnection from "@/lib/dbConnection";
import UserModel from "@/model/User.model";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "text" },
=======
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import dbConnection from "@/lib/dbConnection";
import UserModel from "@/model/User";

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "Credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
>>>>>>> 3f31b618e627b117f5778ffab5b3b529932a5bf9
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        try {
          await dbConnection();
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
<<<<<<< HEAD
              { name: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error("Invalid Email or Password");
          }
          if (!user.isVerified) {
            throw new Error("Please verify your email address");
=======
              {
                username: credentials.identifier,
              },
            ],
          });

          if (!user) {
            throw new Error("Invalid credentials");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account first");
>>>>>>> 3f31b618e627b117f5778ffab5b3b529932a5bf9
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
<<<<<<< HEAD

=======
>>>>>>> 3f31b618e627b117f5778ffab5b3b529932a5bf9
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Invalid Password");
          }
<<<<<<< HEAD
        } catch (error) {
          console.error("Error connecting to database", error);
          throw new Error("Invalid Password");
=======
        } catch (err: any) {
          throw new Error(err);
>>>>>>> 3f31b618e627b117f5778ffab5b3b529932a5bf9
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
<<<<<<< HEAD
  secret: process.env.NEXT_PUBLIC_JWT_SECRET,
=======
  secret: process.env.NEXTAUTH_SECRET,
>>>>>>> 3f31b618e627b117f5778ffab5b3b529932a5bf9
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.username = user.username;
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.username = token.username;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
      }
      return session;
    },
  },
};
<<<<<<< HEAD

export default options;
=======
>>>>>>> 3f31b618e627b117f5778ffab5b3b529932a5bf9
