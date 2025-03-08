import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import Image from "next/image";
import { RainbowButton } from "../ui/rainbow-button";
import { Button } from "../ui/button";

const NavBar = () => {
  // Dynamic links array
  const links = [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms & Conditions", href: "/terms-and-conditions" },
    // { name: "Login", href: "/login", isButton: true },
    { name: "Start Free", href: "/login", isButton: true },
  ];

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href={"/"}>
          <Image
            src={"/logo.png"}
            alt={"Done & Paid Logo"}
            width={180}
            height={180}
          />
        </Link>

        {/* Middle Menu */}
        <nav className="hidden md:flex space-x-6">
          {links
            .filter((link) => !link.isButton)
            .map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="hover:text-blue-500 text-sm font-semibold text-[#282828]"
              >
                {link.name}
              </Link>
            ))}
        </nav>

        {/* Get Started Button */}
        <div className="hidden md:block">
          {links
            .filter((link) => link.isButton)
            .map((link) => (
              <Link key={link.name} href={link.href} className="te">
                <RainbowButton>{link.name}</RainbowButton>
              </Link>
            ))}
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
                strokeWidth={3}
                stroke="currentColor"
                className="w-10 h-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-3/4 bg-white">
            <SheetHeader>
              <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col space-y-4 mt-4">
              {links.map((link) =>
                link.isButton ? (
                  <Link key={link.name} href={link.href}>
                    <Link href="/login">
                      <RainbowButton> {link.name}</RainbowButton>
                    </Link>
                  </Link>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    className=" hover:text-blue-500"
                  >
                    {link.name}
                  </Link>
                )
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default NavBar;
