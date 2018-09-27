var Connect = require('connection');

var PORT = 3000;

class MatchingServer extends Connect{
	onOpen(id,client,req){
		console.log('open id : ' + id +' from : ' + req.connection.remoteAddress);
    }
    onMessage(id,client,message){

    }
    onClose(id,client,req){
        
    }
}
var ms = new MatchingServer({port:PORT});