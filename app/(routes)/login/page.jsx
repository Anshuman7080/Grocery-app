"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session]);

  if (status === "loading")
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading...
      </div>
    );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
      callbackUrl: "/",
    });
    setLoading(false);
    if (res?.ok && res?.url) {
      router.push(res.url);
    } else {
      console.log("Login failed:", res?.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 p-6">
      <Card className="w-full max-w-md shadow-2xl border border-green-100 bg-white/80 backdrop-blur-sm rounded-2xl transition-all duration-300 hover:shadow-green-200 hover:-translate-y-1">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-green-100 text-green-700 w-16 h-16 flex items-center justify-center rounded-full shadow-inner">
            🔐
          </div>
          <h2 className="text-3xl font-bold text-green-700 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-sm">Login to access your account</p>
        </CardHeader>

        <CardContent className="space-y-5">
          <form onSubmit={handleCredentialsLogin} className="space-y-4">
            <div className="space-y-2 text-left">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
                className="focus:ring-2 focus:ring-green-500 transition-all duration-200"
              />
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                className="focus:ring-2 focus:ring-green-500 transition-all duration-200"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login with Email"}
            </Button>
          </form>

          <Separator className="my-6" />

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 border-gray-300 hover:border-green-400 hover:text-green-600 transition-all duration-300"
              onClick={() => signIn("github", { callbackUrl: "/" })}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.43-4.04-1.43-.55-1.4-1.34-1.77-1.34-1.77-1.09-.74.08-.72.08-.72 1.21.09 1.84 1.25 1.84 1.25 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.91 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.37 11.37 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.59-2.81 5.6-5.49 5.9.43.37.82 1.09.82 2.21v3.28c0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12C24 5.37 18.63 0 12 0z" />
              </svg>
              Continue with GitHub
            </Button>
          </div>

          <Separator className="my-6" />

          <div className="text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-green-600 font-medium hover:underline hover:text-green-700 transition-colors duration-200"
            >
              Register here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
