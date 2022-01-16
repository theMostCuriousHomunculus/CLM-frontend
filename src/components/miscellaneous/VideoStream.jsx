import React, { useCallback } from 'react';

export default function VideoStream({ srcObject, ...props }) {
  const refVideo = useCallback(
    (node) => {
      if (node) node.srcObject = srcObject;
    },
    [srcObject]
  );

  return <video ref={refVideo} {...props} />;
}
