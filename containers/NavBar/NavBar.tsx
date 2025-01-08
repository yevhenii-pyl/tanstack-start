import { Link } from "@tanstack/react-router";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/tanstack-start";

import { ChartColumnBigIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const NavBar = () => (
  <nav className="bg-primary p-4 h-20 text-white flex items-center justify-between">
    <Link to="/" className="flex gap-1 items-center font-bold text-2x">
      <ChartColumnBigIcon className="text-lime-500"/> TanTracker
    </Link>
    <div>
      <SignedOut>
        <div className="text-white flex items-center">
          <Button asChild variant="link" className="text-white">
            <SignInButton/>
          </Button>
          <div className="w-[1px] h-8 bg-zinc-700"/>
          <Button asChild variant="link" className="text-white">
            <SignUpButton/>
          </Button>
        </div>
      </SignedOut>
      <SignedIn>
        <UserButton
          showName
          appearance={{
            elements: {
              userButtonOuterIdentifier: {
                color: "white",
              }
            }
          }}
        />
      </SignedIn>
    </div>
  </nav>
)

export default NavBar;
