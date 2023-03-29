import React, { createContext, useContext, useReducer } from "react";

const initialState = {
    identity: null,
    roomName: null,
    token: null,
};

const reducer = (state, action) => {
    if (action.type === 'join_room') {
        return {
            ...state,
            identity: action.identity,
            roomName: action.roomName,
            token: action.token,
        };
    } else if (action.type === 'update_room') {
        return {
            ...state,
            roomName: action.roomName,
        };
    } else {
        return initialState;
    }
};

const RoomContext = createContext();

export const RoomProvider = ({ children }) => (
    <RoomContext.Provider value={useReducer(reducer, initialState)}>
        {children}
    </RoomContext.Provider>
);

const useRoom = () => {
    const [state, dispatch] = useContext(RoomContext);

    return { state, dispatch };
};

export default useRoom;