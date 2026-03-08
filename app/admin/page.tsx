import { AdminPanel } from "@/components/AdminPanel/ui/AdminPanel";
import { redirect } from "next/navigation";

export default function AdminPage() {
  if (process.env.DISABLE_ADMIN === "true") {
    redirect("/");
  }

  return <AdminPanel />;
}
