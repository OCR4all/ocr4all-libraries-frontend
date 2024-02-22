export function useFindNestedObject(
  entireObj: object,
  keyToFind: any,
  valToFind: any,
): any {
  let foundObj;
  JSON.stringify(entireObj, (_, nestedValue) => {
    if (
      nestedValue &&
      JSON.stringify(nestedValue[keyToFind as string]) ===
        JSON.stringify(valToFind)
    ) {
      foundObj = nestedValue;
    }
    return nestedValue;
  });
  return foundObj;
}
