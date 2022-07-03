// window.onload = function() {

// };

$( document ).ready(function() {
  $('.loader').css({
		opacity : 0,
		visibility: 'hidden'
	});
	
	$('.b-slider-about').slick( {
		dots: true,
		autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: false,
    lazyLoad: 'ondemand'
	});
  
  console.log('hi, slick');
});



