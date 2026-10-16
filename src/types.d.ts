declare module "*.css" {
  const text: string;
  export default text;
};
declare module "*.md" {
  const text: string;
  export default text;
};

export type Page = {
  path: string;
  html: string;
};

export type Context = {
  css: string;
  about: React.ReactElement;
};

export type Metadata = {
  title: string;
  date: Date; // |string;
  draft?: boolean;
  devlog?: number;
  tags?: string[];
  description?: string;
  image?: string;
  // pins or re-rolls the generated design; defaults to the slug
  seed?: string;
};

export type PostData = {
  filename: string;
  slug: string;
  path: string;
  raw: string;
  content: string;
  data: Metadata; // Record<string, string>;
  tree: React.ReactElement;
  // the markup before rehypeSections, for api/all.json
  hast: import("hast").Root;
  // the text before <!-- more -->, or the first paragraph (see rehypeExcerpt)
  excerpt?: {
    hast: import("hast").Root;
    tree: React.ReactElement;
  };
};
