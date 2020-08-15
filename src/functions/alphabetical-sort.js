export default function alphabeticalSort (objectsWithNameProperty) {

  objectsWithNameProperty.sort(function (a, b) {
    return a['name'].localeCompare(b['name']);
  });

  return objectsWithNameProperty;
}