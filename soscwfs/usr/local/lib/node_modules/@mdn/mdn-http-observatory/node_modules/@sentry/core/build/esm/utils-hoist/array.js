/** Flattens a multi-dimensional array
 *
 * @deprecated This function is deprecated and will be removed in the next major version.
 */
function flatten(input) {
  const result = [];

  const flattenHelper = (input) => {
    input.forEach((el) => {
      if (Array.isArray(el)) {
        flattenHelper(el );
      } else {
        result.push(el );
      }
    });
  };

  flattenHelper(input);
  return result;
}

export { flatten };
//# sourceMappingURL=array.js.map
