import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import useRequest from './request-hook';
import { ErrorContext } from '../contexts/Error';

const defaultOptions = { enableHighAccuracy: true };

export default function useWatchPosition(options = defaultOptions) {
  const { sendRequest } = useRequest();
  const { setErrorMessages } = useContext(ErrorContext);
  const locationWatchID = useRef(null);
  const [finding, setFinding] = useState();
  const [geolocationEnabled, setGeolocationEnabled] = useState(false);
  const [location, setLocation] = useState({
    latitude: undefined,
    longitude: undefined
  });

  const cancelLocationWatch = () => {
    if (locationWatchID.current && navigator.geolocation) {
      navigator.geolocation.clearWatch(locationWatchID.current);
    }
  };

  const failureCallback = (error) => {
    setFinding(false);
    setErrorMessages((prevState) => {
      return [
        ...prevState,
        `Unable to retrieve your location: ${error.message}`
      ];
    });
  };

  const successCallback = (position) => {
    setFinding(false);
    const { latitude, longitude } = position.coords;
    setLocation({
      latitude,
      longitude
    });
    sendRequest({
      operation: 'postLocation',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(
                latitude: ${latitude},
                longitude: ${longitude}
              ) {
                _id
              }
            }
          `
        };
      }
    });
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setErrorMessages((prevState) => {
        return [
          ...prevState,
          'Geolocation is not supported by your cave man browser.'
        ];
      });
    } else if (geolocationEnabled) {
      setFinding(true);
      locationWatchID.current = navigator.geolocation.watchPosition(
        successCallback,
        failureCallback,
        options
      );
    }

    return cancelLocationWatch;
  }, [geolocationEnabled, options]);

  return {
    cancelLocationWatch,
    finding,
    geolocationEnabled,
    location,
    setGeolocationEnabled
  };
}
