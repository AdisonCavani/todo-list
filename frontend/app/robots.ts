import { MetadataRoute } from "next";

export const runtime = "edge";

function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/app",
    },
    sitemap: "https://todo.k1ng.dev/sitemap.xml",
  };
}

export default robots;
