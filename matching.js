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
		this.define();
		this.clients = {};

	}
	//メッセージタイプによる振る舞いの定義
	define(){
        this.behaviour = {
            connect: (data) => msgConnect(data),
            entryname:(data)=> msgEntryName(data),
            chat: 	 (data) => msgChat(data)
        }
    }
    msgConnect(data){
    	console.log('client connected ');
    }
    msgEntryName(data){
    	console.log('client connected name');
    }
    msgChat(data){
    	
    }
    //コールバック
	onOpen(id,client,req){
		console.log('client connected id:' + id);
		this.clients[id] = new CF(client,'connect');
		console.log('clients length :' + Object.keys(this.clients).length);
		this.sendConnectionCallback(id,client);
		//super.broadcast(id);
	}
	onMessage(id,message){
		console.log('message from id:' + id + ' : ' + message);
		//var res = JSON.parse(message);
		//this.behaviour[res.type](res.data);
		
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
var ms = new MS({server: HTTPserver(WS_PORT)});