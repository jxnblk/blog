// uptime healthcheck
import { email } from "https://esm.town/v/std/email?v=11";

const url = "https://jxnblk.com";

export default async function(interval: Interval) {
  const res = await fetch(url);

  if (res.status !== 200) {
    console.error(`${url} ${res.status}`);
    email({
      subject: `${url} is !UP`,
      text: body,
    });
    return;
  }
  console.log(`${res.status} ${url} ${new Date().toISOString()}`);
}

const body = `
https://jxnblk.com

https://val.town/x/jxnblk/dotcom

`;

// https://val.town/x/jxnblk/dotcom/logs