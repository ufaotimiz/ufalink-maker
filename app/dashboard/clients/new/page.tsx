import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Header } from "@/components/Header";
import { NewClientForm } from "@/components/NewClientForm";

export default async function NewClientPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <Header />
      <main className="container flex-1 py-8 lg:py-12">
        <div className="mx-auto max-w-xl">
          <NewClientForm />
        </div>
      </main>
    </div>
  );
}
