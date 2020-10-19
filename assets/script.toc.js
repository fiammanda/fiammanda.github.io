
let timer = false,
    debounce = function(callback, time) {
    	clearTimeout(timer);
    	timer = setTimeout(callback, time);
    }
$('h2').each(function() {
	let a = $('<a />').text($(this).text()), 
	    h = $(this);
	$(a).appendTo('nav').on('click', function() {
		$('html, body').animate({ scrollTop: h.offset().top }, 250);
		$('nav').removeClass('on');
	});
});
$('<a aria-expanded />').html('<span></span><span></span><span></span>').appendTo('body').on('click', function() {
	$('nav').toggleClass('on');
	if ($('nav').hasClass('on')) {
		$('main').one('click', function() {
			$('nav').removeClass('on');
		});
	}
});
$(document).on('scroll', function() {
	debounce(() => {
		$('h2').each(function(i) {
			if ($(document).scrollTop() + 100 >= $(this).offset().top) {
				$('nav a').removeClass('on').eq(i).addClass('on');
			}
		});
	}, 10);
});
