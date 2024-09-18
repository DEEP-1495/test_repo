const express = require("express");
const http = require("http");
const app = express();
const path = require("path");//ye import krna jaruri hai

// socketio boiler code
const socketio = require("socket.io"); //socket.io hona chahiye

const server = http.createServer(app);

const io = socketio(server);

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public"))); //use to handle the css file n all

io.on("connection",function(socket){
    socket.on("send-location",function(data){
        io.emit("receive-location",{id:socket.id, ...data}) //backend se jitne bhi connected hai sbko chle gye.
    })
    socket.on("disconnect",function(){
        io.emit("user-disconnected",socket.id)
    })
    
})

app.get("/",function(req,res){
    res.render("index");
})

server.listen(3000);