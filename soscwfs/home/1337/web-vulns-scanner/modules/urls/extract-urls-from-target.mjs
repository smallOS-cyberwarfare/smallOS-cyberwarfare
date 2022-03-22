import fetch from "node-fetch";
import { extractUrlsFromSource } from "./urls.mjs";
import { quit, echo } from "../utils/utils.mjs";

const extractUrlsFromTarget = async target => {
  echo(`Extracting urls from ${target}...`);
  const requestOptions = { headers: {} };
  requestOptions.headers["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36";
  echo(`Setting user agent (${requestOptions.headers["User-Agent"]}) to use in subsequent node-fetch requests`, "debug");
  echo(`Sending request...`, "verbose");
  let response = {};
  try {
    response = await fetch(target, requestOptions);
  } catch(err) {
    if (err.message == "Only absolute URLs are supported") {
      const foundHttp = /http/g.test(target);
      let extraInfo = "";
      if (!foundHttp) {
        extraInfo += "\nDid you forgot to prepend https:// to your target?"
      }
      echo(`Your target url ${target} is not an absolute/valid url.${extraInfo}`, "critical");
      echo(`The program will try to keep running. The target ${target} will be ignored`, "warning"); 
      return [ "" ];
      //quit("", 1);
    }
    response.text = () => "";
  }
  echo(`Response recived, parsing response from server...`, "debug");
  const body = await response.text();
  echo(`Request body extracted as ${body.substr(0,100)}...`, "debug");

  echo(`Extracting urls from source...`, "verbose");
  let urls = extractUrlsFromSource(body);

  const numberOfUrls = urls.length;
  echo(`${numberOfUrls} extracted from ${target} source, removing duplicates`);
  urls = [...new Set(urls)];
  echo(`${numberOfUrls - urls.length} duplicates removed`, "debug");
  return urls;
}

export default extractUrlsFromTarget;
