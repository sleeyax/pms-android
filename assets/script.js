function updateUiMsg(msg, color = 'text-success') {
	$('#msg').html('<span class="' + color + '">' + msg + '</span>');
}

function doneLoading(url) {
	app.loadURL(url);
}

front.on('log', function (msg, color = 'text-success', shouldUpdateUiMsg = false) {
	msg = typeof msg === 'object' ? JSON.stringify(msg) : msg;

	if (shouldUpdateUiMsg)
		updateUiMsg(msg, color);

	var logDir = app.getPath('userData');
	var isError = color === 'text-danger';

	if (logDir != null && logDir != -1)
		front.send('log', msg, logDir, isError);

	if (isError)
		console.error(msg);
	else
		console.log(msg);
});

front.on('done', doneLoading);

front.send('init');
updateUiMsg('Loading ...');
