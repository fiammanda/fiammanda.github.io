
if (window.location.protocol == 'http:' && window.location.port == 80) {
	location.replace(window.location.href.replace('http:', 'https:'));
}

let now = new Date(),
    schemeStore = localStorage.getItem('scheme'),
    schemeMatch = window.matchMedia('(prefers-color-scheme: dark)');

if (!sessionStorage.getItem('counter')) {
	$('html').addClass('load');
}

if (schemeStore) {
	$('html').attr('data-scheme', schemeStore);
} else if (schemeMatch.matches || now.getHours() < 8 || now.getHours() > 20) {
	$('html').attr('data-scheme', 'dark');
}
