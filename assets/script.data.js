window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', now);
gtag('config', 'UA-162600333-1');

const url = window.location.pathname,
      title = document.title.split(' |', 1)[0],
      svgLink = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><path d="M30.1,28.9h-1.8c-0.5,0-0.9,0.5-0.9,0.9v6.5H8.9V17.9h8.3c0.5,0,0.9-0.5,0.9-0.9v-1.8c0-0.5-0.5-0.9-0.9-0.9H8c-1.5,0-2.8,1.3-2.8,2.8v20.3C5.2,38.7,6.5,40,8,40l0,0h20.3c1.5,0,2.8-1.3,2.8-2.8l0,0v-7.4C31.1,29.4,30.6,28.9,30.1,28.9z M33.4,10.5H26c-1.3,0-1.8,1.5-1,2.4L27,15L13,28.9c-0.6,0.6-0.6,1.4,0,2l0,0l1.3,1.3c0.6,0.6,1.4,0.6,2,0l0,0l14.2-13.9l2.1,2.1c0.9,0.9,2.3,0.2,2.3-1v-7.4C34.8,11.1,34.2,10.5,33.4,10.5z"/></svg>',
      svgPlus = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><path d="M37.5,17.9H22.1V2.4c0-0.3-0.3-0.5-0.4-0.5h-3.2C18.2,2,18,2.2,18,2.4v15.5H2.4c-0.3,0-0.5,0.3-0.5,0.4v3.2C2,21.8,2.2,22,2.4,22h15.5v15.5c0,0.3,0.2,0.5,0.4,0.5h3.1c0.3,0,0.5-0.2,0.5-0.5V22.1h15.5c0.3,0,0.5-0.2,0.5-0.4v-3.1C38,18.2,37.8,17.9,37.5,17.9z"/></svg>',
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
	leancloud();
} else {
	lc('counter').then(result => {
		counter = {};
		result.results.forEach(item => {
			counter[item.url] = {
				id: item.objectId,
				like: item.like,
				view: item.pv,
			};
		});
		sessionStorage.setItem('counter', JSON.stringify(counter));
		leancloud();
	}).catch(error => console.log('[Failed to retreive database]: ' + error));
}

