import type { MetadataRoute } from "next";

function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/changelog",
    "/privacy",
    "/terms-of-service",
    "/auth",
  ].map((route) => ({
    url: "https://todo.k1ng.dev" + route,
    lastModified: new Date(),
  }));

  return [...routes];
}

export default sitemap;
