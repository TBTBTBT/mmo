
///websocket汎用サーバーにしたい

//=========================================================================
//-------------------------------------------------------------------------
//宣言
//-------------------------------------------------------------------------
//=========================================================================

var Player   = require ('./originalmodules/dataformat').Player;
//var Input    = require ('./originalmodules/dataformat').Input;
//var Attack   = require ('./originalmodules/Attack');
var Server   = require ('gwss');
var AAJFormat = Server.AAJF; //データフォーマット

var fs = require('fs');
var http = require('http');
var server = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.end(fs.readFileSync(__dirname + '/front/index.html', 'utf-8'));
}).listen(process.env.PORT || 5000);

//wsシングルトン
var g = new Server ({server: server}); 

//情報配列

var InfoPlayerPos = new AAJFormat("Player");//out rate 60/1sec
var InfoPlayerState =  new AAJFormat("PlayerState");
var InfoInput  = new AAJFormat("Input"); //in  on   keydown
//var InfoAttack = new AAJFormat("Attack");//out rate 20/1sec
//var playerInfo = [];
//=========================================================================
//-------------------------------------------------------------------------
//接続
//-------------------------------------------------------------------------
//=========================================================================

g.wss.server.on ('open' , (id,address,client) => { OnOpen (id,address,client);});
g.wss.server.on ('close', (id,address)        => { OnClose(id,address);});
g.wss.server.on ('error', (e)                 => { } );

//=========================================================================
//-------------------------------------------------------------------------
//タイプ別メッセージイベント宣言
//-------------------------------------------------------------------------
//=========================================================================

//g.wss.server.on ('Player', (id,data) => {});
g.wss.server.on ('Input' , (id,data)          => { GetInput(id,data); });
//g.wss.server.on ('Attack', (id,data) => {});



//=========================================================================
//-------------------------------------------------------------------------
//メインループ
//-------------------------------------------------------------------------
//=========================================================================

function update60(){
    //if(Object.keys(playerInfo).length > 0){
    if(InfoPlayerPos.length() > 0){
        InfoInput.foreach((id) =>{
            //位置を更新
            InfoPlayerPos.array[id].update(InfoInput.array[id].dir);
        });
        g.broadcast(InfoPlayerPos.getAAJFString());
    }

}
function update20(){


}
setInterval(update60,16);


//=========================================================================
//-------------------------------------------------------------------------
//接続時のコールバック
//-------------------------------------------------------------------------
//=========================================================================


function OnOpen(id,address,client){
    InfoPlayerPos.addData(id,new Player.Pos());
    client.send(InfoPlayerPos.getAAJFString());//最初のデータ送信 
    //debug
    console.log ("open   : "+id+" from : "+address);

}
function OnClose(id,address){
    InfoPlayerPos.deleteData(id);
    InfoInput.deleteData(id);
    //debug
    console.log ("close  : "+id+" from : "+address);
}

//=========================================================================
//-------------------------------------------------------------------------
//タイプ別受信処理
//-------------------------------------------------------------------------
//=========================================================================


//入力情報
function GetInput(id,data){
    InfoInput.addData(id,data);
}

//=========================================================================
//-------------------------------------------------------------------------
//その他関数
//-------------------------------------------------------------------------
//=========================================================================
