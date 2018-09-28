	var HOST = 'ws://' + window.document.location.host.replace(/:.*/, '') + ':3000'
	class Debug {
		static setTarget(target){
			this.target = target;
		}
		static log(log){
			if(this.target === undefined || this.target === null){
				this.target = document.body;
			}
			this.target.innerHTML +='<p>' + log + '</p>';
		}

	}
	class MatchingClient{
		initialize(address){
			Debug.log("web socket server address : " + address);
			this.address = address;
		}
		reqConnect(){
			Debug.log("request connect");
			if(this.address === null){
				return;
			}
			this.ws = new WebSocket(this.address);
			this.ws.onmessage = this.onMessage;
			this.ws.onerror = this.onError;
			Debug.log("connecting...");
		}
		onConnect(){
			Debug.log("connect.");
		}
		onMessage(event){
            	Debug.log(/*JSON.parse(*/(event));
		}
		onError(event){
			Debug.log("error");
		}

	}
	Debug.setTarget(document.getElementById("debug"));
	var mc = new MatchingClient();
	mc.initialize(HOST);
	mc.reqConnect();