// "use client"
//
// import { useState, type FormEvent } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { ArrowLeft, Loader2 } from "lucide-react"
// import Link from "next/link"
//
// export default function Login() {
//   const [userId, setUserId] = useState("")
//   const [password, setPassword] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState("")
//   const router = useRouter()
//
//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)
//     setError("")
//
//     try {
//       // Simple validation for demo credentials
//       if (userId === "Admin" && password === "jaihind") {
//         // Redirect to user selection
//         router.push("/user-selection")
//       } else {
//         throw new Error("Invalid ID or Password")
//       }
//     } catch (error: any) {
//       setError(error.message)
//       setIsLoading(false)
//     }
//   }
//
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground mb-2">
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back
//           </Link>
//           <CardTitle className="text-2xl">Welcome back</CardTitle>
//           <CardDescription>Login to access your SafeGuard account</CardDescription>
//         </CardHeader>
//         <form onSubmit={handleSubmit}>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="userId">ID</Label>
//               <Input
//                 id="userId"
//                 value={userId}
//                 onChange={(e) => setUserId(e.target.value)}
//                 placeholder="Enter your ID"
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter your password"
//                 required
//               />
//             </div>
//             {error && <div className="text-sm text-red-500 mt-2">{error}</div>}
//             <div className="text-right">
//               <Link href="/forgot-password" className="text-sm text-primary hover:underline">
//                 Forgot password?
//               </Link>
//             </div>
//             <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
//               <p className="font-medium mb-1">Enter this ID Password, Don't Register:</p>
//               <p>ID: Admin</p>
//               <p>Password: jaihind</p>
//             </div>
//           </CardContent>
//           <CardFooter>
//             <Button type="submit" className="w-full" disabled={isLoading}>
//               {isLoading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Please wait
//                 </>
//               ) : (
//                 "Login"
//               )}
//             </Button>
//           </CardFooter>
//         </form>
//       </Card>
//     </main>
//   )
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link"; 
import { Loader2 } from "lucide-react";
import { storeUserInfo, signInWithGoogle } from "@/lib/firebase";
import { CreditDialog } from "@/components/credit-dialog";


export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const router = useRouter();
  const [googleLoginError, setGoogleLoginError] = useState<string | null>(null);

  const handleSubmit = (e: any) => {
    e.preventDefault()
  };
  const handleGoogleSignInClick = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGoogle();
      await storeUserInfo(result.user)
      router.push("/user-selection");
      
    } catch (error: any) {
      setGoogleLoginError(`Google sign-in failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      {showCredits && <CreditDialog />}
      <Card className="w-full max-w-md space-y-4">
        <CardHeader>
          <Link
            href="/"
            className="flex items-center text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
          <CardTitle className="text-2xl">Welcome</CardTitle>
          <CardDescription>Login to access your SafeGuard account</CardDescription>
        </CardHeader>
        <CardContent>
            <Button
              onClick={() => {                 
                    handleGoogleSignInClick();
              }}
              variant="outline"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait</> : "Login with Google"}
            </Button>
          {googleLoginError && <div className="text-sm text-red-500 mt-2">{googleLoginError}</div>}
        </CardContent>

      </Card>    
    </main>
  );
}
