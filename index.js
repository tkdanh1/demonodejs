var express = require("express");
var app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
var server = require("http").Server(app);
var io = require('socket.io')(server);
server.listen(3030);

io.on("connection", function(socket){
  console.log("Connected: ", socket.id);
});

app.get("/trangchu", function(req, res){
    res.render("trangchu");
});
