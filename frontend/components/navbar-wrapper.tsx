"use client";
import { usePathname } from "next/navigation";
import EcomNavbar from "@/components/ecomnavbar";

const NO_NAVBAR_PATHS = ["/admin", "/", "/login", "/register", "/forgot-password", "/reset-password", "/otp-verification"];

export default function NavbarWrapper() {
  const pathname = usePathname();
  if (NO_NAVBAR_PATHS.some(path => pathname === path || pathname?.startsWith(path + "/"))) return null;
  return <EcomNavbar />;
}
