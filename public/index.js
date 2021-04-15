
var webSock = new WebSocket("ws://localhost:8080")

var textArea = document.getElementById("a")

webSock.onopen = function(event){
    textArea.innerText+="Socket Open! \n";
    webSock.send("hello server");
}

webSock.onmessage = function (message) {
    textArea.innerText+= "Message:" + message.data +" \n"
    console.log("received: %s", message.data)
}


