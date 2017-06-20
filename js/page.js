// function to find whether an element is within the viewport or not
function isElementInViewport (el) {
    //special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }
    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}

// Function by David Walsh (may glod bless you bro)
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

// getting original button position values

var updateModalPosition = debounce(function(){
	var $effect_button = $("button.effect");
	if(isElementInViewport($effect_button)){

		var $modal = $(".modal");
		var effect_button_x = $effect_button[0].getBoundingClientRect().left;
		var effect_button_y = $effect_button[0].getBoundingClientRect().top;
		var effect_button_width = $effect_button.outerWidth();
		var effect_button_height = $effect_button.outerHeight();
		$modal.css({
				"top": effect_button_y,
				"left": effect_button_x,
				"width": effect_button_width,
				"height": effect_button_height
		});
	}
},100,false);

	// Function from David Walsh: http://davidwalsh.name/css-animation-callback
	// May god bless him for this function :-)
	whichTransitionEvent = function(){
		var t,
			el = document.createElement("fakeelement");
		var transitions = {
			"transition"      : "transitionend",
			"OTransition"     : "oTransitionEnd",
			"MozTransition"   : "transitionend",
			"WebkitTransition": "webkitTransitionEnd"
		};

		for (t in transitions){
			if (el.style[t] !== undefined){
			return transitions[t];
			}
		}	};
	transitionEvent = whichTransitionEvent();

// scroll the page to trigger the line animation
var section1_animation_lock = false;
var section1_hub = $(".section1 h3");
var line_animation_duration = 1000;
var check_for_animation = debounce(function(){
	if(section1_animation_lock === false){
		if(isElementInViewport(section1_hub)){
	
			$("path",".section1").addClass("line-animation");
			setTimeout(function(){
				$(".section1").removeClass("initial-state-styles");
				$("path.drawline",".section1").hide(450);
			},line_animation_duration);
			section1_animation_lock = true;
		}
	}
},100,true);

$(window).scroll(function(){
	updateModalPosition();
	check_for_animation();
});


$("button.effect").on("click",function(){
	var $modal = $(".modal");
	$(this).addClass("rotate");
	setTimeout(function(){
		$modal.find(".modal-container").removeClass("hide");
		$modal.addClass("overlay");
	},300);
});


function closeModal(){ 
	var $modal = $(".modal");
	$modal.removeClass("overlay");
	setTimeout(function(){
			$("button.effect").removeClass("rotate");
			setTimeout(function(){
				$modal.find(".modal-container").removeClass("hide");
			},300);
	},600);
}

$(".modal a").on("click",function(event){
	event.preventDefault();
	if($(this).text()==="Close"){
		closeModal();
	}
	else{
		var given_effect = $(this).data("effect-name");
		console.log(given_effect);
		$("a",".jslider").off();
		$(".j_dots").off();
		$("#jslider1").jslider({
			effect : given_effect
		});
		$("#jslider2").jslider({
			effect : given_effect
		});
		$("#jslider3").jslider({
			effect : given_effect,
			width: 1000,
			height: 650,
			duration : 1000	
		});
		closeModal();
	}
});

// Script for dynamically calculatiing the path length for the drawing animation
var path = $('path.drawline');
path.each(function(index,element){
	var length = element.getTotalLength();
	element.style.cssText = "display:block;stroke-dashoffset:"+length+";stroke-dasharray:"+length+";";
});

var leftArrowAnimation = debounce(function(arrow_paths){
	arrow_paths[0].style.cssText = " display:block; stroke-dashoffset: 0; stroke-dasharray: " + arrow_paths[0].getTotalLength()+";";
	arrow_paths[1].style.cssText = " display:block; stroke-dashoffset: " + arrow_paths[1].getTotalLength()  + " ;stroke-dasharray: " + arrow_paths[1].getTotalLength()+";";
}, 300, true);

var rightArrowAnimation = debounce(function(arrow_paths){
	arrow_paths[0].style.cssText = " display:block; stroke-dashoffset: " + arrow_paths[0].getTotalLength()  + " ;stroke-dasharray: " + arrow_paths[0].getTotalLength()+";";
	arrow_paths[1].style.cssText = " display:block; stroke-dashoffset: 0; stroke-dasharray: " + arrow_paths[1].getTotalLength()+";";
}, 300, true);

// mouse-over line animation
var arrowAnimationSwitch;
var arrow_paths;
$(".jslider").hover(function(){
	var slider_width = $(this).width();
	var slider_x_position = $(this).offset().left;
	arrow_paths = $("path.drawline",this);
	$(this).mousemove(function(event){
		var mouse_position_inside_slider = event.pageX - slider_x_position;
		if(mouse_position_inside_slider < slider_width / 2){
			leftArrowAnimation(arrow_paths);
			arrowAnimationSwitch = 'left';
		}
		else{
			rightArrowAnimation(arrow_paths);
			arrowAnimationSwitch = 'right';
		}
	});
}, function(){
	switch(arrowAnimationSwitch){
		case 'left':
			arrow_paths[0].style.cssText = " display:block; stroke-dashoffset: " + arrow_paths[0].getTotalLength()  + " ;stroke-dasharray: " + arrow_paths[0].getTotalLength()+";";
		break;
		case 'right':
			arrow_paths[1].style.cssText = " display:block; stroke-dashoffset: " + arrow_paths[1].getTotalLength()  + " ;stroke-dasharray: " + arrow_paths[1].getTotalLength()+";";
		break;
	}
});