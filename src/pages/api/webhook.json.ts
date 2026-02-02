export const prerender = false

import type { WordpressClientIdentifier } from "@/types";
import { purgeCache } from "../../lib/cache";
import { getEnv } from "../../middleware";

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

/**
 * Determine content type from WordPress webhook payload
 */
function getContentType(body: any): 'lain' | 'post' | 'page' | 'photo' | 'project' {
  const postType = body.post_type || body.post?.post_type || 'post';
  if (postType === 'lain') return 'lain';
  if (postType === 'photos' || postType === 'photoblog') return 'photo';
  if (postType === 'project') return 'project';
  if (postType === 'page') return 'page';
  return 'post';
}

export async function POST({ request }: { request: Request }) {
  try {    
    // Verify webhook secret
    if (request.headers.get("x-wordpress-webhook-secret") !== getEnv('WORDPRESS_WEBHOOK_SECRET')) {
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

    const contentType = getContentType(body);
    const postTags = Object.keys(body.taxonomies?.post_tag || {});
    
    // Build cache tags based on content type
    let tags: string[] = [];
    
    if (contentType === 'lain') {
      // Lain posts have their own cache tags
      tags = [
        `lain-post-${post_id}`,
        'lain',
        'lain-index',
        ...postTags,
      ];
    } else {
      // Regular blog posts
      tags = [
        `post-id-${post_id}`,
        `blog/projects/${project}`,
        'blog',
        'blog/all',
        ...postTags,
      ];
    }
    
    await purgeCache({ tags });
  
    return new Response(`Revalidated ${contentType} with id ${post_id}. Tags: ${tags.join(', ')}`, { status: 200 });
  } catch(e) {
    return new Response(`Something went wrong: ${e}`, { status: 500 });
  }
}