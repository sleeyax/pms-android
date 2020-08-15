const express = require('../PimpMyStremio/src/node_modules/express')
const getPort = require('../PimpMyStremio/src/node_modules/get-port')
const addon = require('../PimpMyStremio/src/lib/addon')
const uConfig = require('../PimpMyStremio/src/lib/config/userConfig')
const userConfig = uConfig.read().userDefined
const proxy = require('../PimpMyStremio/src/lib/proxy')
const cleanUp = require('../PimpMyStremio/src/lib/cleanUp')
const sideload = require('../PimpMyStremio/src/lib/sideload')
const login = require('../PimpMyStremio/src/lib/login')
const path = require('path')
const {writeToLog} = require('./helpers')

// monkey patch console.log() & console.error() to get more control over what it does
const back = require('androidjs').back
console.log = function (msg) {
  writeToLog(msg)
	back.send('log', msg)
}
console.error = function (msg) {
  writeToLog(msg, true)
	back.send('log', msg, 'text-danger')
}

const router = express()

const respond = (res, data) => {
	if ((data || {}).cacheMaxAge)
		res.setHeader('Cache-Control', 'max-age=' + data.cacheMaxAge)
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Access-Control-Allow-Headers', '*')
	res.setHeader('Content-Type', 'application/json')
	res.send(data)
}

const fail = res => {
	res.writeHead(500)
	res.end(JSON.stringify({ err: 'handler error' }))
}

let loadMsg = 'Loading ...'
let loadFinished = false

router.get('/loading-api', (req, res) => {
	respond(res, loadFinished ? { redirect: proxy.getEndpoint() } : { msg: loadMsg })
})

router.use(express.static(path.join(__dirname, '..', 'PimpMyStremio/src/web')))

let server
let serverHost
let serverPort
let serverProtocol

async function init() {

	serverPort = await getPort({ port: [userConfig.serverPort, 3030] })

	function listenHandler() {

		let url = 'https://sungshon.github.io/PimpMyStremio/loader/'

		url += '?port=' + serverPort + '&protocol=' + serverProtocol + '&host=' + encodeURIComponent(serverHost)

		addon.init(userConfig.runningAddons, () => {
			sideload.loadAll(runServer)
		}, cleanUp.restart, (task, started, total) => {
			loadMsg = 'Starting addon: ' + started + ' / ' + total + '///"' + task.name + '"'
		})
	}

	function useLocalIp() {
		serverProtocol = 'http'
		serverHost = '127.0.0.1'
		server = router.listen(serverPort, listenHandler)
	}

	console.log('Remote access choice: ' + userConfig.externalUse)

	if (userConfig.externalUse == 'No (local)')
		useLocalIp()
	else {
		function getIp(cb) {
			if (userConfig.externalUse == 'LAN') {
				if (process.env['PMS_LAN_IP'])
					cb(null, process.env['PMS_LAN_IP'])
				else
					cb(null, require('../PimpMyStremio/src/node_modules/my-local-ip')())
			} else if (userConfig.externalUse == 'External') {
				console.log('Retrieving external IP ...')
				require('externalip')(cb)
			}
		}
		getIp((err, ip) => {
			if (ip) {
				console.log('Domain IP: ' + ip)
				const getCert = require('../PimpMyStremio/src/lib/https')
				getCert(ip).then(cert => {
					if (cert && cert.key && cert.cert) {
						serverProtocol = 'https'
						serverHost = cert.domain
						console.log('Domain: ' + cert.domain)
						const https = require('https')
						server = https.createServer({
							key: cert.key,
							cert: cert.cert
						}, router).listen(serverPort, listenHandler)
					} else {
						console.error(Error('Could not get cert'))
						useLocalIp()
					}
				}).catch(err => {
					if (err)
						console.error(err)
					useLocalIp()
				})
			} else {
				if (err)
					console.error(err)
				useLocalIp()
			}
		})
	}

}

async function runServer() {

	router.get('/login-api', (req, res) => {
		const query = req.query || {}
		const method = query.method
		const val = query.val
		if (login[method]) {
			login[method](val).then(resp => {
				respond(res, resp)
			}).catch(err => {
				console.error(err)
				fail(res)
			})
		} else
			fail(res)
	})

	router.get('/api', (req, res) => {
		const query = req.query || {}
		const method = query.method
		const name = query.name
		const pass = uConfig.readPass()
		if (pass && query.pass != pass) {
			fail(res)
			return
		}
		if (addon[method] && method != 'init') {
			addon[method](addon.getManifest(name), decodeURIComponent(query.payload)).then(resp => {
				respond(res, resp)
			}).catch(err => {
        console.error(err)
        fail(res)
			})
		} else
			fail(res)
	})

	router.get('/catalog.json', (req, res) => {
		const reqHost = req.headers.host
		const host = reqHost ? req.protocol + (reqHost.includes('.serveo.net') ? 's' : '') + '://' + reqHost : false
		addon.getCatalog(host, serverPort).then(resp => {
			respond(res, resp)
		}).catch(err => {
			console.error(err)
			fail(res)
		})
	})

	function getRouter(req, res) {
		const vmAddon = addon.get(req.params.addonName)
		if ((vmAddon || {}).router)
			vmAddon.router(req, res, () => {
				res.setHeader('Access-Control-Allow-Origin', '*')
				res.statusCode = 404
				res.end()
			})
		else
			fail(res)
	}

	router.get('/:addonName/manifest.json', getRouter)

	router.get('/:addonName/:resource/:type/:id/:extra?.json', getRouter)

	proxy.createProxyServer(router)

	cleanUp.set(server)

	const url = serverProtocol + '://' + serverHost + ':' + serverPort

	proxy.setEndpoint(url)

	console.log('PimpMyStremio server running at: ' + url)

	systray.init()

	loadFinished = true

}

module.exports = {init};