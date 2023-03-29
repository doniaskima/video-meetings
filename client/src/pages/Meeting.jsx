import React, {useEffect , useRef , useState } from 'react'
import { useParams , useNavigate } from 'react-router-dom'
import Layout from '../components/Layout';

const Meeting = () => {
  const {roomName} = useParams();
  const socketRef = useRef(null);

  return (
    <Layout>
      <div>
        Just gonna start 
      </div>
    </Layout>
  )
}

export default Meeting