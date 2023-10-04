import express from 'express';
import bodyParser from "body-parser";
import cors from 'cors';
import router from "./src/router/router";
import { AppDataSource } from "./src/data-source";

const { Server } = require("socket.io");
const app = express();
const port = 5000;
const portSocket = 3000;

app.use(cors());
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

AppDataSource.initialize().then(() => {
    console.log('Connect database success');
});

app.use('', router);

app.listen(port, () => {
    console.log('Server is running');
});

const io = new Server({
    cors: "http://192.168.5.22:3001",
});

let onlineUsers = [];

io.on("connection", (socket) => {
    // console.log("new connection", socket.id);

    socket.on("addNewUser", (userId) => {
        if (userId !== null) {
            const existingUser = onlineUsers.find(user => user.userId === userId);
            if (!existingUser) {
                onlineUsers.push({
                    userId,
                    socketId: socket.id
                });
            }
            io.emit("getOnlineUsers", onlineUsers);
        }
    });

    socket.on("disconnect", () => {
        onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id)
        io.emit("getOnlineUsers", onlineUsers)
    })

    socket.on("sendFriendRequest", (data) => {
        const { senderId, receiverId } = data;
        const receiver = onlineUsers.find(user => user.userId === receiverId);
        // console.log(receiver, "sendFriendRequest");
        if (receiver) {
            io.to(receiver.socketId).emit("friendRequest", { senderId, receiverId });
        }
    });

    socket.on("acceptFriendRequest", (data) => {
        const { senderId, receiverId } = data;
        const receiver = onlineUsers.find(user => user.userId === receiverId);
        // console.log(receiver, "acceptFriendRequest");
        if (receiver) {
            io.to(receiver.socketId).emit("friendRequestAccepted", { senderId, receiverId });
        }
    });

    socket.on("likeStatus", (data) => {
        const { senderId, receiverId, postId } = data;
        const receiver = onlineUsers.find(user => user?.userId === receiverId);
        if (receiver) {
            io.to(receiver.socketId).emit("status", { senderId, receiverId, postId });
        }
    });

    socket.on("commentStatus", (data) => {
        const { senderId, receiverId, postId, commentId } = data;
        console.log(data);
        const receiver = onlineUsers.find(user => user?.userId === receiverId);
        console.log(receiver);
        if (receiver) {
            io.to(receiver.socketId).emit("comment", { senderId, receiverId, postId, commentId });
        }
    });

    socket.on("sendGroupRequest", (data) => {
        const { senderId, receiverId, groupId } = data;
        const receiver = onlineUsers.find(user => user.userId === receiverId);
        console.log(receiver, "sendGroupRequest");
        if (receiver) {
            io.to(receiver.socketId).emit("groupRequest", { senderId, receiverId, groupId });
        }
    });

    socket.on("acceptGroupRequest", (data) => {
        const { senderId, receiverId, groupId } = data;
        const receiver = onlineUsers.find(user => user.userId === receiverId);
        console.log(receiver, "acceptGroupRequest");
        if (receiver) {
            io.to(receiver.socketId).emit("groupRequestAccepeted", { senderId, receiverId, groupId });
        }
    });

});

io.listen(portSocket, () => {
    console.log(`Socket.IO server is running on portSocket ${port}`);
});