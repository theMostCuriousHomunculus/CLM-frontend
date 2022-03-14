function getValue(obj, path) {
  if (!path) return obj;
  const properties = path.split('.');
  return getValue(obj[properties.shift()], properties.join('.'));
}

export default function customSort(objectsToSort, propertiesToSortBy) {
  objectsToSort.sort(function (a, b) {
    for (let property of propertiesToSortBy) {
      if (getValue(a, property) > getValue(b, property)) return 1;
      if (getValue(b, property) > getValue(a, property)) return -1;
    }

    return 0;
  });

  return objectsToSort;
}
