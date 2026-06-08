import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/env";

type SeoInput = {
  title: string;
  description: string;
  path: string;
};

export function pageMetadata({ title, description, path }: SeoInput): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      type: "website"
    },
    twitter: {
      card: "summary",
      title,
      description
    }
  };
}

export function articleMetadata({ title, description, path }: SeoInput): Metadata {
  return {
    ...pageMetadata({ title, description, path }),
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      type: "article"
    }
  };
}
