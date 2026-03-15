import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import ExploreGrid from "@/components/post/ExploreGrid";

export default async function ExplorePage() {
  const session = await getSession();

  if (!session?.authenticated) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-[630px] mx-auto px-4 pt-6 pb-24">
        <header className="mb-6 border-b border-border/40 pb-4">
          <h1 className="text-xl font-semibold">Explore</h1>
        </header>

        <ExploreGrid />
      </div>
    </div>
  );
}
