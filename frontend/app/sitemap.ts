import { MetadataRoute } from "next";

export const runtime = "edge";

function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/health", "/privacy", "/terms-of-service", "/auth"].map(
    (route) => ({
      url: "https://todo.k1ng.dev" + route,
      lastModified: new Date(),
    })
  );

  return [...routes];
}

export default sitemap;
