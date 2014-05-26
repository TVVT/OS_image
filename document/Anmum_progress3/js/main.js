$(document).ready(function() {
	$('.topnavhandle').click(function() {
		$(this).find('.c3_transition').toggleClass('on');
		$('#navigation').slideToggle();
		$('.overlay').toggle();
	});

	$('#navigation-up').click(function() {
		$('.topnavhandle').click();
	});
	

	


});

$(window).load(function() {
	$('.show_holder').masonry({
	  //columnWidth: 140,
	  gutter: 7,
	  itemSelector: '.single_show'
	});
});

