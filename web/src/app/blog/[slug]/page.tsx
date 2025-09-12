import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/mdx";

type Params = { slug: string };

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPost({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return notFound();
  return (
    <main className="prose prose-neutral dark:prose-invert max-w-2xl mx-auto px-6 py-16">
      <h1 className="!mb-2">{post.meta.title}</h1>
      <div className="text-sm text-muted-foreground !mt-0">{new Date(post.meta.date).toLocaleDateString()}</div>
      <article className="mt-8">
        {/* MDXRemote on the RSC path directly renders the content */}
        <MDXRemote source={post.content} />
      </article>
    </main>
  );
}


