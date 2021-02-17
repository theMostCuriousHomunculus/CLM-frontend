export default function alphabeticalSort (objectsToSort, propertyToAlphabetizeBy) {

  objectsToSort.sort(function (a, b) {
    return a[propertyToAlphabetizeBy].localeCompare(b[propertyToAlphabetizeBy]);
  });

  return objectsToSort;
}