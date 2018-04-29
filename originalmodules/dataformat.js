
'use strict';
const Format = class{};

Format.Player = class{}

Format.Player.Pos = class {
    constructor(){
        //データ初期化
        this.param = {
            x:0,
            y:0,
        };

    }

    Update(params) {
        
    }
}
Format.Player.State = class {
    constructor(){
        //データ初期化
        this.param = {
            name:"",
            state:0,
            charge:0
        };
    }
}
Format.Input = class {
    constructor(){
        //データ初期化
        this.param = {
            dir: 0,
            a:0,
            b:0
        };
    }
}

module.exports = Format;
