const app = require("./app");
require("dotenv").config();
const { Server } = require("socket.io");
const io = new Server(8002, {
  cors: true,
});

const roomIdToSocketsMap = new Map();
const socketIdToRoomMap = new Map();
io.on("connection", (socket) => {
  console.log("Socket Connected ", socket.id);

  socket.on("interview_init", (payload) => {
    const { roomId } = payload;
    socket.join(roomId);
    if(roomIdToSocketsMap.has(roomId) && roomIdToSocketsMap.get(roomId).length === 2){
        io.to(socket.id).emit("401-restricted" , {message : "At max only two members can join in interview"});
        
    }else{
        if (!roomIdToSocketsMap.has(roomId)) {
            roomIdToSocketsMap.set(roomId, []);
        }
        roomIdToSocketsMap.get(roomId).push(socket.id);
        socketIdToRoomMap.set(socket.id, roomId);
        io.to(roomId).emit("user:joined", { message: "User has joined" });
        console.log("New User joined the Room", roomIdToSocketsMap);
        if(roomIdToSocketsMap.get(roomId).length === 2){
            io.to(socket.id).emit("start_the_connection_process" , {oponentSocketId : roomIdToSocketsMap.get(roomId)[0]});
        }
    }
    
  });

  socket.on("incomming_call" , ({to , offer}) => {
    console.log("Call Recieved from " , to);
    io.to(to).emit("incomming_call" , {from : socket.id , offer});
  })

  socket.on("call:accepted" , ({to , ans}) => {
    io.to(to).emit("call:accepted" , {from : socket.id , ans});
  })

  socket.on("peer:nego:needed", ({ to, offer }) => {
    console.log("peer:nego:needed", offer);
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("share-data" , (payload) => {
    const {roomId} = payload;
    io.to(roomId).emit("share_streams" , {});
  })

  socket.on("peer:nego:done", ({ to, ans }) => {
    console.log("peer:nego:done", ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });


  socket.on("disconnect", () => {
    if (socketIdToRoomMap.has(socket.id)) {
      const roomId = socketIdToRoomMap.get(socket.id);
      if (roomIdToSocketsMap.has(roomId)) {
        const temp = roomIdToSocketsMap.get(roomId);
        console.log("Disconnected user socket id" , socket.id);
        console.log("This is the array " , temp);
        const newArray = temp.filter((ele) => 
          ele != socket.id
        );
        console.log("This is the final Array" , newArray);
        roomIdToSocketsMap.set(roomId, newArray);
        socketIdToRoomMap.delete(socket.id);
      }
    }
    console.log("User disconnected ", roomIdToSocketsMap);
  });
});

app.listen(5000, () => {
  console.log(`Server is Running at 3001`);
});
