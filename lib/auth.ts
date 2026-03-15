import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Role = "super_admin" | "admin" | "data_entry" | "viewer" | "reports_manager";

export async function requireUser(allowedRoles?: Role[]) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/login");
  }

  // Future implementation: Role-Based Access Control (RBAC)
  // const userRole = (data.user.user_metadata?.role as Role) || "admin";
  // if (allowedRoles && !allowedRoles.includes(userRole)) {
  //   redirect("/dashboard"); // or show a designated Unauthorized page
  // }

  return data.user;
}
