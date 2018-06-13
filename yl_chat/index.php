<!--
	https://www.codeproject.com/Articles/777640/Simple-chat-application-using-NodeJS-and-Socket-IO
-->
<html>
<head>
	<title>Chat application with Node and Sockets</title>
	<script src="socket.io.js"></script>
	<script src="jquery-3.1.1.js"></script>
	<script type="text/javascript">
		var name,
				socket = io.connect("http://localhost:1234")
		;
		$(function () {
				//as the user to enter their nick name or name.
				name = window.prompt("enter your name");
				//If the name is not given, ask the user to enter once again
				if (name == null) {
						$("body").html(" please refresh the page and try again ");
				}
				//When send button is clicked on, send the message to server
				$("#send").click(function () {
						//send to the server with person name and message
						socket.emit("clientMsg", {
							"name": name,
							"msg": $("#msg").val()
						});
				});

				//After sending message to the server, we'll have to wire up the event for it.
				//We can do the following. Upon receiving the message print it to the message box
				//that we've created in our html
				socket.on("serverMsg", function (data) {
						//Append the message from the server to the message box
						$("#msgBox").append("<strong>" + data.name + 
						"</strong>: " + data.msg + "<br/>");
				});

				$("#msg").on("keyup", function (event) {
						socket.emit("sender", {
							name: name
						});
				});
				socket.on("sender", function (data) {
						$("#status").html(data.name + " is typing");
						setTimeout(function () {
							$("#status").html('');
						}, 3000);
				});
		});
	</script>
</head>

<body>
    <!--Message box: To show the sent/received messages-->
    <div id="msgBox" style="height: 200px; width: 400px; border: 1px solid blue;">

    </div>
    <!--Textbox: to enter the message text-->
    <input type="text" id="msg" style="width:300px" />
    <!--Send: A button to send the message to others-->
    <input type="submit" id="send" value="send" />
</body>
</html>