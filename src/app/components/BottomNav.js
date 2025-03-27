"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/" },
    { name: "Stock", href: "/stockprofile" },
    { name: "AIChat", href: "/aichat" },
    { name: "Insight", href: "/insight" },
    { name: "User", href: "/user" },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t p-2 flex justify-around">
      {links.map((link) => (
        <Link key={link.name} href={link.href} className="text-center">
          <div
            className={`text-sm p-2 rounded ${pathname === link.href ? "bg-gray-300" : ""}`}
          >
            {link.name}
          </div>
        </Link>
      ))}
    </nav>
  );
}
