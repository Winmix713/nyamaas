import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <Link
        href="/"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Predictions
      </Link>
      <Link
        href="/h2h"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/h2h" ? "text-primary" : "text-muted-foreground",
        )}
      >
        H2H
      </Link>
      <Link
        href="/teams"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/teams" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Teams
      </Link>
      <Link
        href="/matches"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/matches" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Matches
      </Link>
      <Link
        href="/control-panel"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/control-panel" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Control Panel
      </Link>
      <Link
        href="/settings"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/settings" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Settings
      </Link>
    </nav>
  )
}

