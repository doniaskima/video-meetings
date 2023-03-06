import React, { useEffect, useRef } from 'react';

function RemoteVideo({ peer, closeConnection, identity }) {
  const videoRef = useRef(null);

  useEffect(() => {
    peer.ontrack = handleTrackEvent;
    peer.onremovetrack = handleRemoveTrackEvent;

    function handleTrackEvent(e) {
      videoRef.current.srcObject = e.streams[0];
    }

    function handleRemoveTrackEvent(e) {
      const mediaTracks =
        videoRef.current &&
        videoRef.current.srcObject &&
        videoRef.current.srcObject.getTracks();
      if (mediaTracks && mediaTracks.length === 0) {
        closeConnection();
      }
    }
  }, [peer, closeConnection]);

  return (
    <div className="relative">
      <div className="absolute bottom-0 left-0 px-2 py-1 bg-black bg-opacity-95 text-white tracking-wide">
        {identity}
      </div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full max-w-full"
      />
    </div>
  );
}

export default RemoteVideo;
