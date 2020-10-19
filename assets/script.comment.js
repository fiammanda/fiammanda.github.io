
let ip = sessionStorage.getItem('ip'),
    ua = localStorage.getItem('ua');
if (ip == 'visited') {
	ip = returnCitySN.cip;
	sessionStorage.setItem('ip', ip);
}
if (!ua) {
	ua = window.navigator.userAgent;
	localStorage.setItem('ua', window.navigator.userAgent);
}
const list = $('[itemprop="comment"] ul'),
      comments = new AV.Query('Comment'),
      Comment = AV.Object.extend('Comment');

comments.equalTo('url', url).ascending('time').find().then(function(logs) {
	if (logs) {
		list.attr('data-count', logs.length);

		logs.forEach((log) => {
			let li = `<li role="article" data-oid="${log.id}`;
			if (log.attributes.rid) {
				li += `" data-rid="${log.attributes.rid.id}`;
			}
			li += `"><footer>`;
			if (log.attributes.link == '/') {
				li += `<a class="internal" rel="home" href="/">${log.attributes.name}</a>`;
			} else if (log.attributes.link) {
				li += `<a target="_blank" rel="noopener noreferrer nofollow" href="${log.attributes.link}">${log.attributes.name}</a>`;
			} else {
				li += `${log.attributes.name}`;
			}
			li += `<time>${log.attributes.time.toLocaleString('sv-SE')}</time>`;
			if (log.attributes.rid) {
				li += `<span data-rid="${log.attributes.rid}">回复 ${logs.find(x => x.id == log.id).attributes.name}</span>`;
			}
			li += `</footer><div>${log.attributes.text}<a aria-label="reply">+</a></div><ul role="list"></ul></li>`;
			if (log.attributes.rid) {
				$(li).appendTo(`[itemprop="comment"] li[data-oid="${log.attributes.pid.id}"] > ul`);
			} else {
				$(li).appendTo(list);
			}
		});
	}
});
