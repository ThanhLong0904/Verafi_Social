import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Feed from "@/components/post/Feed";
import CreatePostBox from "@/components/home/CreatePostBox";
import Header from "@/components/layout/Header";

export default async function HomePage() {
  const session = await getSession();

  if (!session?.authenticated) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen">
      {/* Header with wallet address */}
      <Header />
      <div className="max-w-[630px] mx-auto bg-surface border border-border/30">
        {/* Top Bar */}

        {/* Create Post Box */}
        <CreatePostBox />

        {/* Feed */}
        <Feed />
      </div>
    </div>
  );
}
