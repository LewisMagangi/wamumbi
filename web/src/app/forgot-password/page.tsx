import { redirect } from "next/navigation"

// Clerk's sign-in form has its own "Forgot password?" step, which handles the
// reset code and the new password. Old links to this page land there.
export default function ForgotPasswordPage() {
  redirect("/sign-in")
}
