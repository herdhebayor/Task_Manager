import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import  connectDB  from "@/database";
import User from "@/models/userModel";

export const authOptions = {
  session: {
    strategy: "jwt",
     maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    // ✅ GOOGLE LOGIN
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    

    // ✅ EMAIL LOGIN
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({
          email: credentials.email,
        });

        if (!user) throw new Error("User not found");

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) throw new Error("invalid credentials");

        return {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
          image: user.image,
		      address:user.address,
		      phone:user.phone,
		      role:user.role,
          profileCompleted: user.profileCompleted
        };
      },
    }),
  ],

  callbacks: {
    // ✅ GOOGLE AUTO REGISTER
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        await connectDB();

        let dbUser = await User.findOne({
          email: profile.email,
        }).lean();

        if (!dbUser) {
          dbUser = await User.create({
            email: profile.email,
            username: profile.name.replace(/\s+/g, ""),
            image: profile.picture,
            provider: "google",
            profileCompleted: false,
          });
        }

        user.id = dbUser._id.toString();
        user.username = dbUser.username;
        user.role = dbUser.role || 'user';
        user.profileCompleted = dbUser.profileCompleted;
      }

      return true;
    },

    //  STORE DATA IN TOKEN
    async jwt({ token, user }) {
      
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
        token.image = user.image;
        token.role = user.role;
        token.profileCompleted = user.profileCompleted;
        token.address = user.address;
        token.phone = user.phone;
      }

      // Refresh token data from DB on subsequent calls
      if (!token.id) return token;

      await connectDB();
      const dbUser = await User.findById(token.id).lean();
      if (dbUser) {
        token.id = dbUser._id.toString();
        token.username = dbUser.username;
        token.email = dbUser.email;
        token.image = dbUser.image || '';
        token.role = dbUser.role || 'user';
        token.profileCompleted = dbUser.profileCompleted || false;
        token.address = dbUser.address || '';
        token.phone = dbUser.phone || '';
      }


      return token;
    },

    // ✅ EXPOSE FULL SESSION
    async session({ session, token }) {
      session.user = {
        id: token.id,
        username: token.username,
        email: token.email,
        image: token.image,
        role: token.role,
        profileCompleted: token.profileCompleted,
        address: token.address,
        phone: token.phone,
      };

      return session;
    },
  },

  pages: {
    signIn: "/register",
  },
};