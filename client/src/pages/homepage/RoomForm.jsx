import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import urlify from '../../utils/urlify';
import Loading from "../../components/Loading";
import useRoom from "../../hooks/useRoom";

const RoomForm = () => {
    const { state, dispatch } = useRoom();
    const [roomName, setRoomName] = useState(state?.roomName || '');
    const [identity, setIdentity] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    return (
        <>
            {
                loading && (
                    <div className="absolute inset-0 z-40">
                        <Loading />
                    </div>
                )
            }
            <div
                className={`mt-6 px-2 max-w-xs lg:max-w-sm w-full mx-auto ${loading ? 'opacity-50' : 'opacity-100'
                    }`}
            >
                {error?.message && (
                    <div className="text-center py-2 text-sm font-semibold uppercase text-red-500 tracking-wide">
                        {error.message}
                    </div>
                )}
            </div>
            <div>

            </div>
        </>
    )
}

export default RoomForm