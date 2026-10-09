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

export type Metadata = {
  title: string;
  date: Date; // |string;
  draft?: boolean;
  devlog?: number;
  tags?: string[];
};

export type PostData = {
  filename: string;
  slug: string;
  path: string;
  raw: string;
  content: string;
  data: Metadata; // Record<string, string>;
  tree: React.ReactElement;
  // TODO
  excerpt?: string;
};
