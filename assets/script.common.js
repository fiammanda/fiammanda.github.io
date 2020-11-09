
schemeMatch.addListener(function(e) {
	if (!schemeStore) {
		e.matches ? $('html').attr('data-scheme', 'dark') : $('html').attr('data-scheme', 'light');
	}
});

setTimeout(function() { load() }, 10);

let timer = false,
    debounce = function(callback, time) {
    	clearTimeout(timer);
    	timer = setTimeout(callback, time);
    }

const math = {
	lerp: (a, b, n) => { return (1 - n) * a + n * b }
}

const cursor = $('<div id="cursor" class="hidden" />').appendTo('body');
$(window).one('mousemove.cursor', function() { 
	new Cursor(); 
})

let expandA = document.querySelectorAll('a[data-expand]'),
    expandH = document.querySelector('header[role]'),
    expandN = document.querySelector('main article nav');

$('a.internal').on('click', function(e) {
	e.preventDefault();
	let href = this.href;
	$('body').removeAttr('data-expand').addClass('load');
	setTimeout(function() {
		document.location.href = href;
	}, 250);
});
$(expandA).on('click', function() {
	let menu = this,
	    name = menu.dataset.expand,
	    node = name == 'header' ? expandH : expandN;
	$('body').attr('data-expand', name).on('click.expand', function(e) {
		if (menu !== e.target && !menu.contains(e.target) && node !== e.target && !node.contains(e.target)) {
			$('body').removeAttr('data-expand').off('.expand');
		}
	});
});

$('header[role] .scheme').on('click', function() {
	if (!schemeStore) {
		if ($('html').attr('data-scheme') == 'dark') {
			$('html').attr('data-scheme', 'light');
			localStorage.setItem('scheme', 'light');
		} else {
			$('html').attr('data-scheme', 'dark');
			localStorage.setItem('scheme', 'dark');
		}
	} else if (schemeStore == 'dark') {
		$('html').attr('data-scheme', 'light');
		if (schemeMatch.matches) {
			schemeStore = 'light';
			localStorage.setItem('scheme', 'light');
		} else {
			schemeStore = false;
			localStorage.removeItem('scheme');
		}
	} else if (schemeStore == 'light') {
		$('html').attr('data-scheme', 'dark');
		if (schemeMatch.matches) {
			schemeStore = false;
			localStorage.removeItem('scheme');
		} else {
			schemeStore = 'dark';
			localStorage.setItem('scheme', 'dark');
		}
	}
});

if (document.body.dataset.layout == 'weblog-page') {
	if ($('article nav').length) {
		let posts = $('article ul li');
		$('article nav a').on('click', function() {
			if ($(this).hasClass('current')) {
				$(this).removeAttr('class');
				posts.removeAttr('style');
			} else {
				$(this).addClass('current').siblings().removeAttr('class');
				posts.filter('.' + $(this).text()).removeAttr('style');
				posts.not('.' + $(this).text()).css('max-height', 0);
			}
		});
	}
}

if (document.body.dataset.layout == 'works') {
	if ($('article nav').length) {
		let headings = $('article section h2'),
		    bar = $('article nav [data-present="bar"]');
		tocHighlight(headings, bar);
		$('article nav a').on('click', function() {
			let target = $(headings[$(this).index()]).offset().top;
			$('html, body').animate({ scrollTop: target - 50 }, Math.abs(window.scrollY - target)/25);
		});
		$(window).on('scroll', function() {
			debounce(() => {
				tocHighlight(headings, bar);
			}, 10);
		});
	}
	if ($('.footnotes').length) {
		$('.footnotes').clone().removeAttr('role').insertAfter('.footnotes').find('li[id]').removeAttr('id');
		$('.footnote').on('click', function(e) {
			e.preventDefault();
			$(this).toggleClass('current');
			$('.footnotes + .footnotes li[role]:nth-child(' + $(this).text() + ')').toggleClass('current').siblings().removeClass('current');
		});
		$('.footnotes + .footnotes li[role]').on('click', function() {
			$(this).add('.footnote').removeClass('current');
		});
	}
}

class Cursor {
	constructor() {
		this.pos = {
			curr: null,
			prev: null
		};
		this.init();
		this.render();
	}
	init() {
		$(document).one('mousemove.cursor', e => cursor.css({
			left: e.clientX - 8,
			top: e.clientY - 8
		})).on('mousemove.cursor', e => this.pos.curr = {
			x: e.clientX - 8,
			y: e.clientY - 8
		}).on('mousemove.cursor', function() {
			cursor.removeClass('hidden');
		}).on('mousedown.cursor', function() {
			cursor.addClass('active');
		}).on('mouseup.cursor', function() {
			cursor.removeClass('active');
		}).on('mouseleave.cursor', function() {
			cursor.addClass('hidden');
		}).on('mouseenter.cursor', function() {
			cursor.removeClass('hidden');
		}).on('mouseleave.cursor', 'a, .like, .footnotes + .footnotes li[role]', function() {
			cursor.removeClass('hover');
		}).on('mouseenter.cursor', 'a, .like, .footnotes + .footnotes li[role]', function() {
			cursor.addClass('hover');
		}).one('touchstart', function() { 
			cursor.addClass('hidden');
			$(document).off('.cursor');
		});
	}
	render() {
		if (this.pos.prev) {
			this.pos.prev.x = math.lerp(this.pos.prev.x, this.pos.curr.x, 0.15);
			this.pos.prev.y = math.lerp(this.pos.prev.y, this.pos.curr.y, 0.15);
			cursor.css({
				left: this.pos.prev.x,
				top: this.pos.prev.y
			});
		} else {
			this.pos.prev = this.pos.curr;
		}
		requestAnimationFrame(() => this.render());
	}
}

$(window).on('pageshow', function() {
	load();
});

function load() {
	$('html, body, a[data-expand]').removeAttr('class');
	$('.site-title').removeClass('load');
	if (document.body.dataset.layout == 'home') {
		document.querySelectorAll('#wrap [aria-hidden]').forEach(function(el, i) {
			setTimeout(function() {
				el.setAttribute('aria-hidden', 'false');
			}, 50 * i + 50);
		});
	}
}

function tocHighlight(headings, bar) {
	if (headings[0].getBoundingClientRect().top >= $(window).height()/1.5) {
		bar.removeAttr('class style');
	} else if ($('[data-present="end"]')[0].getBoundingClientRect().bottom <= 200) {
		bar.css('top', headings.length * 1.75 + 'rem').removeAttr('class');
	} else {
		let i = headings.get().reverse().findIndex(function(heading) {
			return heading.getBoundingClientRect().top < $(window).height()/2;
		});
		i = i < 0 ? 0 : headings.length - i - 1;
		bar.css('top', i * 1.75 + 'rem').addClass('current');
	}
}
