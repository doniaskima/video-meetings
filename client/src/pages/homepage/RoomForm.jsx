import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import urlify from '../../utils/urlify';
import Loading from "../../components/Loading";
import useRoom from "../../hooks/useRoom";

const RoomForm = () => {
    const { state, dispatch } = useRoom();
    const [createRoom, setCreateRoom] = useState(!state?.roomName);
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

                <div className="h-6 mb-2">
                    {createRoom && roomName && (
                        <div className="h-full">
                            <span className="font-semibold text-sm uppercase text-gray-500">
                                Room name
                            </span>
                            : <span className="text-blue-500">{urlify(roomName)}</span>
                        </div>
                    )}
                </div>
                <form action="" className="w-full">
                    <label className="text-sm uppercase font-semibold tracking-wide text-gray-700"
                        htmlFor="identity">
                        Display name:
                    </label>
                    <input
                        disabled={loading}
                        value={identity}
                        className={`w-full rounded py-2 px-4 bg-gray-100 border focus:outline-none focus:shadow-outline ${error && error.identity ? 'border-red-500' : 'border-gray-300'
                            }`}
                        type="text"
                        id="identity"
                        name="identity"
                        placeholder="Enter your display name"
                    />
                    {error && error.identity && (
                        <div className="w-full text-sm text-red-500">{error.identity}</div>
                    )}
                    <label
                        className="block mt-2 text-sm uppercase font-semibold tracking-wide text-gray-700"
                        htmlFor="roomName"
                    >
                        Room name
                    </label>
                    <input
                        disabled={loading}
                        value={roomName}
                        className={`w-full rounded bg-gray-100 border py-2 px-4 focus:outline-none focus:shadow online ${error && error.roomName ? 'border-red-500' : 'border-gray-300'}`}
                        id="roomName"
                        placeholder="Enter thr room name"
                        type="text" />
                    {error && error.roomName && (
                        <div className="w-full text-sm text-red-500">{error.roomName}</div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="block mx-auto py-2 sm:py-2 px-4 sm:px-6 mt-4 bg-pink-400 hover:bg-blue-300 active:bg-blue-600 focus:outline-none focus:shadow-outline text-white font-bold tracking-wider text-sm uppercase rounded-lg shadow-md"
                    >
                        {createRoom ? 'create a room' : 'Join a room'}
                    </button>
                </form>
            </div>
            <div>

            </div>
        </>
    )
}

export default RoomForm