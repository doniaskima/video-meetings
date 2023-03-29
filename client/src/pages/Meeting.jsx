import React, {useEffect , useRef , useState } from 'react'
import { useParams  } from 'react-router-dom'
import Layout from '../components/Layout';
import RemoteVideo from "../pages/meeting/RemoteVideo";

const Meeting = () => {
  const {roomName} = useParams();
  const socketRef = useRef(null);
  const [isOwner , setIsOwner] = useState(false);
  const [ringingUser,setRingingUser] = useState(null);
  const [users, setUsers]=useState({});
  const [calling , setCalling] =useState(true);
  return (
    <Layout>
      <div>
        Just gonna start 
      </div>
    </Layout>
  )
}

export default Meeting