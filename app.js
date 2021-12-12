const express=require("express");
const app=express();
const socket=require("socket.io");

const port=process.env.PORT || 3000;
app.use(express.static("public"));
const server=app.listen(port,()=>{
    console.log("port is listening at "+ port);
});

const io=socket(server);

io.on("connection",(socket)=>{
    console.log("connection successful");

    socket.on("beginPath",(data)=>{
        io.sockets.emit("beginPath",data);
    });
    socket.on("drawPath",(data)=>{
        io.sockets.emit("drawPath",data);
    });

    socket.on("redraw",data=>{
        io.sockets.emit("redraw",data);
    })
})



