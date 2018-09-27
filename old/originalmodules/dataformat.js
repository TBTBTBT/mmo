
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

    update(angle) {
        if(angle >= 0){
            this.param.x += Math.cos(angle * Math.PI / 180);
            this.param.y += Math.sin(angle * Math.PI / 180);
        }
        else{

        }
    }
}
Format.Player.State = class {
    constructor(){
        //データ初期化
        this.param = {
            name:"",
            state:"",
            charge:0,
        };
    }
}
Format.Player.State2 = class {
    constructor(){
        //データ初期化
        this.param = {
            hp: 10,
            atk : 1,
            spd : 1
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
Format.FirstInfo = class {
    constructor(){
        //データ初期化
        this.param = {
            name:"",
        };
    }
}
Format.Attack = class{
    constructor(){
        //データ初期化
        this.param = {
            x:0,
            y:0,
            size:100
        };
    }
}
module.exports = Format;
