"use client";

import Image from "next/image";

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface ProfileHeaderProps {
  user: User;
  ordersCount?: number;
 
}

export default function ProfileHeader({
  user,
  ordersCount = 0,

}: ProfileHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl shadow-lg flex flex-col md:flex-row items-center gap-6 border border-indigo-100 max-w-3xl mx-auto">
      {/* Avatar */}
      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-200">
        <Image
          src={user.image || "/globe.svg"}
          alt={user.name || "User"}
          width={96}
          height={96}
          className="object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 text-center md:text-left">
        <h2 className="text-3xl font-bold text-indigo-700">{user.name}</h2>
        <p className="text-gray-600">{user.email}</p>

        <div className="flex justify-center md:justify-start gap-8 mt-4 text-gray-700 font-medium">
          <div className="flex flex-col items-center md:items-start">
    

          </div>
         
        </div>
      </div>
    </div>
  );
}
