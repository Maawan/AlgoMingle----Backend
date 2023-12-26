const app = require("./app");
require("dotenv").config();
const { Server } = require("socket.io");
const io = new Server(8002 , {
    cors : true
})


const sockedIdToRoomIdMap = new Map();
io.on("connection" , (socket) => {
    console.log("Socket Connected " , socket.id);
   

    socket.on("interview_init" , (payload)=>{
        const {roomId , user} = payload;
        socket.join(roomId);
        sockedIdToRoomIdMap.set(socket.id , roomId);
        console.log(user , "Interview init");
        io.to(roomId).emit("message" , `${user.name} has joined the interview`)
    })
    socket.on("disconnect" , () => {
        console.log("User has disconnected ");
        const roomId = sockedIdToRoomIdMap.get(socket.id);
        io.to(roomId).emit("message" , "User has disconnected")
    })

})





app.listen(5000 , () => {
    console.log(`Server is Running at 3001`);
})