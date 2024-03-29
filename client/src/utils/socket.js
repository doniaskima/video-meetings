import io from "socket.io-client";
import {server_url} from "./server_url";


export const initiateSocket = ()=>{
    const socket = io(server_url);
    return socket;
};


export const disconnectSocket = (socket)=>{
    if(socket){
        const events = [
        'connect',
        'authenticated',
        'unauthorized',
        'JOIN_ROOM_ACCEPT',
        'JOIN_ROOM_DECLINE',
        'JOIN_ROOM_REQUEST',
        'RECIPIENT',
        'OWNER',
        'USER_JOINED',
        'USER_DISCONNECTED',
        'OFFER',
        'ANSWER',
        'NEW_ICE_CANDIDATE',
        ];
        events.forEach((event)=>socket.off(event));
        socket.disconnect();
    }
}