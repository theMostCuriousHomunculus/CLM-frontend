import useMediaQuery from '@material-ui/core/useMediaQuery';
import json2mq from 'json2mq';

export default function useColumn () {
  let numberOfColumns;
  if (useMediaQuery(
    json2mq({
      maxWidth: 469
    })
  )) {
    numberOfColumns = 1;
  }
  if (useMediaQuery(
    json2mq({
      maxWidth: 692,
      minWidth: 469.1
    })
  )) {
    numberOfColumns = 2;
  }
  if (useMediaQuery(
    json2mq({
      maxWidth: 915,
      minWidth: 692.1
    })
  )) {
    numberOfColumns = 3;
  }
  if (useMediaQuery(
    json2mq({
      maxWidth: 1138,
      minWidth: 915.1
    })
  )) {
    numberOfColumns = 4;
  }
  if (useMediaQuery(
    json2mq({
      maxWidth: 1361,
      minWidth: 1138.1
    })
  )) {
    numberOfColumns = 5;
  }
  if (useMediaQuery(
    json2mq({
      maxWidth: 1584,
      minWidth: 1361.1
    })
  )) {
    numberOfColumns = 6;
  }
  if (useMediaQuery(
    json2mq({
      maxWidth: 1807,
      minWidth: 1584.1
    })
  )) {
    numberOfColumns = 7;
  }
  if (numberOfColumns === undefined) {
    numberOfColumns = 8;
  }
  return numberOfColumns;
}