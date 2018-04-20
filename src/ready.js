var socket = io("http://localhost:3030");
$(document).ready(function(){
  $("#btnRegister").click(function(){
    //send to server
    socket.emit("client_send_username", $("#txtUser").val());
  });
});
