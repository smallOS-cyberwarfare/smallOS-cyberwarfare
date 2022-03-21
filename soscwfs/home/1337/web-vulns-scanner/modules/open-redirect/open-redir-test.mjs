import fetch from "node-fetch";

const openRedirTest = async url => {
  const requestOptions = {};
  requestOptions.headers = {};
  requestOptions.headers["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36";

  const res = await fetch(url, requestOptions.headers);
  const body = await res.text();

  let vulnerable = false;
  if (/https\:\/\/www\.iana\.org\/domains\/example/gi.test(body)) {
    vulnerable = true;
  }

  return vulnerable;
}

export default openRedirTest;
