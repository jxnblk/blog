// RSS middleware for jxnblk.com

// import data from "https://blog.jxnblk.com/api/all.json" with { type: "json" };
import type { Middleware } from "https://esm.town/v/jxnblk/reactstream/index.tsx";

function generateRSSFeed(posts) {
  return `
    <rss version="2.0">
      <channel>
        <title>Jxnblk Blog</title>
        <link>https://jxnblk.com</link>
        <description>Brent Jackson - design engineer and aspiring indie game dev</description>
        ${
    posts.map(post => `
          <item>
            <title>${escapeXml(post.title)}</title>
            <link>https://jxnblk.com/blog/${post.slug}</link>
            <description>${escapeXml(post.excerpt)}</description>
            <pubDate>${new Date(post.date).toUTCString()}</pubDate>
            <guid>https://jxnblk.com/blog/${post.slug}</guid>
          </item>
        `).join("")
  }
      </channel>
    </rss>
  `;
}

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, c => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case "\"":
        return "&quot;";
    }
  });
}

export const rss = (data: any): Middleware => async (req, res, next) => {
  if (req.data.pathname !== "/rss.xml") return next();
  const rss = generateRSSFeed(data.posts);
  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
};
