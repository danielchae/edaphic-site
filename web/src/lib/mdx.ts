import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export type PostMeta = {
  title: string;
  date: string;
  summary?: string;
  slug: string;
};

export async function getPostSlugs(): Promise<string[]> {
  try {
    const files = await fs.readdir(POSTS_DIR);
    return files
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => f.replace(/\.mdx$/, ""));
  } catch (e) {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<{ meta: PostMeta; content: string } | null> {
  try {
    const fullPath = path.join(POSTS_DIR, `${slug}.mdx`);
    const file = await fs.readFile(fullPath, "utf8");
    const { data, content } = matter(file);
    const meta: PostMeta = {
      title: (data.title as string) ?? slug,
      date: (data.date as string) ?? new Date().toISOString(),
      summary: (data.summary as string) ?? "",
      slug,
    };
    return { meta, content };
  } catch (e) {
    return null;
  }
}

export async function getAllPosts(): Promise<PostMeta[]> {
  const slugs = await getPostSlugs();
  const posts: PostMeta[] = [];
  for (const slug of slugs) {
    const post = await getPostBySlug(slug);
    if (post) posts.push(post.meta);
  }
  return posts.sort((a, b) => +new Date(b.date) - +new Date(a.date));
}


