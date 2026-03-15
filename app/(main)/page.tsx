import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Feed from "@/components/post/Feed";
import CreatePostBox from "@/components/home/CreatePostBox";

export default async function HomePage() {
  const session = await getSession();

  if (!session?.authenticated) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 border-b border-border/40 bg-background/95 backdrop-blur-md">
        <div className="max-w-[630px] mx-auto px-4 py-3 flex justify-center">
          <button className="flex items-center gap-2 text-foreground font-semibold text-[15px] hover:bg-white/5 px-3 py-1.5 rounded-lg transition-colors">
            For you
            <svg
              className="w-4 h-4 text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Create Post Box */}
      <CreatePostBox />

      {/* Feed */}
      <div className="max-w-[630px] mx-auto">
        <Feed />
      </div>
    </div>
  );
}
