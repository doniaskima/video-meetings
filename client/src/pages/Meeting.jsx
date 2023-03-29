import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { initiateSocket, disconnectSocket } from '../utils/socket';
import { openUserMedia, getPeerConfiguration } from '../utils/webrtc';
import useRoom from '../hooks/useRoom';
import RemoteVideo from '../pages/meeting/RemoteVideo';
import RingingOverlay from '../pages/meeting/RingingOverlay';
import Layout from '../components/Layout';

function Meeting() {
  const { roomName } = useParams();
  const history = useNavigate();
  const socketRef = useRef(null);
  const localMediaStreamRef = useRef(null);
  const localVideoRef = useRef(null);
  const peerConnectionsRef = useRef({});
  const [peerConnections, setPeerConnections] = useState([]);
  const [users, setUsers] = useState({});
  const [isOwner, setIsOwner] = useState(false);
  const [ringingUser, setRingingUser] = useState(null);
  const [calling, setCalling] = useState(true);
  const { state, dispatch } = useRoom();
  const peerConfigurationRef = useRef({});

  useEffect(() => {
    async function setPeerConfiguration() {
      peerConfigurationRef.current = await getPeerConfiguration();
    }

    const socket = initiateSocket();

    socket.on('connect', () => {
      socket
        .emit('authenticate', { token: state?.token })
        .on('authenticated', async () => {
          await setPeerConfiguration();

          try {
            const mediaStream = await openUserMedia();
            localMediaStreamRef.current = mediaStream;
            localVideoRef.current.srcObject = mediaStream;

            socket.emit('JOIN_ROOM_REQUEST');

            socket.on('JOIN_ROOM_REQUEST', (user) => {
              console.log('JOIN_ROOM_REQUEST triggered', user);
              setRingingUser(user);
            });

            socket.on('JOIN_ROOM_ACCEPT', () => {
              console.log('JOIN_ROOM_ACCEPT triggered');
              setCalling(false);
              socket.emit('JOIN_ROOM');
            });

            socket.on('JOIN_ROOM_DECLINE', () => {
              console.log('JOIN_ROOM_DECLINE triggered');
              leaveRoom();
            });

            socket.on('RECIPIENT', (recipients) => {
              console.log('RECIPIENT triggered', recipients);
              callUsers(recipients);
            });

            socket.on('OWNER', () => {
              console.log('OWNER event triggered');
              setIsOwner(true);
              setCalling(false);
            });

            socket.on('USER_JOINED', ({ socketId, identity }) => {
              console.log(`USER_JOINED event triggered for ${identity}`);
              setUsers((u) => ({ ...u, [socketId]: identity }));
            });

            socket.on('USER_DISCONNECTED', ({ socketId, identity }) => {
              console.log(`USER_DISCONNECTED event triggered for ${identity}`);
              handleCloseConnection(socketId);
              setUsers(({ [socketId]: id, ...newUsers }) => newUsers);
            });

            socket.on('HANG_UP', () => {
              leaveRoom();
            });

            socket.on('OFFER', handleOfferReceive);

            socket.on('ANSWER', handleAnswerReceive);

            socket.on('NEW_ICE_CANDIDATE', handleNewICECandidate);

            socket.on('error', (reason) => {
              console.error(reason);
            });

            socketRef.current = socket;
          } catch (error) {
            handleGetUserMediaError(error);
          }
        })
        .on('unauthorized', (msg) => {
          console.log(`unauthorized: ${JSON.stringify(msg.data)}`);
          dispatch({ type: 'update_room', roomName });
          history.replace({ pathname: '/' });
        });
    });

    return () => {
      handleCloseVideoCall();

      disconnectSocket(socketRef.current);

      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomName]);

  function callUsers(recipients) {
    const peers = [];
    const identities = {};

    const localTracks = localMediaStreamRef.current.getTracks();

    recipients.forEach((user) => {
      const peer = createPeerConnection(user.socketId);

      try {
        localTracks.forEach((track) =>
          peer.addTrack(track, localMediaStreamRef.current)
        );
      } catch (err) {
        handleGetUserMediaError(err);
      }

      peerConnectionsRef.current[user.socketId] = peer;
      peers.push({ socketId: user.socketId, peer });
      identities[user.socketId] = user.identity;
    });

    setPeerConnections(peers);
    setUsers(identities);
  }

  function createPeerConnection(socketId) {
    const peer = new RTCPeerConnection(peerConfigurationRef.current);

    peer.onicecandidate = (e) => handleICECandidateEvent(e, socketId);
    peer.onnegotiationneeded = (e) => handleNegotiationNeededEvent(e, socketId);
    peer.oniceconnectionstatechange = (e) =>
      handleICEConnectionStateChangeEvent(e, socketId);

    return peer;
  }

  async function handleNegotiationNeededEvent(e, socketId) {
    if (!peerConnectionsRef.current[socketId]) return;

    try {
      const offer = await peerConnectionsRef.current[socketId].createOffer();

      if (peerConnectionsRef.current[socketId].signalingState !== 'stable') {
        return;
      }

      await peerConnectionsRef.current[socketId].setLocalDescription(offer);

      socketRef.current.emit('OFFER', {
        target: socketId,
        caller: socketRef.current.id,
        sdp: peerConnectionsRef.current[socketId].localDescription,
      });
    } catch (error) {
      console.error(error);
    }
  }

  function handleICECandidateEvent(e, socketId) {
    if (e.candidate) {
      socketRef.current.emit('NEW_ICE_CANDIDATE', {
        target: socketId,
        caller: socketRef.current.id,
        candidate: e.candidate,
      });
    }
  }

  function handleICEConnectionStateChangeEvent(e, socketId) {
    const currentState =
      peerConnectionsRef.current[socketId].iceConnectionState;
    if (
      currentState === 'closed' ||
      currentState === 'failed' ||
      currentState === 'disconnected'
    ) {
      handleCloseConnection(socketId);
    }
  }

  async function handleNewICECandidate(payload) {
    const candidate = new RTCIceCandidate(payload.candidate);
    await peerConnectionsRef.current[payload.caller]
      .addIceCandidate(candidate)
      .catch(console.error);
  }

  async function handleAnswerReceive(payload) {
    const desc = new RTCSessionDescription(payload.sdp);
    await peerConnectionsRef.current[payload.caller]
      .setRemoteDescription(desc)
      .catch(console.error);
  }

  async function handleOfferReceive(payload) {
    if (!peerConnectionsRef.current[payload.caller]) {
      const peer = createPeerConnection(payload.caller);
      peerConnectionsRef.current[payload.caller] = peer;
      setPeerConnections((prevState) => [
        ...prevState,
        { socketId: payload.caller, peer },
      ]);
    }

    const desc = new RTCSessionDescription(payload.sdp);

    await peerConnectionsRef.current[payload.caller].setRemoteDescription(desc);

    try {
      localMediaStreamRef.current
        .getTracks()
        .forEach((track) =>
          peerConnectionsRef.current[payload.caller].addTrack(
            track,
            localMediaStreamRef.current
          )
        );
    } catch (err) {
      handleGetUserMediaError(err);
    }

    const answer = await peerConnectionsRef.current[
      payload.caller
    ].createAnswer();
    await peerConnectionsRef.current[payload.caller].setLocalDescription(
      answer
    );

    socketRef.current.emit('ANSWER', {
      target: payload.caller,
      caller: socketRef.current.id,
      sdp: answer,
    });
  }

  function handleCloseVideoCall() {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      localVideoRef.current.pause();
      localVideoRef.current.srcObject.getTracks().forEach((track) => {
        track.stop();
      });
    }

    localMediaStreamRef.current = null;
  }

  function handleCloseConnection(socketId) {
    if (!peerConnectionsRef.current[socketId]) return;

    peerConnectionsRef.current[socketId].ontrack = null;
    peerConnectionsRef.current[socketId].onicecandidate = null;
    peerConnectionsRef.current[socketId].onnegotiationneeded = null;
    peerConnectionsRef.current[socketId].onremovetrack = null;
    peerConnectionsRef.current[socketId].oniceconnectionstatechange = null;

    peerConnectionsRef.current[socketId].close();
    peerConnectionsRef.current[socketId] = null;

    /*
      When component unmounts, ICEConnectionStateChangeEvent will detect "disconnected" state,
      which will invoke this function - handleCloseConnection. In that case do not update the state.
      But when remote peer will close the connection, Video component will also call this function, and in that case we want to update the state to remove the video object
      from the DOM. That's why we first check if socketRef.current exists, if components unmounts, it will set it to null so it won't update the state which will prevent error.
    */
    if (socketRef.current) {
      setPeerConnections((prevState) => [
        ...prevState.filter((peer) => peer.socketId !== socketId),
      ]);
    }
  }

  function handleGetUserMediaError(e) {
    if (e.name === 'NotFoundError') {
      console.error(
        'Unable to open your call because no camera and/or microphone were found'
      );
    } else if (
      e.name === 'SecurityError' ||
      e.name === 'PermissionDeniedError'
    ) {
      console.log('User cancelled the call');
    } else {
      console.error(
        'Error opening your camera and/or microphone: ' + e.message
      );
    }
  }

  function leaveRoom() {
    dispatch({ type: 'update_room', roomName: null });
    history.replace({ pathname: '/' });
  }

  function handleHangUp() {
    if (!socketRef.current || !isOwner) return;

    socketRef.current.emit('HANG_UP');

    leaveRoom();
  }

  function handleJoinRoomAcceptClick() {
    if (!ringingUser) return;
    socketRef.current.emit('JOIN_ROOM_ACCEPT', {
      socketId: ringingUser.socketId,
    });
    setRingingUser(null);
  }

  function handleJoinRoomDeclineClick() {
    if (!ringingUser) return;
    socketRef.current.emit('JOIN_ROOM_DECLINE', {
      socketId: ringingUser.socketId,
    });
    setRingingUser(null);
  }

  return (
    <Layout>
      {!isOwner && calling ? (
        <div>Waiting...</div>
      ) : ringingUser ? (
        <RingingOverlay
          ringingUser={ringingUser}
          handleAccept={handleJoinRoomAcceptClick}
          handleDecline={handleJoinRoomDeclineClick}
        />
      ) : (
        ''
      )}
      <div className="flex-1 w-full h-full">
        <h2 className="text-2xl text-center">
          Room name:{' '}
          <span className="text-blue-600 font-semibold">{roomName}</span>
        </h2>

        <div className="mt-2 flex flex-wrap py-8">
          <div className="w-full sm:w-1/2 mx-auto p-2">
            <video
              className="w-full max-w-full"
              ref={localVideoRef}
              muted
              autoPlay
              playsInline
            />
          </div>
          {peerConnections.map(({ socketId, peer }) => (
            <div key={socketId} className="w-full sm:w-1/2 mx-auto p-2">
              <RemoteVideo
                peer={peer}
                identity={users[socketId]}
                closeConnection={() => handleCloseConnection(socketId)}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-center space-x-4 mt-2">
          <button
            className="py-2 px-4 bg-red-500 hover:bg-red-400 active:bg-red-600 text-white font-semibold tracking-wide uppercase text-sm rounded focus:outline-none focus:shadow-outline"
            onClick={leaveRoom}
          >
            Leave Room
          </button>
          {isOwner && (
            <button
              className="py-2 px-4 bg-red-500 hover:bg-red-400 active:bg-red-600 text-white font-semibold tracking-wide uppercase text-sm rounded focus:outline-none focus:shadow-outline"
              onClick={handleHangUp}
            >
              Hang Up
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Meeting;