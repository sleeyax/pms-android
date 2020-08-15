// spawn processes in the same thread as the app
// (multiple child processes simply don't work here, so we have no choice but to use this)
process.env['NO_CHILDREN'] = '1'

const back = require('androidjs').back
const {init} = require('./src/bootstrap');

back.on('init', async () => {
	let msg = 'done'

	try {
		await init()
		back.send('log', 'Initialized', 'text-white')
	} catch (ex) {
		back.send('log', 'failed to initialize (' + ex + ')', 'text-danger')
	}
});


