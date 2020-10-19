window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', now);
gtag('config', 'UA-162600333-1');

const url = window.location.pathname,
      title = document.title.split(' |', 1)[0],
      siteID = '5f8d86ebf16d7830e4a21643',
      lcurl = 'https://hscm0rxy.lc-cn-e1-shared.com/1.1/',
      lcheader = {
      	'X-LC-Id': 'hsCm0rxy54MvGFlXO5FIK7dM-9Nh9j0Va',
      	'X-LC-Sign': '321b625ee493daa9b5de592194578031,1603098182202',
      	'Content-Type': 'application/json'
      };

let counter = sessionStorage.getItem('counter');
if (counter) {
	counter = JSON.parse(counter);
	lcCounter();
} else {
	leancloud('counter').then((result) => {
		counter = {};
		result.results.forEach((item) => {
			counter[item.url] = {
				id: item.objectId,
				like: item.like,
				view: item.ov,
			};
		});
		sessionStorage.setItem('counter', JSON.stringify(counter));
		lcCounter();
	}).catch(error => console.log('[Failed to retreive database]: ' + error));
}

function lcCounter() {
	let page = counter[url];
	if (!page) {
		leancloud('counterNew').then((result) => {
			counter[url] = {
				id: result.objectId,
				like: 0,
				view: 1
			};
			sessionStorage.setItem('counter', JSON.stringify(counter));
		}).catch(error => console.log('[Failed to create new counter]: ' + error));
	} else {
		if (!sessionStorage.getItem(url)) {
			if (!localStorage.getItem(url)) {
				leancloud('counterUV', page.id).then(function() {
					counter[url].view += 1;
					sessionStorage.setItem('counter', JSON.stringify(counter));
					sessionStorage.setItem(url, '1');
					localStorage.setItem(url, '1');
				}).catch(error => console.log('[Failed to update UV]: ' + error));
			} else {
				leancloud('counterPV', page.id).then(function() {
					counter[url].view += 1;
					sessionStorage.setItem('counter', JSON.stringify(counter));
					sessionStorage.setItem(url, '1');
				}).catch(error => console.log('[Failed to update PV]: ' + error));
			}
		}
		if (document.body.dataset.layout.indexOf('orks-') > -1) {
			let articles = document.querySelectorAll('article');
			articles.forEach((article) => {
				let href = article.firstElementChild.firstChild.getAttribute('href'),
				    view = article.querySelector('header .view'),
				    like = article.querySelector('header .like');
				if (counter[href]) {
					view.classList.remove('off');
					view.append(counter[href].view);
					like.classList.remove('off');
					like.append(counter[href].like);
				}
			});
		}
		if (document.body.dataset.layout == 'weblog' || document.body.dataset.layout == 'works') {
			let view = $('article header .view'),
			    like = $('article header .like'),
			    list = $('[itemprop="comment"] ul');
			view.append(page.view).attr({
				'data-prev': page.view-1,
				'data-next': page.view,
			}).removeClass('off').addClass('on');
			if (localStorage.getItem(url) == '2') {
				like.attr({
					'data-prev': page.like-1,
					'data-next': page.like,
				}).addClass('on');
			} else {
				like.attr({
					'data-prev': page.like,
					'data-next': page.like+1,
				})
			}
			like.removeClass('off').on('click', function() {
				if (localStorage.getItem(url) != '2') {
					leancloud('counterLike', page.id).then(function() {
						counter[url].like += 1;
						sessionStorage.setItem('counter', JSON.stringify(counter));
						localStorage.setItem(url, '2');
						like.addClass('on');
					}).catch(error => console.log('[Failed to update likes]: ' + error));
				} else {
					leancloud('counterUnlike', page.id).then(function() {
						counter[url].like -= 1;
						sessionStorage.setItem('counter', JSON.stringify(counter));
					}).catch(error => console.log('[Failed to update likes]: ' + error));
					localStorage.setItem(url, '1');
					like.removeClass('on');
				}
			});
			leancloud('comment', url).then((result) => {
				if (result.results.length) {
					result.results.forEach((item) => {
						console.log(JSON.stringify(item.time))
						let li = `<li role="article" data-oid="${item.objectId}`;
						if (item.rid) {
							li += `" data-rid="${item.rid.objectId}`;
						}
						li += `"><article><footer>`;
						if (item.link == '/') {
							li += `<a class="internal" rel="home" href="/">${item.name}</a>`;
						} else if (item.link) {
							li += `<a target="_blank" rel="noopener noreferrer nofollow" href="${item.link}">${item.name}</a>`;
						} else {
							li += `${item.name}`;
						}
						li += `<time>${new Date(item.time.iso).toLocaleString('sv-SE')}</time>`;
						if (item.rid) {
							li += `<span data-rid="${item.rid}">回复 ${result.results.find(x => x.objectId == item.objectId).name}</span>`;
						}
						li += `</footer><div>${item.text}<a aria-label="reply">+</a></div></article><ul role="list"></ul></li>`;
						if (item.rid) {
							$(li).appendTo(`[itemprop="comment"] li[data-oid="${item.pid.objectId}"] > ul`);
						} else {
							$(li).appendTo(list);
						}
					});
				}
			}).catch(error => console.log('[Failed to retreive comments]: ' + error));
		}
	}
}

