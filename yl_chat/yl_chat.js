var config = {
		"isDev": false,
		"server": {
			//"port": 8090,
			//"cert": './cert.pem',
			//"key":  './privkey.pem',
			
			'port': 8090,
			'cert': '/etc/letsencrypt/live/yocle.net/fullchain.pem',
			'key': '/etc/letsencrypt/live/yocle.net/privkey.pem',
		},
	};

 
// check the cert files: npm install fs
var fs = require('fs');
var cert_folder = process.argv.length >=3 ? process.argv[2] : '';
if (!fs.existsSync(config.server.cert)){
	config.server.cert = '../../../certs/' + cert_folder + '/fullchain.pem';
}
if (!fs.existsSync(config.server.key)){
	config.server.key = '../../../certs/' + cert_folder + '/privkey.pem';
}

console.log('***cert_folder: ' + cert_folder);
console.log(config.server.cert);
console.log(config.server.key);

	
var fs = require('fs'),
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
	
	io.sockets
	
		// connection
		.on('connection', function(client) {
			console.log('connection id=' + client.id);
			
			var user_id = 0;
			
			// calling from javascript socket.emit with user_id
			client.on("onconnected", function (data){
				user_id = data.user_id;
				
				// if new, create an array
				if (!local_clients[user_id]){
					local_clients[user_id] = [];
				}
				
				// add this client to the array
				local_clients[user_id].push(this);
				
				// debug
				var socket_id = this.id;
				console.log('onconnected',
					'user_id=' + user_id,
					'socket_id=' + socket_id,
//					'this_user=' + Object.keys(local_clients[user_id]).length,
					'users=' + Object.keys(local_clients).length
				);			
			});
			
			// disconnected: remove the object element
			client.on('disconnect', function(){
				var socket_id = this.id;
				//console.log('disconnect socket_id=' + socket_id);
				var arr = local_clients[user_id];
				if (arr){
					for (var i in arr){
						var cl = arr[i];
						if (cl.id == socket_id){
							delete local_clients[user_id][i];
							local_clients[user_id].splice(i, 1);
							if (!local_clients[user_id].length){
								delete local_clients[user_id];
							}
							console.log(
								'disconnect',
								'socket_id=' + socket_id,
								'user_id=' + user_id,
								'users=' + Object.keys(local_clients).length
							);
						}
					}
				}
				//console.log(local_clients);
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
			client.on('sender_typing', function (data){
				console.log('sender_typing', data);
				sendData('sender_typing', data, client);
			});
			
	})
};

//////////////////////////////////////////////////////////////////////////

function sendData(cmd, data, client){
	// send to the sender
	sendData1(cmd, data, client, data.sender_id);
	
	// send the data to the selected recipients
	for (var i in data.recipients){
		var user_id = data.recipients[i];
		sendData1(cmd, data, client, user_id);
	}
}

//////////////////////////////////////////////////////////////////////////

function sendData1(cmd, data, client, user_id){
	var clients = local_clients[user_id];
	if (clients){
		//console.log('sendData2', local_clients);
		for (var j in clients){
			var client2 = clients[j];
			if  (client2.id == client.id){
				//console.log('sendData3: skip sending to myself', client);
			} else {
				console.log('sendData1: send to user: ' + user_id);
				client2.emit(cmd, data);
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
