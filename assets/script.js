function updateLog(msg, msgColor = 'text-white') {
	var time = new Date().toTimeString().split(" ")[0];
	$("#log").append("<span class=\"" + msgColor + "\">" + "[" + time + "]: " + msg + "<br></span>");
}

front.on("log", function (msg, color) {
	msg = typeof msg === 'object' ? JSON.stringify(msg) : msg

	updateLog(msg, color);
	
	const logDir = app.getPath('userData')
	const isError = color === 'text-danger'

	if (logDir != null && logDir != -1)
		front.send('log', msg, logDir, isError)

	if (isError)
		console.error(msg);
	else
		console.log(msg);
});

$('#init').click(function () {
	front.send("init");
});

updateLog("Waiting for user action");
