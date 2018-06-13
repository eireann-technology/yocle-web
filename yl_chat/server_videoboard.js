var
	myiceport = 3478,
	myiceport2 = 3478;

// CONFIG
var config = {
    "isDev": false,
    //"logLevel": 0,
    "server": {
      "port": 7501,
      "key":  '/etc/letsencrypt/live/videoboard.hk/privkey.pem',
      "cert": '/etc/letsencrypt/live/videoboard.hk/cert.pem',
    },		
    "rooms": {
      "maxClients": 0 /* maximum number of clients per room. 0 = no limit */
    },
    "stunservers" : [
				{url: 'stun:videoboard.hk:'+myiceport},
				{url: "stun:dev.adiai.com:3478"},
				//{url: 'stun:cplau.no-ip.org:'+myiceport2},
				//{url: "stun:stun.l.google.com:19302"},
				//{url: 'stun:stun.services.mozilla.com'},
				//{url: "stun:mmt-stun.verkstad.net"},
    ],
    "turnservers" : [
				{url: 'turn:videoboard.hk:'+myiceport, "username": "alan",		"credential": "1234"},
				{url: "turn:dev.adiai.com:3478", "username": 'alan', "credential": "1234"},
				//{url: 'turn:cplau.no-ip.org:'+myiceport2, "username": 'alan', "credential": "1234"},
				//{url: "turn:cplau.no-ip.org:3478", 		"username": 'alan',		"secret": "1234"},
				//{url: "turn:mmt-turn.verkstad.net",		"username": "webrtc",		"secret": "secret"},
    ]
}

///////////////////////////////////////////////////////////////////////
// HTTPS SERVER
///////////////////////////////////////////////////////////////////////

var fs = require('fs');
var server = require('https').Server(
	{
		key: fs.readFileSync(config.server.key),
		cert: fs.readFileSync(config.server.cert),
	}
).listen(
	config.server.port,
	function(){
		console.log('listen: ' + config.server.port);
	}
);

var socketIO = require('socket.io'),
    uuid = require('node-uuid'),
    crypto = require('crypto');

var rooms = {};
		
//var sockets = require('./sockets');

