import { redirect } from "next/navigation";

// The old generic membership wizard (Individual/Family/Patron/Lifetime) has
// been superseded by the wireframe-driven /register flow (Core/General).
export default function MembershipJoinPage() {
  redirect("/register");
}
