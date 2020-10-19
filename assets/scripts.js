
let now = new Date(),
    schemeStore = localStorage.getItem('scheme'),
    schemeMatch = window.matchMedia('(prefers-color-scheme: dark)');

if (!sessionStorage.getItem('ip')) {
	$('html').addClass('load');
	sessionStorage.setItem('ip', 'visited');
}

if (schemeStore) {
	$('html').attr('data-scheme', schemeStore);
} else if (schemeMatch.matches || now.getHours() < 8 || now.getHours() > 20) {
	$('html').attr('data-scheme', 'dark');
}