function leancloud() {
	let page = counter[url];
	if (!page) {
		lc('counterNew').then(result => {
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
				lc('counterUV', page.id).then(function() {
					counter[url].view += 1;
					sessionStorage.setItem('counter', JSON.stringify(counter));
					sessionStorage.setItem(url, '1');
					localStorage.setItem(url, '1');
				}).catch(error => console.log('[Failed to update UV]: ' + error));
			} else {
				lc('counterPV', page.id).then(function() {
					counter[url].view += 1;
					sessionStorage.setItem('counter', JSON.stringify(counter));
					sessionStorage.setItem(url, '1');
				}).catch(error => console.log('[Failed to update PV]: ' + error));
			}
		}
		if (document.body.dataset.layout.indexOf('orks-') > -1) {
			let articles = document.querySelectorAll('article');
			articles.forEach(article => {
				let href = article.firstElementChild.firstChild.pathname,
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
			    ip = sessionStorage.getItem('ip'),
			    ua = localStorage.getItem('ua'),
			    pid = {}, rid = {};
			function Pointer(objectId) {
				this.__type = 'Pointer';
				this.className = 'Comment';
				this.objectId = objectId;
			}
			if (ip == 'visited') {
				ip = returnCitySN.cip;
				sessionStorage.setItem('ip', ip);
			}
			if (!ua) {
				ua = window.navigator.userAgent;
				localStorage.setItem('ua', window.navigator.userAgent);
			}
			const comment = document.querySelector('[itemprop="comment"]'),
			         list =  comment.querySelector('ul');
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
					lc('counterLike', page.id).then(function() {
						counter[url].like += 1;
						sessionStorage.setItem('counter', JSON.stringify(counter));
						localStorage.setItem(url, '2');
						like.addClass('on');
					}).catch(error => console.log('[Failed to update likes]: ' + error));
				} else {
					lc('counterUnlike', page.id).then(function() {
						counter[url].like -= 1;
						sessionStorage.setItem('counter', JSON.stringify(counter));
					}).catch(error => console.log('[Failed to update likes]: ' + error));
					localStorage.setItem(url, '1');
					like.removeClass('on');
				}
			});
			lc('comment', url).then(result => {
				if (result.results.length) {
					result.results.forEach(item => {
						let li = `<li role="listitem" data-oid="${item.objectId}`;
						li += `"><article><footer>`;
						if (item.link == '/') {
							li += `<a class="internal" rel="home" href="/">${item.name}</a>`;
						} else if (item.link) {
							li += `<a target="_blank" rel="noopener noreferrer nofollow" href="${item.link}">${item.name} ${svgLink}</a>`;
						} else {
							li += `${item.name}`;
						}
						li += `<time>${new Date(item.time.iso).toLocaleString('sv-SE')}</time>`;
						if (item.rid) {
							li += `<a data-rid="${item.rid.objectId}">回复 ${result.results.find(x => x.objectId == item.rid.objectId).name}</a>`;
						}
						li += `</footer><div>${item.text}<a aria-label="reply">${svgPlus}</a></div></article><ul role="list"></ul></li>`;
						if (item.rid) {
							$(li).appendTo(`[itemprop="comment"] li[data-oid="${item.pid.objectId}"] > ul`);
						} else {
							$(li).appendTo(list);
						}
					});
				}
			}).catch(error => console.log('[Failed to retreive comments]: ' + error));
			$(comment).on('click', 'a[aria-label="enter"]', function() {
				let submit = {
					'title': title,
					'url': url,
					//'pid': pid,
					//'rid': rid,
					'ip': ip,
					'ua': ua,
					'name': comment.querySelector('input[name="name"]').value,
					'mail': comment.querySelector('input[name="mail"]').value,
					'link': comment.querySelector('input[name="link"]').value,
					'text': convert(comment.querySelector('textarea').value),
					'time': Date.now()
				};
				console.log('"' + JSON.stringify(submit).replace(/"/g, '\\"') + '"');
				lc('commentNew', '"' + JSON.stringify(submit).replace(/"/g, '\\"') + '"');
			}).on('click', 'a[data-rid]', function() {
				let id = this.dataset.rid,
				    reply = comment.querySelector('li[data-oid="' + id + '"]');
				reply.className = 'load';
				setTimeout(function() { reply.removeAttribute('class'); }, 210);
			});
		}
	}
}

function lc(operation, object) {
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
				body: "{\"requests\": [ { \"method\": \"PUT\", \"path\": \"/1.1/classes/Counter/" + siteID + "\", \"body\": { \"pv\": {\"__op\": \"Increment\", \"amount\": 1} } }, { \"method\": \"PUT\", \"path\": \"/1.1/classes/Counter/" + pageID + "\", \"body\": { \"pv\": {\"__op\": \"Increment\", \"amount\": 1} } } ]}"
			}
			break;
		case 'counterUV':
			lcpath = 'batch';
			lcoption = {
				method: 'POST',
				headers: lcheader,
				body: "{\"requests\": [ { \"method\": \"PUT\", \"path\": \"/1.1/classes/Counter/" + siteID + "\", \"body\": { \"pv\": {\"__op\": \"Increment\", \"amount\": 1}, \"uv\": {\"__op\": \"Increment\", \"amount\": 1} } }, { \"method\": \"PUT\", \"path\": \"/1.1/classes/Counter/" + pageID + "\", \"body\": { \"pv\": {\"__op\": \"Increment\", \"amount\": 1}, \"uv\": {\"__op\": \"Increment\", \"amount\": 1} } } ]}"
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
				body: "{\"url\": \"" + url + "\", \"title\": \"" + title + "\", \"pv\": 1, \"uv\": 1, \"like\": 0}"
			}
			break;
		case 'commentNew':
			lcpath = 'classes/Comment';
			lcoption = {
				method: 'POST',
				headers: lcheader,
				body: object
			}
			break;
		case 'comment':
			lcpath = `classes/Comment?where={"url":"${object}"}&scan_key=time&keys=-createdAt,-updatedAt,-title,-ua`;
			lcoption = {
				method: 'GET',
				headers: lcheader
			}
	}
	return fetch(`${lcurl}${lcpath}`, lcoption).then(response => response.json());
}

!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):(e=e||self).snarkdown=n()}(this,function(){var e={"":["<em>","</em>"],_:["<strong>","</strong>"],"*":["<strong>","</strong>"],"~":["<s>","</s>"],"\n":["<br />"]," ":["<br />"],"-":["<hr />"]};function n(e){return e.replace(RegExp("^"+(e.match(/^(\t| )+/)||"")[0],"gm"),"")}function r(e){return(e+"").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}return function t(o,a){var c,s,l,g,u,p=/((?:^|\n+)(?:\n---+|\* \*(?: \*)+)\n)|(?:^``` *(\w*)\n([\s\S]*?)\n```$)|((?:(?:^|\n+)(?:\t|  {2,}).+)+\n*)|((?:(?:^|\n)([>*+-]|\d+\.)\s+.*)+)|(?:!\[([^\]]*?)\]\(([^)]+?)\))|(\[)|(\](?:\(([^)]+?)\))?)|(?:(?:^|\n+)([^\s].*)\n(-{3,}|={3,})(?:\n+|$))|(?:(?:^|\n+)(#{1,6})\s*(.+)(?:\n+|$))|(?:`([^`].*?)`)|(  \n\n*|\n{2,}|__|\*\*|[_*]|~~)/gm,f=[],i="",d=a||{},m=0;function h(n){var r=e[n[1]||""],t=f[f.length-1]==n;return r?r[1]?(t?f.pop():f.push(n),r[0|t]):r[0]:n}function $(){for(var e="";f.length;)e+=h(f[f.length-1]);return e}for(o=o.replace(/^\[(.+?)\]:\s*(.+)$/gm,function(e,n,r){return d[n.toLowerCase()]=r,""}).replace(/^\n+|\n+$/g,"");l=p.exec(o);)s=o.substring(m,l.index),m=p.lastIndex,c=l[0],s.match(/[^\\](\\\\)*\\$/)||((u=l[3]||l[4])?c='<pre class="code '+(l[4]?"poetry":l[2].toLowerCase())+'"><code'+(l[2]?' class="language-'+l[2].toLowerCase()+'"':"")+">"+n(r(u).replace(/^\n+|\n+$/g,""))+"</code></pre>":(u=l[6])?(u.match(/\./)&&(l[5]=l[5].replace(/^\d+/gm,"")),g=t(n(l[5].replace(/^\s*[>*+.-]/gm,""))),">"==u?u="blockquote":(u=u.match(/\./)?"ol":"ul",g=g.replace(/^(.*)(\n|$)/gm,"<li>$1</li>")),c="<"+u+">"+g+"</"+u+">"):l[8]?c='<img src="'+r(l[8])+'" alt="'+r(l[7])+'">':l[10]?(i=i.replace("<a>",'<a href="'+r(l[11]||d[s.toLowerCase()])+'">'),c=$()+"</a>"):l[9]?c="<a>":l[12]||l[14]?c="</p><"+(u="h"+(l[14]?l[14].length:l[13]>"="?1:2))+">"+t(l[12]||l[15],d)+"</"+u+"><p>":l[16]?c="<code>"+r(l[16])+"</code>":(l[17]||l[1])&&(c=h(l[17]||"--"))),i+=s,i+=c;return(i+o.substring(m)+$()).replace(/^\n+|\n+$/g,"")}});
function convert(raw) {
	let str = '<p>' + snarkdown(raw) + '</p>';
	str = str.replace(/<br \/>/g, '</p><p>').replace(/\n/g, '<br />')
		.replace(/<blockquote>((?!<(ol|ul)>).+(?!<\/(ol|ul)>))<\/blockquote>/g, '<blockquote><p>$1</p></blockquote>')
		.replace(/<p>(<(blockquote|ol|ul|pre))/g, '$1').replace(/(<\/(blockquote|ol|ul|pre)>)<\/p>/g, '$1')
		.replace(/<p><\/p>/g, '');
	// str = str.replace(/(<(blockquote|ol|ul|pre|p|h\d)|<\/(blockquote|ol|ul)>)/g, '\n$1');
	return str;
}
