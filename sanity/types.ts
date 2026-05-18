import type { PortableTextBlock } from "@portabletext/react";

export interface Notice {
  _id: string;
  title: string;
  slug: string;
  content: PortableTextBlock[];
  createdAt: string;
}

export interface FAQ {
  _id: string;
  question: string;
  answer: PortableTextBlock[];
  category: string;
  slug?: {
    current: string;
  };
}
