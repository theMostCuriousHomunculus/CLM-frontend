export default function randomSampleWOReplacement(array, sampleSize) {
  const copyArray = [...array];
  const sampleArray = [];
  let randomNumber;

  for (let index = 0; index < sampleSize; index++) {
    randomNumber = Math.floor(Math.random() * copyArray.length);
    sampleArray.push(copyArray[randomNumber]);
    copyArray.splice(randomNumber, 1);
  }

  return sampleArray;
}
