// spawn processes in the same thread as the app
// (multiple child processes simply don't work here, so we have no choice but to use this)
process.env['NO_CHILDREN'] = '1'

const back = require('androidjs').back
const {init} = require('./src/bootstrap');
const {writeToLog} = require('./src/helpers');

back.on('init', async () => {
	try {
		const url = await init((url) => {
			back.send('done', url)
		})
	} catch (ex) {
		back.send('log', 'Failed to load (' + ex + '). See logs for details!', 'text-danger')
	}
});

back.on('log', writeToLog)
