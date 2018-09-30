var Connection = require('connection');

var PORT = 3000;
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
	}
	onOpen(id,client,req){
		console.log('client connected id:' + id);
		this.clients[id] = new CF(client,'connect');
		console.log('clients length :' + Object.keys(this.clients).length);
		this.sendConnectionCallback(id,client);
		//super.broadcast(id);
	}
	onMessage(id,message){
		console.log('message from id:' + id + ' : ' + message);
		
	}
	onClose(id,address){
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
var ms = new MS({port:PORT});