function leancloud(operation, object) {
	let lcpath = '', lcoption = {}, pageID = object;
	switch (operation) {
		case 'counter':
			lcpath = 'classes/Counter?limit=200&keys=-createdAt,-updatedAt,-title,-uv';
			lcoption = {
				method: 'GET',
				headers: lcheader
			}
			break;
		case 'counterPV':
			lcpath = 'batch';
			lcoption = {
				method: 'POST',
				headers: lcheader,
				body: "{\"requests\": [ { \"method\": \"PUT\", \"path\": \"/1.1/classes/Counter/" + siteID + "\", \"body\": { \"ov\": {\"__op\": \"Increment\", \"amount\": 1} } }, { \"method\": \"PUT\", \"path\": \"/1.1/classes/Counter/" + pageID + "\", \"body\": { \"ov\": {\"__op\": \"Increment\", \"amount\": 1} } } ]}"
			}
			break;
		case 'counterUV':
			lcpath = 'batch';
			lcoption = {
				method: 'POST',
				headers: lcheader,
				body: "{\"requests\": [ { \"method\": \"PUT\", \"path\": \"/1.1/classes/Counter/" + siteID + "\", \"body\": { \"ov\": {\"__op\": \"Increment\", \"amount\": 1}, \"uv\": {\"__op\": \"Increment\", \"amount\": 1} } }, { \"method\": \"PUT\", \"path\": \"/1.1/classes/Counter/" + pageID + "\", \"body\": { \"ov\": {\"__op\": \"Increment\", \"amount\": 1}, \"uv\": {\"__op\": \"Increment\", \"amount\": 1} } } ]}"
			}
			break;
		case 'counterLike':
			lcpath = 'batch';
			lcoption = {
				method: 'POST',
				headers: lcheader,
				body: "{\"requests\": [ { \"method\": \"PUT\", \"path\": \"/1.1/classes/Counter/" + siteID + "\", \"body\": { \"like\": {\"__op\": \"Increment\", \"amount\": 1} } }, { \"method\": \"PUT\", \"path\": \"/1.1/classes/Counter/" + pageID + "\", \"body\": { \"like\": {\"__op\": \"Increment\", \"amount\": 1} } } ]}"
			}
			break;
		case 'counterUnlike':
			lcpath = `batch`;
			lcoption = {
				method: 'POST',
				headers: lcheader,
				body: "{\"requests\": [ { \"method\": \"PUT\", \"path\": \"/1.1/classes/Counter/" + siteID + "\", \"body\": { \"like\": {\"__op\": \"Increment\", \"amount\": -1} } }, { \"method\": \"PUT\", \"path\": \"/1.1/classes/Counter/" + pageID + "\", \"body\": { \"like\": {\"__op\": \"Increment\", \"amount\": -1} } } ]}"
			}
			break;
		case 'counterNew':
			lcpath = 'classes/Counter';
			lcoption = {
				method: 'POST',
				headers: lcheader,
				body: "{\"url\": \"" + url + "\", \"title\": \"" + title + "\", \"ov\": 1, \"uv\": 1, \"like\": 0}"
			}
			break;
		case 'commentNew':
			break;
		case 'comment':
			//lcpath = `classes/Comment?where={"url":"${object}"}&scan_key=time&keys=-createdAt,-updatedAt,-title`;
			lcpath = `classes/Comment?where={"url":"${object}"}&scan_key=time`;
			lcoption = {
				method: 'GET',
				headers: lcheader
			}
	}
	return fetch(`${lcurl}${lcpath}`, lcoption).then(response => response.json());
}
