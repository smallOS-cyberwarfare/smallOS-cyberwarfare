import url from "url";

const extractParametersFromUrl = Url => {
  let arrayQueries = [];
  const parsed = url.parse(Url, true)
  const listOfParams = parsed.query;
  const keys = Object.keys(listOfParams);
  for (let i in keys) {
    arrayQueries.push(keys[i]);
  }

  /* https://stackoverflow.com/a/20420424 */
  const replaceParamValue = (url, paramName, paramValue) => {
    if (paramValue == null) {
      paramValue = "";
    }
   
    const pattern = new RegExp("\\b(" +paramName+"=).*?(&|#|$)");
    if (url.search(pattern) >= 0) {
      return url.replace(pattern, "$1" + paramValue + "$2");
    }
    url = url.replace(/[?#]$/, "");
    return url + (url.indexOf("?") > 0 ? "&" : "?") + paramName + "=" + paramValue;
  }
  /* */

  let targetUrl = parsed.href;
  for (let i in arrayQueries) {
    targetUrl = replaceParamValue(targetUrl, arrayQueries[i], "{{ PAYLOAD }}");
    // targetUrl = addCounterToPayload(targetUrl);
  }


  return keys.length ? [arrayQueries, parsed.href, targetUrl] : null;
}

export default extractParametersFromUrl;
