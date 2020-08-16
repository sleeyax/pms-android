// spawn processes in the same thread as the app
// (multiple child processes simply don't work here, so we have no choice but to use this)
process.env['NO_CHILDREN'] = '1'

const back = require('androidjs').back
const { init, getStatus } = require('./src/bootstrap');
const { writeToLog } = require('./src/helpers');

const timer = setInterval(() => {
	const status = getStatus();

	if (status.redirect) {
		clearInterval(timer);
		back.send('done', status.redirect)
	} else if (status.msg) {
		const splitted = status.msg.split('\n')
		if (splitted.length == 2) {
			back.send('log', status.msg + '<br><br><strong>' + splitted[1] + '</strong>', 'text-success', true)
		} else {
			back.send('log', status.msg)
		}
	} else {
		back.send('log', 'status is null', 'text-danger')
	}
}, 3000);

back.on('init', async () => {
	// avoid duplicate app instances
	const status = getStatus()
	if (status.redirect) {
		back.send('done', status.redirect)
		return
	}

	// start PMS
	try {
		await init()
	} catch (ex) {
		back.send('log', 'Failed to load (' + ex + '). See logs for details!', 'text-danger', true)
	}
})

back.on('log', writeToLog)
