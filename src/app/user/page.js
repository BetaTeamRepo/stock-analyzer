"use client"; // Ensures the component only runs on the client

import Navbar from "../components/Navbar";

import BottomNav from "../components/BottomNav";

import { auth } from "../firebase"; // Ensure you have Firebase initialized
import { useAuthState } from "react-firebase-hooks/auth";

const UserProfile = () => {
  const [user] = useAuthState(auth);

  if (!user) {
    return (
      <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar />
      <p className="p-4">User not signed in.</p>
       {/* Bottom Navigation */}
    <BottomNav />
    </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar />
      
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-xl font-bold mb-4">User Profile</h1>
      <div className="flex items-center mb-4">
        <img
          src={user.photoURL || "https://via.placeholder.com/100"}
          alt="User Avatar"
          className="w-16 h-16 rounded-full mr-4"
        />
        <div>
          <p className="text-lg font-semibold">{user.displayName}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
      </div>
      <button
        onClick={() => auth.signOut()}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Sign Out
      </button>
    </div>
    {/* Bottom Navigation */}
    <BottomNav />
    </div>
  );
};

export default UserProfile;