import { echo } from "../utils/utils.mjs";

const filterUrls = (urls, pattern) => {
  echo(`Filtering urls not including /${pattern}/g pattern`);
  echo(`Total urls (${urls.length})`, "verbose");
  let aux = [];
  const regularExpr = new RegExp(pattern, "g");
  for (let i in urls) {
    if (regularExpr.test(urls[i])) {
      echo(`${urls[i]} passed the test ${regularExpr}`, "debug");
      aux.push(urls[i]);
    }
  }
  echo(`${aux.length} urls matching the pattern`, "verbose");
  return aux;
}

export default filterUrls;
