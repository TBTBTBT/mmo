var Connection = require('connection');
var WebSocketClient = require('ws');
var HTTPserver = require('./client.js');
//GlobalDefine
var WS_PORT = 3000;
var MATCH_NUM = 2;
//var WS_GAMESERVER = 'ws://localhost:4000';
var WS_GAMESERVER = 'wss://gamemain.herokuapp.com'
class ClientFormat{
	constructor(client,state){
		this.client = client;
		this._state = '';		
		this.room = '';
	}

	set state(val) {
    	console.log('[ client ]state=' + val);
    	this._state = val;
  	}
  	get state(){
  		return this._state
  	}
}
//---------------------------------------------------------------------
//MatchingServer
//抽象化したい関数を上から順に書く
//matchingLogic マッチングする際のロジック

//クライアントのステートいちらん
//connect 初回接続
//entry   名前等初期情報受信後
//wait    マッチング待ち
//match   マッチング
//exit    マッチング情報送信後
class MatchingServer extends Connection{
//---------------------------------------------------------------------
//マッチングロジック
	matchingLogic(clients){
		var group = [];
		var num = MATCH_NUM ;
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
			//ゲームサーバーにリクエスト
			//this.gsreqCreateRoom(roomId);
				for (var j = 0 ; j < group[i].length; j ++){

					clients[group[i][j]].state = 'match';
					clients[group[i][j]].room  = roomId;
				}
			}
		}




		//console.log(group);
		console.log("[ update ] group make " + group.length);
	}
//---------------------------------------------------------------------
//responseDefine
//クライアントからのmessageのtypeに対するレスポンス定義
	responseDefine(){
		this.response = {
			connect: this.resConnect,
			
		}
		/*
		this.gsResponse = {
			connect: this.gsresConnect,
			gscreate: this.gsresCreateRoom
		}*/
	}
//---------------------------------------------------------------------
//response
	resConnect(self,id,data){
		var name = data.name;

		console.log('[ client ] entry named :' + name);
		self.clients[id].state = 'entry';
	}
	resEntry(self,id,data){
		
		self.clients[id].state = 'entry';
	}
//---------------------------------------------------------------------
//constructor
	constructor(data){
		super(data);
		this.clients = {};
		this.responseDefine();
		//this.startUpdate();
	}


//---------------------------------------------------------------------
//request

	/*
	reqRollCall(){
		//closeでまかなえなかった場合に作成する
		this.broadcastRollCall();
	}*/
	
//---------------------------------------------------------------------
//callback
	onOpen(id,client,req){
		this.clients[id] = new ClientFormat(client,'connect');
		this.sendConnectionCallback(id,client);
		if(this.isUpdateStart()){
			this.startUpdate();
		}

		console.log('[ client ] connected id:' + id);
		console.log('[ client ] length :' + Object.keys(this.clients).length);

		//super.broadcast(id);
	}
	onMessage(id,client,message){
		var obj = JSON.parse(message);
		if(this.response[obj.type]){
			this.response[obj.type](this,id,obj.data);
		}
		console.log('[ client ] message from id:' + id + ' : ' + message);
	}
	onClose(id,client,address){
		delete this.clients[id];
		if(this.isUpdateStop()){
			this.stopUpdate();
		}
		console.log('[ client ] disconnected id:' + id);
		
	}
	onError(e){
		console.log(e);
		
	}
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
		send.data.address = WS_GAMESERVER;
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
//updateTrigger (bool)
	isUpdateStart(){
		var isStart = Object.keys(this.clients).length > 1;
		return isStart;
	}
	isUpdateStop(){
		var isStop = Object.keys(this.clients).length <= 1;

		return isStop;
	}
//---------------------------------------------------------------------
//connection gameServer
/*
	gsConnect(self){
		console.log("[ game ] connecting gameserver..." );
		this.gameServer = new WebSocketClient();
		this.gameServer.on('message',self.gsOnMessage);
		this.gameServer.connect(WS_GAMESERVER, 'echo-protocol');

		console.log("[ game ] connect gameserver. " );
	}
	gsOnMessage(event){
		var obj = JSON.parse(event.data);
		this.gsResponse[obj.type](this,'',obj.data);
		console.log('[ client ] message from id:' + id + ' : ' + message);
	}

	gsresConnect(self,data){
		var obj = {};
		obj.type = 'suconnect';
		var message = JSON.stringify(obj);
		this.gameServer.send(message);
	}
	gsresCreateRoom(self,data){
		var room = data.room;
		for (var id in this.clients){
			if(this.clients[id].state != 'match'){
				continue;
			}

			if(this.clients[id].room != room){
				continue;
			}
			this.sendMatchingInfo(id,this.clients[id].client);
			console.log(" matching :" + id);
			this.clients[id].state = 'exit';
		}
	}	

	gsreqCreateRoom(room){
		var obj = {};
		obj.data = {};
		obj.type = 'sumakeroom';
		obj.data.room = room;
		var message = JSON.stringify(obj);
		this.gameServer.send(message);
	}
	*/
//---------------------------------------------------------------------
//update
	updateClientState(){

		for (var id in this.clients){
			if(this.clients[id].state == 'entry'){
				this.clients[id].state = 'wait';
			}
		}
		console.log("[ update ] update clients :" + Object.keys(this.clients).length);
	}
	/*
	updateConnectionGameServer(){
		if(this.gameServer !== undefined){
			return;
		}
		this.gsConnect(this);
	}*/
	updateMatching(){
		this.matchingLogic(this.clients);
		for (var id in this.clients){
			if(this.clients[id].state != 'match'){
				continue;
			}
			this.sendMatchingInfo(id,this.clients[id].client);
			console.log(" matching :" + id);
			this.clients[id].state = 'exit';
		}
		console.log("[ update ] update matching :" + Object.keys(this.clients).length);
	}
//---------------------------------------------------------------------
//---------------------------------------------------------------------
	startUpdate(){
		var my = this;
		//console.log(this.timer);
		if(this.timer === undefined){
			this.timer = setInterval(function(){my.update(my);}, 1000);
		}
	}
	stopUpdate(){
		//console.log(this.timer);
		clearInterval(this.timer);
		this.timer = undefined;
	}
	update(self){
		//self.updateConnectionGameServer();
		self.updateClientState();
		self.updateMatching();
		
	}
}

var ms = new MatchingServer({server: HTTPserver(WS_PORT)});
