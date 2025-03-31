import { signOut } from "@/lib/auth";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
 
export function SignOut({ className }: { className?: string }) {
  return (
    <form
      action={async () => {
        "use server"
        await signOut()
      }}
    >
      <Button type="submit" variant="outline" className={cn("cursor-pointer", className)}>
        <LogOut />
        Sign out
      </Button>
    </form>
  );
}