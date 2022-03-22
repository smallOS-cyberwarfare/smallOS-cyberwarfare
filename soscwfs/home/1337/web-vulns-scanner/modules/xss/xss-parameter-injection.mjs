const xssParameterInjection = (url, injectionPoint, payload) => {
  String.prototype.replaceAll = function(search, replacement) {
    const target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
  };

  return url.replaceAll(new RegExp(injectionPoint, "g"), payload);
}

export default xssParameterInjection;
