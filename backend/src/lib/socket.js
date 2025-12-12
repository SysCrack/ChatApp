import {Server} from "socket.io";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors : {
        origin : ["http://localhost:5173"],
        credentials : true
    }
});

export function getReceiverSocketId(useId) {
    return userSocketMap[useId]
}
// this will be used to store online users
const userSocketMap = {}; // {userId : SocketId}


io.on("connection",(socket)=>{
    console.log("a user is connected", socket.id);
    const userId  = socket.handshake.auth.userId;
    

    if (userId) {
        if(!userSocketMap[userId]) {
            userSocketMap[userId] = [];
        }
        userSocketMap[userId].push(socket.id)
    }
    socket.emit("getOnlineUsers", Object.keys(userSocketMap));
    io.emit("getOnlineUsers",Object.keys(userSocketMap));
    socket.on("disconnect",()=>{
    console.log("a user is disconnected", socket.id)
    const sockets = userSocketMap[userId] || [];

    userSocketMap[userId] = sockets.filter(id => id !== socket.id);

    if (userSocketMap[userId].length === 0) {
        delete userSocketMap[userId]; // no active socket, remove user
    }
    io.emit("getOnlineUsers",Object.keys(userSocketMap));
})
})

export {io, app, server};
