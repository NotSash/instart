import { redirect } from "next/navigation"

// Signup and Login are the same flow (Google OAuth only).
// Redirect /signup → /login to avoid duplicate pages.
export default function SignupPage() {
  redirect("/login")
}
