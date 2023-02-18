import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import urlify from '../../utils/urlify';
import Loading from "../../components/Loading";
import useRoom from "../../hooks/useRoom";

const RoomForm = () => {
    const { state, dispatch } = useRoom();
    const [loading, setLoading] = useState(false);
    return (
        <>
            {
                loading && (
                    <div className="absolute inset-0 z-40">
                        <Loading />
                    </div>
                )
            }
            <div>
                
            </div>
        </>
    )
}

export default RoomForm