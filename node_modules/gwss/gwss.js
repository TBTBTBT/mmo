
//WebSocket汎用サーバー
//データをJSONでやり取りする

//

const ws  = require ('ws').Server;
const EventEmitter = require('events').EventEmitter;

//データの先頭にTypeを付加できる。
//全てのデータをJSON形式でやり取りをすることを推奨している。
class GeneralSocketServer{

    

    constructor(data,isJSONServer = true){

        console.log("server working");
        this.wss = new ws(data);
        this.wss.server = new EventEmitter();
        this.wss.on ('connection', function (client,req) {

            //最初の接続時
            var id = req.headers['sec-websocket-key'];//ユニークなID
            console.log("connect : "+id);
            this.server.emit('open',id,req.connection.remoteAddress,client);
           
            client.on ('message', (message) => {  //受信
                    var obj = JSON.parse(message);
                    this.server.emit(obj.type,id,obj.array,client);
            });
            client.on ('close', ()  /* 終了  */ => { this.server.emit('close',id,req.connection.remoteAddress,client);});
            client.on ('error' ,(e) /* エラー */ => {} );
        
        
        });
    }

    
    //メッセージにtypeを付加する
    FormatData(data,type){
        //data.type = type;
        var ret = {type: type, data: data};
        //console.log(data.type);
        return JSON.stringify(ret);
    }
    AssocArrayToJSON(array){
        var ret = [];
        Object.keys(array).forEach( (element) => {
            ret.push({id: element ,data: array[element]});
        });
        var str = JSON.stringify(ret);
        var jsonArray = JSON.parse(str.slice(1,str.length-1));
        return jsonArray;
    }
    broadcast (data) {
        this.wss.clients.forEach(
            function each(c) {
            if (c.readyState === c.OPEN) {
                 c.send (data);
             }
        });
    };
    broadcastFormatData (data) {
        this.wss.clients.forEach(
            function each(c) {
            c.send (data);
        });
    };
}

module.exports = GeneralSocketServer;