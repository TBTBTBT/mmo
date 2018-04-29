
'use strict';

class Player {
    constructor(){
        //データ初期化
        this.param = {
            name:"",
            x:0,
            y:0,
            state:0,
            charge:0
        };

    }

    Update(params) {
        
    }
}
class Input {
    constructor(){
        this.input = {
            dir:0,
            a:0,
            b:0
        }
    }
}
class FormatData{
    constructor(id,type,data){
        this.data = {
            id: id,
            type: type,
            data: data
        };
    }
}
module.exports = Player;
