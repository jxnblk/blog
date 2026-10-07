export type RequestHandler = (request: Request) => Promise<Response>;
export type DataFetcher<T> = (request: Request) => Promise<T>;

export type DataRequest = Request & { data: any };
export type NextCallback = () => Promise<Response>;
export type Middleware = (req: DataRequest, res: Response, callback: NextCallback) => Promise<Response>;

export interface ReactStreamProps {
  url: URL;
  pathname: string;
  search: string;
  searchParams: Record<string, string>;
  headers: Headers;
  cookie: string;
}