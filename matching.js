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
		this.room = '';
	}
}
class MatchingServer extends Connection{
//---------------------------------------------------------------------
//---------------------------------------------------------------------
//constructor
	constructor(data){
		super(data);
		this.clients = {};
		this.define();
		this.startUpdate();
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
	resConnect(self,id,data){
		var name = data.name;

		console.log('client on stage named :' + name);
		self.clients[id].state = 'entry';
	}
	resEntry(self,id,data){
		
		self.clients[id].state = 'entry';
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
		this.response[obj.type](this,id,obj.data);
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
	sendMatchingInfo(id,client){
		var send = {};
		send.type = 'match';
		send.data = {};
		send.data.address = "ws://";
		send.data.room = this.clients[id].room;
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
//matchingLogic
	matchingLogic(clients){
		var group = [];
		var num = 2;
		group.push([]);
		for (var id in clients){
			if(clients[id].state == 'wait'){
				if(group[group.length - 1].length < num){
						group[group.length - 1].push(id);
				}
				else{
					group.push([id]);
				}

			}
		}
		
		for (var i = 0 ; i < group.length; i ++){
			if(group[i].length == num){
			var roomId = group[i][0];
				for (var j = 0 ; j < group[i].length; j ++){
					clients[group[i][j]].state = 'match';
					clients[group[i][j]].room  = roomId;
				}
			}
		}
		console.log(group);
		console.log(" group make " + group.length);
	}
//---------------------------------------------------------------------
//---------------------------------------------------------------------
//update
	updateClientState(){

		for (var id in this.clients){
			if(this.clients[id].state == 'entry'){
				this.clients[id].state = 'wait';
			}
		}
		console.log(" update clients :" + Object.keys(this.clients).length);
	}
	updateMatching(){
		this.matchingLogic(this.clients);
		for (var id in this.clients){
			if(this.clients[id].state == 'match'){
				console.log(" matching :" + id);
				this.sendMatchingInfo(id,this.clients[id].client);
					
			}
		}
		console.log(" update matching :" + Object.keys(this.clients).length);
	}
//---------------------------------------------------------------------
//---------------------------------------------------------------------
	startUpdate(){
		var my = this;
		setInterval(function(){my.update(my);}, 1000);
	}
	update(self){
		self.updateClientState();
		self.updateMatching();
		
	}
}

var ms = new MatchingServer({server: HTTPserver(WS_PORT)});