import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import CreatePostClient from "@/components/upload/CreatePostClient";

export default async function CreatePostPage() {
  const session = await getSession();

  if (!session?.authenticated) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-[630px] mx-auto px-4 pt-6 pb-24">
        {/* <header className="mb-6 border-b border-border/40 pb-4">
          <h1 className="text-xl font-semibold">New post</h1>
        </header> */}
        <CreatePostClient />
      </div>
    </div>
  );
}
