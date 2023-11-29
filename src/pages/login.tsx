import { type FirebaseError } from "firebase/app";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import { signInWithEmail } from "~/client/login";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TypographyH1 as H1 } from "@/components/ui/typography";

interface LoginProps {
  children?: React.ReactNode;
}

const Login: NextPage<LoginProps> = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await toast.promise(signInWithEmail(email, password), {
        loading: "Loading",
        success: () => {
          void router.push("/");
          return "Logged in!";
        },
        error: (err: FirebaseError) => err.message,
      });
    } catch (e) {}
  };

  return (
    <div className="grid gap-y-4 p-4">
      <H1>Login Page</H1>

      <form onSubmit={handleSubmit} className="grid gap-y-2">
        <Input
          type="text"
          name=""
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <Input
          type="password"
          name=""
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <Button type="submit" className="w-full">
          Enviar
        </Button>
      </form>
    </div>
  );
};

export default Login;
