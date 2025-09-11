import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";

export const dynamic = "force-static";

export default async function BlogIndex() {
  const posts = await getAllPosts();
  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-medium tracking-tight">Blog</h1>
      <ul className="mt-8 space-y-4">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link className="underline-offset-4 hover:underline" href={`/blog/${p.slug}`}>
              {p.title}
            </Link>
            <div className="text-sm text-neutral-500">{new Date(p.date).toLocaleDateString()}</div>
          </li>
        ))}
        {posts.length === 0 && (
          <li className="text-neutral-500">No posts yet.</li>
        )}
      </ul>
    </main>
  );
}


