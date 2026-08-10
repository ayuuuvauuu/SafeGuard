"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { storeUserInfo, getUserProfile, signInWithGoogle, signInWithEmail, mapFirebaseError, firebaseConfigured } from "@/lib/firebase";
import { CreditDialog } from "@/components/credit-dialog";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setIsLoading(true);
    try {
      const user = await signInWithEmail(email.trim(), password);
      const profile = await getUserProfile(user);
      if (profile?.role && typeof window !== "undefined") {
        localStorage.setItem("userRole", profile.role);
      }
      router.push("/user-selection");
    } catch (err: any) {
      setError(mapFirebaseError(err, "Login failed. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignInClick = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const result = await signInWithGoogle();
      await storeUserInfo(result.user);
      const profile = await getUserProfile(result.user);
      if (profile?.role && typeof window !== "undefined") {
        localStorage.setItem("userRole", profile.role);
      }
      router.push("/user-selection");
    } catch (error: any) {
      setError(mapFirebaseError(error, "Google sign-in failed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      {showCredits && <CreditDialog open={showCredits} onOpenChange={setShowCredits} />}
      <Card className="w-full max-w-md space-y-4">
        <CardHeader>
          <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
          <CardTitle className="text-2xl">Welcome</CardTitle>
          <CardDescription>Sign in to access your SafeGuard account</CardDescription>
        </CardHeader>
        {!firebaseConfigured && (
          <div className="mx-6 mb-2 rounded-md bg-amber-500/15 px-3 py-2 text-sm text-amber-700 dark:text-amber-300">
            Firebase is not configured. Set <code>NEXT_PUBLIC_FIREBASE_*</code> environment variables to enable
            sign-in.
          </div>
        )}
        <CardContent>
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>
            {error && <div className="text-sm text-red-500 mt-2">{error}</div>}
            <Button type="submit" className="w-full" disabled={isLoading || !firebaseConfigured}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          <div className="relative my-4 text-center text-xs text-muted-foreground">or</div>

          <Button
            onClick={handleGoogleSignInClick}
            variant="outline"
            className="w-full"
            disabled={isLoading || !firebaseConfigured}
          >
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait</> : "Login with Google"}
          </Button>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}