export default function customSort(objectsToSort, propertiesToSortBy) {
  objectsToSort.sort(function (a, b) {
    for (let property of propertiesToSortBy) {
      if (a[property] > b[property]) return 1;
      if (b[property] > a[property]) return -1;
    }

    return 0;
  });

  return objectsToSort;
}
