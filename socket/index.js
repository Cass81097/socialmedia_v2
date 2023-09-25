const { Server } = require("socket.io");

// Chỉ định số cổng mong muốn
const port = 3000;

const io = new Server({
    cors: "http://localhost:3001",
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
        console.log(receiver);
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

});

io.listen(port, () => {
    console.log(`Socket.IO server is running on port ${port}`);
});