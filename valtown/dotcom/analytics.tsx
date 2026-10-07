// visits
import { DataRequest } from "https://esm.town/v/jxnblk/reactstream/index.tsx";

const API = "https://jxnblk-api.web.val.run/visits";

async function writeVisit(req, res) {
  const url = new URL(req.url);
  let search = "";
  try {
    search = JSON.stringify(req.data.searchParams);
  } catch (e) {
    console.log(e);
  }
  const data = {
    url: req.url,
    country: req.headers.get("cf-ipcountry"),
    pathname: url.pathname,
    search,
  };
  // console.log(req.headers);
  await fetch(API, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function analytics(req: DataRequest, res: Response, next): Promise<Response> {
  writeVisit(req, res);
  return next();
}
