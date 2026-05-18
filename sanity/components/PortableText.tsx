import {
  PortableText as PortableTextComponent,
  type PortableTextBlock,
} from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface ImageValue {
  asset?: {
    _ref: string;
  };
  alt?: string;
  caption?: string;
}

interface LinkValue {
  href: string;
}

const components = {
  types: {
    image: ({ value }: { value: ImageValue }) => {
      if (!value?.asset?._ref) return null;
      return (
        <figure className="my-6">
          <Image
            src={urlFor(value).width(800).url()}
            alt={value.alt || ""}
            width={800}
            height={400}
            className="rounded-lg"
          />
          {value.caption && (
            <figcaption className="text-center text-sm text-gray-500 mt-2">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h1: ({ children }: { children?: React.ReactNode }) => (
      <h1 className="text-xl md:text-2xl font-bold text-[#212121] mt-6 mb-3">{children}</h1>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="text-lg md:text-xl font-bold text-[#212121] mt-5 mb-2">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="text-base md:text-lg font-semibold text-[#424242] mt-4 mb-2">{children}</h3>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-3 leading-relaxed">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="list-disc list-outside ml-5 mb-4 space-y-2">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="list-decimal list-outside ml-5 mb-4 space-y-2">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li className="pl-2 leading-relaxed">{children}</li>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <li className="pl-2 leading-relaxed">{children}</li>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-bold text-[#212121]">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic">{children}</em>
    ),
    link: ({ children, value }: { children?: React.ReactNode; value?: LinkValue }) => {
      if (!value?.href) return <>{children}</>;
      return (
        <a
          href={value.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0565FF] hover:underline font-medium"
        >
          {children}
        </a>
      );
    },
  },
};

export function PortableText({
  value,
}: {
  value: PortableTextBlock[] | PortableTextBlock;
}) {
  return <PortableTextComponent value={value} components={components} />;
}
