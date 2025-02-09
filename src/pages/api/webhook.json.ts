export const prerender = false

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
  try {    
    // See below for information on webhook security
    if (request.headers.get("x-wordpress-webhook-secret") !== import.meta.env.WORDPRESS_WEBHOOK_SECRET) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { post_id } = body;    
    if(!post_id) {
      return new Response("No Post ID", { status: 401 });
    }

    const project = sourceToProject(request.headers.get("x-wp-webhook-source") || "");
    if(!project) {
      return new Response("No Project", { status: 401 });
    }

    const postTags = Object.keys(body.taxonomies?.post_tag || {});
    const tags = [
      `post-id-${post_id}`,
      `blog/projects/${project}`,
      'blog',
      'blog/all',
      ...postTags
    ]
    await purgeCache({
      siteID: import.meta.env.NETLIFY_SITE_ID,
      tags,
      token: import.meta.env.NETLIFY_TOKEN
    });
  
    return new Response(`Revalidated entry with id ${post_id}`, { status: 200 });
  } catch(e) {
    return new Response(`Something went wrong: ${e}`, { status: 500 });
  }
}