function updateMsg(msg, color = 'text-success') {
	$('#msg').html('<span class="' + color + '">' + msg + '</span>');
}

front.on('log', function (msg, color = 'text-success') {
	msg = typeof msg === 'object' ? JSON.stringify(msg) : msg;

	updateMsg(msg, color);
	
	const logDir = app.getPath('userData');
	const isError = color === 'text-danger';

	if (logDir != null && logDir != -1)
		front.send('log', msg, logDir, isError);

	if (isError)
		console.error(msg);
	else
		console.log(msg);
});

front.on('done', function (url) {
	app.loadURL(url);
});

front.send('init');
updateMsg('Loading ...');
