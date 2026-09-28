import { supabase } from "@/lib/supabase";
import { saveCredential, setCurrentSession, clearSession } from "@/lib/credentials";
import type { FamilyMemberDetails, Member, MembershipType, PujaCategory } from "@/types";

// Supabase is the source of truth for members. The rest of the app still reads
// the signed-in member from localStorage, so after every sign-in we mirror the
// member's row (and family) into that local store.
export async function syncSupabaseMember(userId: string): Promise<Member | null> {
  const [memberRes, familyRes] = await Promise.all([
    supabase.from("members").select("*").eq("id", userId).maybeSingle(),
    supabase.from("family_members").select("*").eq("member_id", userId).order("created_at"),
  ]);

  const row = memberRes.data;
  if (!row) return null;

  const familyMembers: FamilyMemberDetails[] = (familyRes.data ?? []).map((f) => ({
    id: f.id,
    name: f.name,
    contact: f.contact,
    age: f.age,
    aadharFile: null,
    panNumber: "",
  }));

  const member: Member = {
    id: row.id,
    memberId: row.member_id,
    fullName: row.full_name,
    email: row.email,
    mobile: row.mobile,
    address: row.address,
    city: row.city,
    membershipType: row.membership_type as MembershipType,
    familyMembers: familyMembers.length,
    joinedOn: row.joined_on,
    validUntil: row.valid_until,
    role: row.role,
    pujas: row.pujas as PujaCategory[],
  };

  saveCredential({ email: member.email, password: "", member, familyMembers });
  setCurrentSession(member.email);
  return member;
}

export async function signOutMember() {
  await supabase.auth.signOut();
  clearSession();
}
