import logo from "@/assets/logo.png";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-md">
      <nav className="m-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity duration-200">
          <Image src={logo} width={40} height={40} alt="Dev Naukri logo" />
          <span className="text-2xl font-bold tracking-tight text-white">Dev Naukri</span>
        </Link>
        <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md font-semibold shadow-md transition-colors duration-200">
          <Link href="/jobs/new">Post a Job</Link>
        </Button>
      </nav>
    </header>
  );
}