var sockets = function (server, config) {
	console.log('socket');
	var io = socketIO.listen(server);
	//var io = socketIO.listen(server, {
		//origins: '*:*',
		//origins: 'https://alanpoon.no-ip.org:onMyDrag,https://127.0.0.1:onMyDrag,https://192.168.1.10'
		//transports: ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling'],
	//});
	config.logLevel = 0;
	// https://github.com/Automattic/socket.io/wiki/Configuring-Socket.IO
	//if (config.logLevel)
	{
		io.set('log level', config.logLevel);
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////
	
	io.sockets.on('connection', function(client) {
		console.log('connected');
		
		//client.emit('connected', {msg: 'welcome'});
/*		
		///////////////////////////////
		// upload photo
		///////////////////////////////
		// check client
		client.on('checkclient', function(data){
			var room = data.room;
			var clients = io.sockets.clients(room);
			console.log('checkclient', clients.length);
			client.emit('checkclient', {nClient:clients.length});
		});
		
		// upload photo
		client.on('uploader1', function(data){
			var file = data.file;
			var room = data.room;
			console.log('***recv uploader1', file, room, data.w, data.h);
			var clients = io.sockets.clients(room);
			clients.forEach(function (client2){
				console.log('send uploader2 to' + client2.id);
				client2.emit('uploader2', data);
			});
		});
*/
		//////////////////////////////////////////////////////////////////////////////////////////
		
		client.resources = {
			screen: false,
			video: true,
			audio: false,
		};

		//////////////////////////////////////////////////////////////////////////////////////////

		client.on('join_req', function(room, cb){
			// sanity check
			if (typeof room === 'string'){
				var nClient = clientsInRoom(room);
				if (config.rooms && config.rooms.maxClients > 0 && nClient >= config.rooms.maxClients) {
					// maximum number of clients reached
					safeCb(cb)('full');
				} else {
					// leave any existing rooms
					removeFeed();
					safeCb(cb)(null, describeRoom(room));
					client.join(room);
					client.room = room;
					if (!rooms[room]){
						rooms[room] = {
							roomrecord: 0,
							recorderId: 0,
						};
					}
					var myroom = rooms[room];
					nClient = clientsInRoom(room);
					myroom.nClient = nClient;
					console.log(
						'join: room=' + room + " client=" + client.id + ' total=' + nClient + ' record=' + myroom.roomrecord
					);
					// give response
					var resp = {
						myId: client.id,
						nClient: nClient,
						roomrecord: myroom.roomrecord,
						recorderId: myroom.recorderId,
					};
					client.emit('join_resp', resp);
				}
			}
		});

		//////////////////////////////////////////////////////////////////////////////////////////

		// pass a message to another id
		client.on('message', function (details) {
			//console.log('message: ', details);	// a lot of log
			if (!details){
				console.log('no details');
			} else {
				//console.log('details.to', details.to);
				var otherSockets = io.sockets.sockets[details.to];
				if (!otherSockets){
					console.warn('no other client');
				} else {
					//console.log('send from', client.id, 'to', details.to, details.payload.type ? details.payload.type : details.payload.candidate ? 'candidate':'?');
					//console.log('send from', client.id, 'to', details.to);
					details.from = client.id;
					// send details to other clients
					otherSockets.emit('message', details);
				}
			}
		});

		//////////////////////////////////////////////////////////////////////////////////////////

		client.on('shareScreen', function (){
			console.log('shareScreen');
			client.resources.screen = true;
		});

		//////////////////////////////////////////////////////////////////////////////////////////

		client.on('unshareScreen', function (type) {
			console.log('unshareScreen');
			client.resources.screen = false;
			removeFeed('screen');
		});

		//////////////////////////////////////////////////////////////////////////////////////////
		
		client.on('startRoomRecord', function (){
			var room = rooms[client.room];
			if (room){
				console.log('startRoomRecord', 'room='+client.room);
				room.roomrecord = 1;
				room.recorderId = client.id;
			} else {
				console.error('startRoomRecord', 'room='+client.room, 'not found');
			}
		});

		//////////////////////////////////////////////////////////////////////////////////////////

		client.on('stopRoomRecord', function (){
			console.log('stopRoomRecord', 'room='+client.room);
			var room = rooms[client.room];
			room.roomrecord = 0;
			room.recorderId = 0;
		});

		//////////////////////////////////////////////////////////////////////////////////////////
		
		client.on('leave', function(room){
			removeFeed();
			var nClient = clientsInRoom(room);
			rooms[room].nClient = nClient;
			console.log('leave: ' + room + " client=" + nClient);	// never reached
		});

		//////////////////////////////////////////////////////////////////////////////////////////

		function removeFeed(type) {
			//console.log('removeFeed', !type?0:type);
			if (client.room){
				io.sockets.in(client.room).emit('removefeed', {
					id: client.id,
					type: type
				});
				if (!type){
					client.leave(client.room);
					client.room = undefined;
				}
			}
		}
		

		//////////////////////////////////////////////////////////////////////////////////////////
		// we don't want to pass "leave" directly because the
		// event type string of "socket end" gets passed too.
		client.on('disconnect', function () {
			//console.log('disconnect');
			removeFeed();
			showAllClients('disconnect');
		});


		//////////////////////////////////////////////////////////////////////////////////////////
		
		client.on('create', function (room, cb) {
			//console.log('create');
			if (arguments.length == 2) {
				cb = (typeof cb == 'function') ? cb : function () {};
				room = room || uuid();
			} else {
				cb = room;
				room = uuid();
			}
			// check if exists
			if (io.sockets.clients(room).length) {
				safeCb(cb)('taken');
			} else {
				client.join(room);
				safeCb(cb)(null, room);
			}
		});

		//////////////////////////////////////////////////////////////////////////////////////////
		// support for logging full webrtc traces to stdout
		// useful for large-scale error monitoring
		client.on('trace', function (data) {
			console.log('trace', JSON.stringify(
				[data.type, data.session, data.prefix, data.peer, data.time, data.value]
			));
		});

		// tell client about stun and turn servers and generate nonces
		client.emit('stunservers', config.stunservers || []);

		//////////////////////////////////////////////////////////////////////////////////////////

		// create shared secret nonces for TURN authentication
		// the process is described in draft-uberti-behave-turn-rest
		var credentials = [];
		config.turnservers.forEach(function (server) {
			if (server.secret){
				var hmac = crypto.createHmac('sha1', server.secret);
				// default to 86400 seconds timeout unless specified
				var username = Math.floor(new Date().getTime() / 1000) + (server.expiry || 86400) + "";
				hmac.update(username);
				credentials.push({
					username: username,
					credential: hmac.digest('base64'),	// credential is created here
					url: server.url
				});
			} else if (server.credential){
				credentials.push({
					username: server.username,
					credential: server.credential,
					url: server.url
				});
			} else {
				console.error('error');
			}
		});
		client.emit('turnservers', credentials);

		///////////////////////////////////////////////////////////
		// 20160228
		///////////////////////////////////////////////////////////
		//client.on('report_screensize', function(obj){
			// sanity check
		//	console.log('report_screensize', obj.room, obj.id, obj);
		//	io.sockets.in(obj.room).emit('report_screensize', obj);
		//});
		
	});
	
	//////////////////////////////////////////////////////////////////////////////////////////

	function describeRoom(room) {
		//console.log('describeRoom: ' + room);
		var clients = io.sockets.clients(room);
		var result = {
			clients: {}
		};
		clients.forEach(function (client) {
			result.clients[client.id] = client.resources;
		});
		return result;
	}

	//////////////////////////////////////////////////////////////////////////////////////////
	
	// tell number of clients in a room
	function clientsInRoom(room){
		return io.sockets.clients(room).length;
	}

	//////////////////////////////////////////////////////////////////////////////////////////

	function safeCb(cb){
		if (typeof cb === 'function') {
			return cb;
		} else {
			return function (){};
		}
	}

	//////////////////////////////////////////////////////////////////////////////////////////
	
	function showAllClients(s){
		for (var room in rooms){
			if (rooms[room]){
				var nClient = clientsInRoom(room);
				console.log(s + ': ' + room + ' client=' + nClient);
				if (!nClient){
					// no any client
					delete rooms[room];
				}
			}
		}
	}
};

sockets(server, config);
