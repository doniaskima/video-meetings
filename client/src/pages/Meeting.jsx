import React, {useEffect , useRef , useState } from 'react'
import { useParams  } from 'react-router-dom'
import Layout from '../components/Layout';
import RemoteVideo from "../pages/meeting/RemoteVideo";
import useRoom from "../hooks/useRoom"

const Meeting = () => {
  const { roomName } = useParams();
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
  const peerConfigurationRef=useRef({});

  useEffect(()=>{
    async function setPeerConfiguration(){
      setPeerConfiguration.current = await getPeerConfiguration();
    }
  })
  return (
    <Layout>
      <div>
        Just gonna start 
      </div>
    </Layout>
  )
}

export default Meeting