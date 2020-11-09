
function Pointer(objectId) {
	this.__type = "Pointer";
	this.className = "Comment";
	this.objectId = objectId;
}
function Time() {
	this.__type = "Date",
	this.iso = new Date().toISOString()
}
const id = {
	"site": "5f8d86ebf16d7830e4a21643"
}
const whitelist = [
	"https://fiammanda.gitee.io",
	"https://fiammanda.github.io"
]

async function requestWith(request) {
	const url = request.url.replace("https://api.fiammanda.workers.dev", "")
	let path = "https://xxxxxxxx.api.lncldglobal.com/1.1/"
	let params = {
		headers: {
			"X-LC-Id": "",
			"X-LC-Key": "",
			"Content-Type": "application/json"
		}
	}

	if (url === "/") {
		path += "classes/Counter?limit=200&keys=-createdAt,-updatedAt"
	} else if (url.indexOf("/comments") === 0) {
		path += `classes/Comment?where={"url":"${url.replace("/comments","")}"}&keys=-createdAt,-updatedAt,-url"`
	} else if (url === "/comment") {
		let body = await request.json()
		body.time = new Time()
		body.rid &&= new Pointer(body.rid)
		body.tid &&= new Pointer(body.tid)
		body.ip = request.headers.get("Cf-Connecting-Ip")
		body.ua = request.headers.get("User-Agent")
		path += "classes/Comment"
		params.method = "POST"
		params.body = JSON.stringify(body)
	} else if (url === "/register") {
		let body = await request.json()
		path += "classes/Counter"
		params.method = "POST"
		params.body = JSON.stringify(body)
	} else if (/\/(visit|view|like|unlike)\/[0-9a-z]{24}/.test(url)) {
		id.page = url.split("/")[2]
		let operation = url.split("/")[1]
		let body = {"requests": [
			{
				"method": "PUT",
				"path": "/1.1/classes/Counter/" + id.site
			},
			{
				"method": "PUT",
				"path": "/1.1/classes/Counter/" + id.page
			}
		]}
		switch (operation) {
			case "visit":
				body.requests[0].body = {
					"pv": {"__op": "Increment", "amount": 1},
					"uv": {"__op": "Increment", "amount": 1}
				}
				body.requests[1].body = {
					"pv": {"__op": "Increment", "amount": 1},
					"uv": {"__op": "Increment", "amount": 1}
				}
				break
			case "view":
				body.requests[0].body = {
					"pv": {"__op": "Increment", "amount": 1}
				}
				body.requests[1].body = {
					"pv": {"__op": "Increment", "amount": 1}
				}
				break
			case "like":
				body.requests[0].body = {
					"like": {"__op": "Increment", "amount": 1}
				}
				body.requests[1].body = {
					"like": {"__op": "Increment", "amount": 1}
				}
				break
			case "unlike":
				body.requests[0].body = {
					"like": {"__op": "Increment", "amount": -1}
				}
				body.requests[1].body = {
					"like": {"__op": "Increment", "amount": -1}
				}
		}
		path += "batch"
		params.method = "POST"
		params.body = JSON.stringify(body)
	}

	const req = new Request(path, params)
	const res = await fetch(req)
	let json = await res.json()

	if (url === "/") {
		let body = {}
		json.results.forEach(result => {
			body[result.url] = {
				id: result.objectId,
				like: result.like,
				view: result.pv
			}
		})
		json = body
	} else if (url.indexOf("/comments") === 0) {
		json.results.forEach(result => {
			result.time = result.time.iso
			result.rid &&= result.rid.objectId
			result.tid &&= result.tid.objectId
		})
		json = json.results
	}

	const response = new Response(JSON.stringify(json), res)
	response.headers.set("Access-Control-Allow-Origin", "*")
	return response
}

addEventListener("fetch", event => {
	const origin = event.request.headers.get("Origin")
	if (whitelist.includes(origin)) {
		event.respondWith(requestWith(event.request))
	} else {
		let error = new Response(JSON.stringify({ error: "Domain not allowed." }), {
			status: 403,
			headers: {
				"Content-Type": "application/json"
			}
		})
		event.respondWith(error)
	}
})
