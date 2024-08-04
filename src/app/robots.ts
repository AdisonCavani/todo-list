import type { MetadataRoute } from "next";

function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/app",
    },
    sitemap: "https://todo.k1ng.dev/sitemap.xml",
    host: "https://todo.k1ng.dev",
  };
}

export default robots;
