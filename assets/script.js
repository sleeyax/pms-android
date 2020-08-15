function updateLog(msg, msgColor = 'text-white') {
	var time =  new Date().toTimeString().split(" ")[0];
	$("#log").append("<span class=\"" + msgColor + "\">" + "[" + time + "]: " +  msg + "<br></span>");
}

front.on("log", function(msg, color) {
	updateLog(typeof msg === 'object' ? JSON.stringify(msg) : msg, color);

	if (color === 'text-danger') {
		console.error(msg);
	} else {
		console.log(msg);
	}
});

$('#init').click(function() {
	front.send("init");
});

updateLog("Waiting for user action");
