import React, { useCallback } from 'react';

export default function AudioStream({ srcObject, ...props }) {
  const refAudio = useCallback(
    (node) => {
      if (node) node.srcObject = srcObject;
    },
    [srcObject]
  );

  return <audio ref={refAudio} {...props} />;
}
