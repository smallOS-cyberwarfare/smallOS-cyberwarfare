const extractUrlsFromSource = source => {
  let urls = [];
  source.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, url => urls.push(url));
  return urls;
}

export default extractUrlsFromSource;
