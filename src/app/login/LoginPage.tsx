"use client"; // Ensures this runs on the client side

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, googleProvider } from "../firebase"; // Adjust the path as needed
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { FirebaseError } from "firebase/app";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter(); // ✅ Next.js Router for navigation

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/"); // ✅ Redirect to home page on success
    } catch (err: unknown) { // 🔹 Use 'unknown' to enforce type checking
      if (err instanceof FirebaseError) {
        setError(err.message); // ✅ Now TypeScript recognizes err.message
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/"); // ✅ Redirect to home page on success
    } catch (err: unknown) { // 🔹 Use 'unknown' to prevent implicit 'any'
      if (err instanceof FirebaseError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {/* Email & Password Login */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Sign In
          </button>
        </form>

        <div className="my-4 text-center text-gray-500">OR</div>

        {/* Google Sign-In */}
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 flex items-center justify-center gap-2"
        >
          <span>🔵</span> Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
