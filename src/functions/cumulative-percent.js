export default function cumulativePercent (arrayOfPercents, addToIndex) {
  const numberArray = arrayOfPercents.map(function (percent) {
    const text = percent.replace("%", "");
    const number = parseFloat(text);
    return number;
  });
  const cumulativePercentNumber = numberArray.slice(0, addToIndex).reduce(function (a, c) {
    return a + c;
  }, 0);
  return `${cumulativePercentNumber}%`;
}