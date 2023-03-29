import { TWILIO_TOKEN_URL, iceServers } from './config';


const iceConfiguration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
    ]
}

const peerConnection = new RTCPeerConnection(iceConfiguration);
  

const mediaConstraints = {
  audio: true,
  video: true,
};

export function openUserMedia() {
  return window.navigator.mediaDevices.getUserMedia(mediaConstraints);
}

async function generateNtsToken() {
  const res = await fetch(TWILIO_TOKEN_URL);
  const token = await res.json();
  return token;
}

export async function getPeerConfiguration() {
  const isProd = process.env.NODE_ENV === 'production';

 
  const peerConfiguration = new RTCPeerConnection(iceConfiguration);
  

  if (isProd) {
    const token = await generateNtsToken().catch((err) => {
      console.error(err);
    });

    if (token?.iceServers) {
      peerConfiguration.iceServers = token.iceServers;
    }
  }

  return peerConfiguration;
}