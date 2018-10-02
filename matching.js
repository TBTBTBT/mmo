var Connection = require('connection');
var HTTPserver = require('./client.js');

var WS_PORT = 3000;

//client state list
/*
Connect
Wait
Match
Exit
*/
var CF = class ClientFormat{
	constructor(client,state){
		this.client = client;
		this.state = state;
	}
}
var CM = class ClientManager extends Connection{
	constructor(data){
		super(data);
		this.clients = {};
		this.define();
	}

	//define
	define(){
		this.response = {
			connect: this.resConnect
		}
	}
	resConnect(id,data){
		var name = data.name;
		console.log('client on stage named :' + name);
	}
	onOpen(id,client,req){
		this.clients[id] = new CF(client,'connect');
		this.sendConnectionCallback(id,client);
		console.log('client connected id:' + id);
		console.log('clients length :' + Object.keys(this.clients).length);

		//super.broadcast(id);
	}
	onMessage(id,client,message){
		var obj = JSON.parse(message);
		this.response[obj.type](id,obj.data);
		console.log('message from id:' + id + ' : ' + message);
	}
	onClose(id,client,address){
		delete this.clients[id];
		console.log('client disconnected id:' + id);
		
	}
	onError(e){
		console.log(e);
		
	}
	sendConnectionCallback(id,client){
		var send = {};
		send.type = 'connect';
		send.data = {};
		send.data.id = id;
		super.send(client,JSON.stringify(send));
	}
	sendGameServerAddress(){
		//roomId + address
		var send = [];
	}
	broadcastEncount(name){
		var send = {};
		send.type = 'encount';
		send.data = {};
		send.data.id = id;
	}
}
var MS = class MatchingServer{
	constructor(data){
		this.server  = new CM(data);
		//this.clients = new ClientManager();
		//this.server.event.on('open', (id,client,req) =>{});
		this.state = 'init';
		this.update(1000);
	} 
	update(tick){

	}
	//sequence


}
var ms = new MS({server: HTTPserver(WS_PORT)});