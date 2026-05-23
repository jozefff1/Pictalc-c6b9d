import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import LandingPage from "@/components/features/LandingPage";

export default async function Home() {
  const session = await auth();
  if (!session) return <LandingPage />;
  redirect('/dashboard');
}

