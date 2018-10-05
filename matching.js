var Connection = require('connection');
var HTTPserver = require('./client.js');

var WS_PORT = 3000;

//client state list
/*
Connect
Entry
Wait
Match
Exit
*/
class ClientFormat{
	constructor(client,state){
		this.client = client;
		this.state = state;
	}
}
class ClientManager extends Connection{
//---------------------------------------------------------------------
//---------------------------------------------------------------------
//constructor
	constructor(data){
		super(data);
		this.clients = {};
		this.define();
	}
//---------------------------------------------------------------------
//---------------------------------------------------------------------
//define
	define(){
		this.response = {
			connect: this.resConnect
		}
	}
//---------------------------------------------------------------------
//---------------------------------------------------------------------
//responce
	resConnect(id,data){
		var name = data.name;

		console.log('client on stage named :' + name);
	}
	resEntry(id,data){
		
		this.clients[id].state = 'entry';
	}
//---------------------------------------------------------------------
//---------------------------------------------------------------------
//request

	/*
	reqRollCall(){
		//closeでまかなえなかった場合に作成する
		this.broadcastRollCall();
	}*/
	
//---------------------------------------------------------------------
//---------------------------------------------------------------------
//callback
	onOpen(id,client,req){
		this.clients[id] = new ClientFormat(client,'connect');
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
//---------------------------------------------------------------------
//---------------------------------------------------------------------
//send
	sendConnectionCallback(id,client){
		var send = {};
		send.type = 'connect';
		send.data = {};
		send.data.id = id;
		super.send(client,JSON.stringify(send));
	}
	//omit
	/*
	broadcastRollCall(){

		var send = {};
		send.type = 'rollcall';
		send.data = {};
		send.data.id = id;
	}*/

//---------------------------------------------------------------------
//---------------------------------------------------------------------
//update
	updateClientState(){
		this.clients.ForEach(
			function each(c){
				if(c.state == 'entry'){
					c.state = 'wait';
				}
			});
	}
	update
	updateMatching(){
		this.clients.ForEach(
			function each(c){
				if(c.state == 'wait'){
					
				}
			});
	}
}
class MatchingServer{
	constructor(data){
		this.server  = new ClientManager(data);
		//this.clients = new ClientManager();
		//this.server.event.on('open', (id,client,req) =>{});
		this.state = 'init';
		//this.update(1000);
	} 
	startUpdate(self){
		self.update(1000);
	}
	update(tick){
		this.updateMatching();
	}

}
var ms = new MatchingServer({server: HTTPserver(WS_PORT)});