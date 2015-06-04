// Scroll to top

$(document).ready(function(){

	if ($(window).scrollTop() < 150) {
		$('a.scrollToTop').fadeOut(500);
	}

	$("a.scrollToTop").click(function(){

		$("html, body").animate({scrollTop:0}, '300');

		return false;

	});
})

$(window).scroll(function () {
	if ($(window).scrollTop() >= 150) {
		if (!$('a.scrollToTop').is(':visible')) {
			$('a.scrollToTop').fadeIn(500);
		}
	} else {
		$('a.scrollToTop').fadeOut(500);
	}
});

$(document).ready(function() {
	$(".modal .close").click(function() {
		$(this).parents(".modal-dialog").slideUp("slow" ,function () {
			$(this).parents(".modal").hide();
		});
	});
})
