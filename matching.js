var Connection = require('connection');

var PORT = 3000;

class ClientManager extends Connection{
	constructor(data){
		super(data);
		this.clients = [];
	}
	onOpen(id,client,req){
		console.log('client connected id:' + id);
		super.broadcast(id);
	}
	onMessage(id,message){
		console.log('message from id:' + id + ' : ' + message);
		
	}
	onClose(id,address){
		console.log('client disconnected id:' + id);
		
	}
	onError(e){
		console.log(e);
		
	}
	sendGameServerAddress(){
		//roomId + address
		var send = [];
	}
}
class MatchingServer{
	constructor(data){
		this.server  = new ClientManager(data);
		//this.clients = new ClientManager();
		//this.server.event.on('open', (id,client,req) =>{});
		this.state = 'init';
		this.update(1000);
	} 
	update(tick){

	}
	//sequence


}
var ms = new MatchingServer({port:PORT});