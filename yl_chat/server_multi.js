var config = {
		"isDev": false,
		"server": {
			"port": 8090,
			"key":  './privkey.pem',
			"cert": './cert.pem',
		},		
	},
	fs = require('fs'),
	socketIO = require('socket.io'),
	server = require('https')
		.Server({
			key: fs.readFileSync(config.server.key),
			cert: fs.readFileSync(config.server.cert),
		})
		.listen(
			config.server.port,
			function(){
				console.log('listen https: ' + config.server.port);
			}
		)
;

//////////////////////////////////////////////////////////////////////////////////////////////
var local_clients = {};

var sockets = function (server, config) {
	
	//console.log('socket');
	
	var io = socketIO.listen(server);
	
	//io.set('log level', 1);
	
	//////////////////////////////////////////////////////////////////////////////////////////
	
	io.sockets.on('connection', function(client) {
		console.log('connected', client.id);
		//console.log(clients);
		var user_id = 0;

		client.on("onconnected", function (data){
			user_id = data.user_id;
			console.log('onconnected', 'user_id=' + user_id, 'socket_id=' + this.id, 'count='+io.engine.clientsCount);
			
			//local_clients[data.user_id] = this;
			if (!local_clients[user_id]){
				local_clients[user_id] = [];
			}
			local_clients[user_id].push(this);
			//console.log(clients);
		});
		
		// when receiving the data from the server, push the same message to client.
		client.on("clientMsg", function (data){
			console.log("clientMsg", data);//, local_clients);
			data.time = getDateTimeString();
			sendData('serverMsg', data, client);
		});
		
		////////////////////////////////////////////////////
		// on sender typing
		////////////////////////////////////////////////////
		client.on("sender", function (data){
			console.log("sender", data);
			sendData('sender', data, client);
		});
		
		// disconnected
		client.on('disconnected', function() {
			console.log("disconnected", user_id);
			if (user_id && local_clients[user_id]){
				local_clients[user_id] = null;
				delete local_clients[user_id];
			}
    });
	})
};

//////////////////////////////////////////////////////////////////////////

function sendData(cmd, data, client){
	// send the data to the selected recipients
	for (var i in data.recipients){
		var user_id = data.recipients[i];
		//console.info(user_id);
		var clients = local_clients[user_id];
		if (clients){
			for (var j in clients){
				var client2 = clients[j];
				if  (client2 != client){
					console.log('send to user: ' + user_id);
					client2.emit(cmd, data);
				}
			}					
		}
	}
}
///////////////////////////////////////////////////////////////////////////////////////////////

function getDateTimeString(){
	var d = new Date();
	return d.getFullYear() + '-' + get2Digits(d.getMonth()+1) + '-' + get2Digits(d.getDate()) + ' ' +
		get2Digits(d.getHours()) + ':' + get2Digits(d.getMinutes())
		//+ ':' + get2Digits(d.getSeconds())
	;
}

////////////////////////////////////////////////////////////////////////////////////////////////

function get2Digits(n) {
    return (n < 10 ? '0' + n : n).toString();
}
//////////////////////////////////////////////////////////////////////////////////////////////

// all starts here
sockets(server, config);