export const prerender = false;

import type { WordpressClientIdentifier } from "@/types";
import { purgeCache } from "@netlify/functions";

function sourceToProject(sourceUrl: string): WordpressClientIdentifier | null {
  if(sourceUrl === "https://adamfortuna.com/") {
    return "adamfortuna";
  } else if(sourceUrl === "https://minafi.com/") {
    return "minafi";
  } else if(sourceUrl === "https://hardcover.com/") {
    return "hardcover";
  } else {
    return null;
  }
}

export async function POST({ request }: { request: Request }) {
  const body = await request.json();
  const { post_id } = body;
  const postTags = Object.keys(body.taxonomies?.post_tag || {});

  if(!post_id) {
    return new Response("Unauthorized", { status: 401 });
  }

  // See below for information on webhook security
  if (request.headers.get("x-wordpress-webhook-secret") !== import.meta.env.WORDPRESS_WEBHOOK_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }
  const project = sourceToProject(request.headers.get("x-wp-webhook-source") || "");
  if(!project) {
    return new Response("Unauthorized", { status: 401 });
  }
  const tags = [
    `post-id-${body.post_id}`,
    `blog/projects/${project}`,
    'blog',
    'blog/all',
    ...postTags
  ]
  await purgeCache({ tags });

  return new Response(`Revalidated entry with id ${body.sys.id}`, { status: 200 });
}