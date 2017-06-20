var sliderClass = function(context,options){
	var $slider = $(context);	
	var $slider_items = $slider.find(".jslider-item");
	var $slider_items_count = $slider_items.length;
		// Main settings
	var slider_indexes = {
		current_index: 0,
		prev_index: $slider_items_count-1,
		next_index: 1,
	};
	var settings = $.extend({},$.fn.jslider.defaults,options,slider_indexes);	
	// console.log(settings);
	$slider.outerHeight(settings.height);
	$slider.css("max-width",settings.width);

	// code for updating height when there is a change in height due to some form of resizing...
	var slider_height = $slider.outerHeight();
	var slider_width = $slider.outerWidth();
	if(slider_width <= settings.width){
			aspectRatio_offset = slider_width / settings.width;
	}
	else{
			aspectRatio_offset = 1;
	}
	new_height = (aspectRatio_offset * settings.height);
	$slider.outerHeight(new_height);
		
	// Functions

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
		}
	};
	transitionEvent = whichTransitionEvent();
	
	// j_slider controls setup creating
	$(".jslider_controls", $slider).remove();
	var j_controls_html = '<div class="jslider_controls">';
	$slider_items.each(function(index){
		if(index === 0){
			j_controls_html+='<div class="j_dots active" data-j_index='+index+'></div>';
		}
		else{
			j_controls_html+='<div class="j_dots" data-j_index='+index+'></div>';
		}	
	});
	j_controls_html+='</div>';
	$slider.append(j_controls_html);
	
	$(".j_dots",$slider).on("click",function(event){
		if($(this).hasClass("active")){
			return;
		}
		console.log(event.currentTarget);
		// settings.old_index = $(".jslider-item",$slider).index('.current');     == 2
		// settings.old_index = $slider.find(".jslider-item").index('.current');  == 2
		settings.old_index = $(".current",$slider).index();
		console.log(settings);
		debugger;
		remove_old_navigation_classes(settings,$slider_items);
		settings.current_index = parseInt($(this).data("j_index"));
		settings.prev_index = (settings.current_index + $slider_items_count - 1) % $slider_items_count;
		settings.next_index = (settings.current_index + 1) % $slider_items_count;
		settings.direction = "controls";
		// console.log(settings);
		run_animation(settings,$slider_items);
	});

	apply_new_navigation_classes = function(settings,$slider_items){
		var $slider = $slider_items.parent();
		$slider_items.eq(settings.current_index).addClass("current");
		$slider_items.eq(settings.prev_index).addClass("prev");
		$slider_items.eq(settings.next_index).addClass("next");
		$(".j_dots",$slider).eq(settings.current_index).addClass("active");			
	};
	remove_old_navigation_classes = function(settings,$slider_items){
		var $slider = $slider_items.parent();
		$slider_items.eq(settings.current_index).removeClass("current");
		$slider_items.eq(settings.prev_index).removeClass("prev");
		$slider_items.eq(settings.next_index).removeClass("next");
		$(".j_dots",$slider).filter(".active").removeClass("active");
	};

	var run_animation = function(settings,$slider_items){
		if(!settings.animating_state){ // Run animation only when animating_State is false
			// animationEffects[settings.effect](settings); //window[settings.effect](settings.duration);
			$.fn.jslider.animationEffects[settings.effect](settings,$slider_items);
		}		
		else
			console.log("already animation is running");
	}; 

		update_index_for_next = function(settings,$slider_items){
		var $slider_items_count = $slider_items.length;
		// console.log($slider_items_count);
		settings.current_index = (settings.current_index + 1) % $slider_items_count;
		settings.prev_index = (settings.prev_index + 1) % $slider_items_count;
		settings.next_index = (settings.next_index + 1) % $slider_items_count;
	};

		update_index_for_prev = function(settings,$slider_items){
		var $slider_items_count = $slider_items.length;
		// console.log($slider_items_count);
		settings.current_index = (settings.current_index + $slider_items_count - 1) % $slider_items_count;
		settings.prev_index = (settings.prev_index + $slider_items_count - 1) % $slider_items_count;
		settings.next_index = (settings.next_index + $slider_items_count - 1) % $slider_items_count;
	};

	show_current_item_only = function(settings,$slider_items){
		$slider_items.eq(settings.current_index).show();
		$slider_items.eq(settings.prev_index).hide();
		$slider_items.eq(settings.next_index).hide();
	};

	var prev = function(settings,$slider_items){
		if(!settings.animating_state)
		{
			remove_old_navigation_classes(settings,$slider_items);
			settings.direction ="prev";
			run_animation(settings,$slider_items);
		}					
	};
	
	var next = function(settings,$slider_items){
		if(!settings.animating_state)
		{
			remove_old_navigation_classes(settings,$slider_items);	
			settings.direction ="next";				
			run_animation(settings,$slider_items);
		}				
	};

	remove_old_navigation_classes(settings,$slider_items);
	apply_new_navigation_classes(settings,$slider_items);

	$slider_items.each(function(index){
		if( index == settings.current_index){
			$(this).show();
		}
		else{
			$(this).hide();
		}
	});

	// Arrow Controls
	$("a.arrow-left", $slider).on("click",function(event){
		event.preventDefault();
		prev(settings,$slider_items);
	});
	$("a.arrow-right", $slider).on("click",function(event){
		event.preventDefault();		
		next(settings,$slider_items);
	});

	$(window).resize(function(){
		var slider_height = $slider.outerHeight();
		var slider_width = $slider.outerWidth();
		if(slider_width <= settings.width){
				aspectRatio_offset = slider_width / settings.width;
		}
		else{
				aspectRatio_offset = 1;
		}
		new_height = (aspectRatio_offset * settings.height);
		$slider.outerHeight(new_height);
	});
	
	// Pausing the slideshow when the user moves cursor inside the slider
	$slider.on({
		mouseenter : function(){
			if(settings.automatic){
				clearInterval(settings.automatic_ID);						
			}
		},
		mouseleave : function(){
			if(settings.automatic){
				settings.automatic_ID = setInterval(function(){
					next();
				},5000);
			}
		}
	},".current");
};

$.fn.jslider = function(options){
	return this.each(function(index,element){
		 sliderClass(element,options);
	});	
};

$.fn.jslider.defaults = {
			animating_state : false,
			automatic : false,
			effect : "fade",
			direction : "",
			duration : 500,
			responsive: false,
			width: 600,
			height: 450,
			offset: 10
};

$.fn.jslider.animationEffects = {
			fade: function(settings,$slider_items){
				settings.animating_state = true;
				if(settings.direction =="prev"){
					update_index_for_prev(settings,$slider_items);	
				}
				if(settings.direction == "next"){
					update_index_for_next(settings,$slider_items);
				}
				apply_new_navigation_classes(settings,$slider_items);
				$slider_items.eq(settings.prev_index).hide();
				$slider_items.eq(settings.next_index).hide();
				$slider_items.eq(settings.current_index).fadeIn(settings.duration,function(){
					settings.animating_state = false;
				});
			},
			book_open : function(settings,$slider_items){
				$slider =  $slider_items.parent();
				var slider_height = $slider.outerHeight();
				var slider_width = $slider.outerWidth();
				settings.animating_state = true;
				var effect_name = settings.effect+"-";
				var $prev_item = $slider_items.eq(settings.prev_index);
				var $current_item = $slider_items.eq(settings.current_index);
				var $next_item = $slider_items.eq(settings.next_index);
				var part_width = slider_width/2;
				var part_height = slider_height;
				var new_item_parts_array = [];
				var org_item_parts_array = [];
				for (var i = 0; i < 2; i++) {
					var temp = {};
					temp.x = i * part_width;
					temp.y = 0 * part_height;
					org_item_parts_array.push(temp);
					new_item_parts_array.push(temp);
				}

				if(settings.direction == 'next'){
					// use current and next
					$original_item = $current_item;
					$new_item =  $next_item;
					console.log($original_item);
					console.log($new_item);
				}
				if(settings.direction == "prev"){
					// use current and prev
					$original_item = $current_item;
					$new_item =  $prev_item;
				}

				if(settings.direction == "controls"){
					$original_item = $slider_items.eq(settings.old_index);
					$new_item = $slider_items.eq(settings.current_index);	
					console.log($original_item);
					console.log($new_item);
				}

				var img_src = $original_item.find("img").attr('src');			
				var img_src_new = $new_item.find("img").attr('src');
				new_item_parts_array.forEach(function(current_value,index){
					var part = document.createElement("div");
					part.className = effect_name+"new-part ";
					part.className += "new-part-no-"+index;
					part.style.cssText = "background:url('"+img_src_new+"'); top:"+current_value.y+"px; left:"+current_value.x+"px;";
					part.style.backgroundPosition = current_value.x+"px "+current_value.y+"px";
					part.style.backgroundSize = slider_width+"px "+slider_height+"px";
					part.style.width = part_width+"px";
					part.style.height = part_height+"px";
					// default css styles for animation
					if(index === 0){
						// for sheet1
						part.classList.add(effect_name+"new-part-page1-ani-before");
						part.classList.add("border-tl");
						part.classList.add("border-bl");
					}
					else{
						// for sheet2
						part.classList.add(effect_name+"new-part-page2-ani-before");
						part.classList.add("border-tr");
						part.classList.add("border-br");
					}
					$original_item.append(part);
				});	

				// Fix for transition to work here using setTimeout function
				setTimeout(function(){
					$(".new-part-no-0",$slider).addClass(effect_name+"new-part-page1-ani-after");		
					$(".new-part-no-1",$slider).addClass(effect_name+"new-part-page2-ani-after");
					console.log("doing animation");
					var count = 0;
					 console.log($original_item);
					 		// debugger;
					$original_item.one(transitionEvent,function(e){
						++count;
						$(this).empty();
						$(this).append("<img src='"+img_src+"' alt='' />");
						console.log("animation over"+count);
						settings.animating_state = false;
						if(settings.direction == "prev"){
							update_index_for_prev(settings,$slider_items);
							show_current_item_only(settings,$slider_items);
							apply_new_navigation_classes(settings,$slider_items);
						}
						if(settings.direction == "next"){
							update_index_for_next(settings,$slider_items);
							show_current_item_only(settings,$slider_items);
							apply_new_navigation_classes(settings,$slider_items);
						}
						if(settings.direction == "controls"){
							show_current_item_only(settings,$slider_items);
							apply_new_navigation_classes(settings,$slider_items);
						}	
					});
				},300);

			},
			book_close : function(settings,$slider_items){
				$slider =  $slider_items.parent();
				var slider_height = $slider.outerHeight();
				var slider_width = $slider.outerWidth();
				settings.animating_state = true;
				var effect_name = settings.effect+"-";
				var $prev_item = $slider_items.eq(settings.prev_index);
				var $current_item = $slider_items.eq(settings.current_index);
				var $next_item = $slider_items.eq(settings.next_index);
				var part_width = slider_width/2;
				var part_height = slider_height;
				var new_item_parts_array = [];
				var org_item_parts_array = [];
				for (var i = 0; i < 2; i++) {
					var temp = {};
					temp.x = i * part_width;
					temp.y = 0 * part_height;
					org_item_parts_array.push(temp);
					new_item_parts_array.push(temp);
				}

				if(settings.direction == 'next'){
					// use current and next
					$original_item = $current_item;
					$new_item =  $next_item;
				}
				if(settings.direction == "prev"){
					// use current and prev
					$original_item = $current_item;
					$new_item =  $prev_item;
				}

				if(settings.direction == "controls"){
					$original_item = $slider_items.eq(settings.old_index);
					$new_item = $slider_items.eq(settings.current_index);		
				}

				var img_src = $original_item.find("img").attr('src');
				var img_src_new = $new_item.find("img").attr('src');			
				$original_item.empty();
				$original_item.append("<img src='"+img_src_new+"' alt='' />");

				org_item_parts_array.forEach(function(current_value,index){
					var part = document.createElement("div");
					part.className = effect_name+"old-part ";
					part.className += "old-part-no-"+index;
					if(index == 0){
						// for sheet1
						part.classList.add("border-tl");
						part.classList.add("border-bl");
					}
					else{
						// for sheet2
						part.classList.add("border-tr");
						part.classList.add("border-br");
					}
					part.style.cssText = "background:url('"+img_src+"'); top:"+current_value.y+"px; left:"+current_value.x+"px;";
					part.style.backgroundPosition = current_value.x+"px "+current_value.y+"px";
					part.style.backgroundSize = slider_width+"px "+slider_height+"px"; 
					part.style.width = part_width+"px";
					part.style.height = part_height+"px";
					$original_item.append(part);
				});
				
				// Fix for transition to work here using setTimeout function
				setTimeout(function(){
					//debugger;
					$(".old-part-no-0",$slider).addClass(effect_name+"old-part-page1-ani-after");		
					$(".old-part-no-1",$slider).addClass(effect_name+"old-part-page2-ani-after");
					console.log("doing animation");
					// debugger;
					var count = 0;
					$original_item.one(transitionEvent,function(e){
						++count;
							$(this).empty();
							$(this).append("<img src='"+img_src+"' alt='' />");
							$new_item.empty();
							$new_item.append("<img src='"+img_src_new+"' alt='' />");
							console.log("animation over"+count);
							settings.animating_state = false;
							if(settings.direction =="prev"){
								update_index_for_prev(settings,$slider_items);
								show_current_item_only(settings,$slider_items);
								apply_new_navigation_classes(settings,$slider_items);
							}
							if(settings.direction =="next"){
								update_index_for_next(settings,$slider_items);
								show_current_item_only(settings,$slider_items);
								apply_new_navigation_classes(settings,$slider_items);
							}
							if(settings.direction == "controls"){
								show_current_item_only(settings,$slider_items);
								apply_new_navigation_classes(settings,$slider_items);
							}
					});

				},300);

			},
			book_turn : function(settings,$slider_items){
				$slider =  $slider_items.parent();
				var slider_height = $slider.outerHeight();
				var slider_width = $slider.outerWidth();
				settings.animating_state = true;
				var effect_name = settings.effect+"-";
				var $prev_item = $slider_items.eq(settings.prev_index);
				var $current_item = $slider_items.eq(settings.current_index);
				var $next_item = $slider_items.eq(settings.next_index);
				var part_width = slider_width/2;
				var part_height = slider_height;
				var new_item_parts_array = [];
				var org_item_parts_array = [];
				for (var i = 0; i < 2; i++) {
					var temp = {};
					temp.x = i * part_width;
					temp.y = 0 * part_height;
					org_item_parts_array.push(temp);
					new_item_parts_array.push(temp);
				}

				if(settings.direction == 'next'){
					// use current and next
					$original_item = $current_item;
					$new_item =  $next_item;
				}
				if(settings.direction == "prev"){
					// use current and prev
					$original_item = $current_item;
					$new_item =  $prev_item;
				}
				
				if(settings.direction == "controls"){
					$original_item = $slider_items.eq(settings.old_index);
					$new_item = $slider_items.eq(settings.current_index);		
				}

				var img_src = $original_item.find("img").attr('src');			
				$original_item.empty();

				org_item_parts_array.forEach(function(current_value,index){
					var part = document.createElement("div");
					part.className = effect_name+"old-part ";
					part.className += "old-part-no-"+index;
					if(index == 0){
						// for sheet1
						part.classList.add("border-tl");
						part.classList.add("border-bl");
					}
					else{
						// for sheet2
						part.classList.add("border-tr");
						part.classList.add("border-br");
					}
					part.style.cssText = "background:url('"+img_src+"'); top:"+current_value.y+"px; left:"+current_value.x+"px;";
					part.style.backgroundPosition = current_value.x+"px "+current_value.y+"px";
					part.style.backgroundSize = slider_width+"px "+slider_height+"px";
					part.style.width = part_width+"px";
					part.style.height = part_height+"px";
					$original_item.append(part);
				});
				// debugger;
				var img_src_new = $new_item.find("img").attr('src');
				new_item_parts_array.forEach(function(current_value,index){
					var part = document.createElement("div");
					part.className = effect_name+"new-part ";
					part.className += "new-part-no-"+index;
					part.style.cssText = "background:url('"+img_src_new+"'); top:"+current_value.y+"px; left:"+current_value.x+"px;";
					part.style.backgroundPosition = current_value.x+"px "+current_value.y+"px";
					part.style.backgroundSize = slider_width+"px "+slider_height+"px"; 
					part.style.width = part_width+"px";
					part.style.height = part_height+"px";
					// default css styles for animation
					if(index === 0){
						// for sheet1
						part.classList.add(effect_name+"new-part-page1-ani-before");
						part.classList.add("border-tl");
						part.classList.add("border-bl");
					}
					else{
						// for sheet2
						part.classList.add(effect_name+"new-part-page2-ani-before");
						part.classList.add("border-tr");
						part.classList.add("border-br");
					}
					$original_item.append(part);
				});	

				// Fix for transition to work here using setTimeout function
				setTimeout(function(){
					//debugger;
					$(".old-part-no-0",$slider).addClass(effect_name+"old-part-page1-ani-after");		
					$(".old-part-no-1",$slider).addClass(effect_name+"old-part-page2-ani-after");
					$(".new-part-no-0",$slider).addClass(effect_name+"new-part-page1-ani-after");		
					$(".new-part-no-1",$slider).addClass(effect_name+"new-part-page2-ani-after");
					console.log("doing animation");
					// debugger;
					var count = 0;
					$original_item.one(transitionEvent,function(e){
						++count;
							$(this).empty();
							$(this).append("<img src='"+img_src+"' alt='' />");
							settings.animating_state = false;
							if(settings.direction =="prev"){
								update_index_for_prev(settings,$slider_items);
								show_current_item_only(settings,$slider_items);
								apply_new_navigation_classes(settings,$slider_items);
							}
							if(settings.direction =="next"){
								update_index_for_next(settings,$slider_items);
								show_current_item_only(settings,$slider_items);
								apply_new_navigation_classes(settings,$slider_items);
							}
							if(settings.direction == "controls"){
								show_current_item_only(settings,$slider_items);
								apply_new_navigation_classes(settings,$slider_items);
							}	
					});

				},300);

			},
			split : function(settings,$slider_items){
				$slider =  $slider_items.parent();
				var slider_height = $slider.outerHeight();
				var slider_width = $slider.outerWidth();
				$split_offset = 50;
				console.log("entering split");
				settings.animating_state = true;
				var effect_name = settings.effect+"-";
				var $prev_item = $slider_items.eq(settings.prev_index);
				var $current_item = $slider_items.eq(settings.current_index);
				var $next_item = $slider_items.eq(settings.next_index);
				var part_width = slider_width/2;
				var part_height = slider_height/2;
				var org_item_parts_object= {};
				var get_new_positions = function(passed_object){
					Object.keys(passed_object).forEach(function(key,index){
						switch(passed_object[key].matrix_code){
							case "11":
								passed_object[key].x_target = passed_object[key].x - $split_offset;
								passed_object[key].y_target = passed_object[key].y - $split_offset;
								break;
							case "12":
								passed_object[key].x_target = passed_object[key].x + $split_offset;
								passed_object[key].y_target = passed_object[key].y - $split_offset;							
								break;
							case "21":
								passed_object[key].x_target = passed_object[key].x - $split_offset;
								passed_object[key].y_target = passed_object[key].y + $split_offset;							
								break;
							case "22":
								passed_object[key].x_target = passed_object[key].x + $split_offset;
								passed_object[key].y_target = passed_object[key].y + $split_offset;							
								break;			
						}
					});
				};	
				for (var i = 0; i < 2; i++) {
					for (var j = 0; j < 2; j++){
						var temp = {};
						// Setting the starting position of each parts
						temp.y = i * part_height;
						temp.x = j * part_width;
				
						// insert matrix_indexing 
						temp.matrix_code = (i+1)+""+(j+1);
						var matrix_code = temp.matrix_code;
						org_item_parts_object[matrix_code] = temp;
					}
				}
				get_new_positions(org_item_parts_object);
				if(settings.direction == 'next'){
					// use current and next
					$original_item = $current_item;
					$new_item =  $next_item;
				}
				if(settings.direction == "prev"){
					// use current and prev
					$original_item = $current_item;
					$new_item =  $prev_item;
				}

				if(settings.direction == "controls"){
					$original_item = $slider_items.eq(settings.old_index);
					$new_item = $slider_items.eq(settings.current_index);		
				}
				var img_src = $original_item.find("img").attr('src');
				var img_src_new = $new_item.find("img").attr('src');			
				$original_item.empty();
				$original_item.append("<img src='"+img_src_new+"' alt='' />");
				Object.keys(org_item_parts_object).forEach(function(current_key,index){
					var part = document.createElement("div");
					part.className = effect_name+"old-part"; 
					switch(index){
						case 0:
							part.classList.add("border-tl");
							break;
						case 1:
							part.classList.add("border-tr");
							break;
						case 2:
							part.classList.add("border-bl");
							break;
						case 3:
							part.classList.add("border-br");
							break;
					}
					part.style.cssText = "background:url('"+img_src+"'); top:"+org_item_parts_object[current_key].y+"px; left:"+org_item_parts_object[current_key].x+"px;";
					part.style.backgroundPosition = org_item_parts_object[current_key].x+"px "+org_item_parts_object[current_key].y+"px";
					part.style.backgroundSize = slider_width+"px "+slider_height+"px"; 
					part.style.width = part_width+"px";
					part.style.height = part_height+"px";
					part.id = "j-"+org_item_parts_object[current_key].matrix_code;
					//console.dir(part);
					$original_item.append(part);
				});

				Object.keys(org_item_parts_object).forEach(function(key,index){
					$("#j-"+org_item_parts_object[key].matrix_code).animate({
						top: org_item_parts_object[key].y_target,
						left: org_item_parts_object[key].x_target,
						opacity: 0
					},settings.duration,function(){
						if (index == (Object.keys(org_item_parts_object).length - 1)){
							console.log("final end");
							$original_item.empty();
							$original_item.append("<img src='"+img_src+"' alt='' />");
							settings.animating_state = false;
							if(settings.direction =="prev"){
								update_index_for_prev(settings,$slider_items);
								show_current_item_only(settings,$slider_items);
								apply_new_navigation_classes(settings,$slider_items);
							}
							if(settings.direction =="next"){
								update_index_for_next(settings,$slider_items);
								show_current_item_only(settings,$slider_items);
								apply_new_navigation_classes(settings,$slider_items);
							}
							if(settings.direction == "controls"){
								show_current_item_only(settings,$slider_items);
								apply_new_navigation_classes(settings,$slider_items);
							}
						}
					});
				});
			},
			split_fold : function(settings,$slider_items){
				$slider =  $slider_items.parent();
				var slider_height = $slider.outerHeight();
				var slider_width = $slider.outerWidth();
				console.log("entering split");
				settings.animating_state = true;
				var effect_name = settings.effect+"-";
				var $prev_item = $slider_items.eq(settings.prev_index);
				var $current_item = $slider_items.eq(settings.current_index);
				var $next_item = $slider_items.eq(settings.next_index);
				var part_width = slider_width/2;
				var part_height = slider_height/2;
				var org_item_parts_object= {};

					for (var i = 0; i < 2; i++) {
						for (var j = 0; j < 2; j++){
							var temp = {};
							// Setting the starting position of each parts
							temp.y = i * part_height;
							temp.x = j * part_width;
					
							// insert matrix_indexing 
							temp.matrix_code = (i+1)+""+(j+1);
							var matrix_code = temp.matrix_code;
							org_item_parts_object[matrix_code] = temp;
						}
					}
				if(settings.direction == 'next'){
					// use current and next
					$original_item = $current_item;
					$new_item =  $next_item;
				}
				if(settings.direction == "prev"){
					// use current and prev
					$original_item = $current_item;
					$new_item =  $prev_item;
				}
				
				if(settings.direction == "controls"){
					$original_item = $slider_items.eq(settings.old_index);
					$new_item = $slider_items.eq(settings.current_index);		
				}

				var img_src = $original_item.find("img").attr('src');
				var img_src_new = $new_item.find("img").attr('src');

				$original_item.empty();
				$original_item.append("<img src='"+img_src_new+"' alt='' />");
				//console.log(org_item_parts_object);
				Object.keys(org_item_parts_object).forEach(function(current_key,index){
					var part = document.createElement("div");
					part.className = effect_name+"old-part";
					switch(index){
						case 0:
							part.classList.add("border-tl");
							break;
						case 1:
							part.classList.add("border-tr");
							break;
						case 2:
							part.classList.add("border-bl");
							break;
						case 3:
							part.classList.add("border-br");
							break;
					}
					part.style.cssText = "background:url('"+img_src+"'); top:"+org_item_parts_object[current_key].y+"px; left:"+org_item_parts_object[current_key].x+"px;";
					part.style.backgroundPosition = org_item_parts_object[current_key].x+"px "+org_item_parts_object[current_key].y+"px";
					part.style.backgroundSize = slider_width+"px "+slider_height+"px"; 
					part.style.width = part_width+"px";
					part.style.height = part_height+"px";
					part.id = "j-"+org_item_parts_object[current_key].matrix_code;
					//console.dir(part);
					$original_item.append(part);
				});

				setTimeout(function() {
					Object.keys(org_item_parts_object).forEach(function(current_key,index){
						$("#j-"+org_item_parts_object[current_key].matrix_code).addClass(effect_name+"old-part-"+org_item_parts_object[current_key].matrix_code+"-ani-after");
					});
					$original_item.one(transitionEvent,function(e){
						console.log("final end");
							$original_item.empty();
							$original_item.append("<img src='"+img_src+"' alt='' />");
							settings.animating_state = false;
							if(settings.direction =="prev"){
								update_index_for_prev(settings,$slider_items);
								show_current_item_only(settings,$slider_items);
								apply_new_navigation_classes(settings,$slider_items);
							}
							if(settings.direction =="next"){
								update_index_for_next(settings,$slider_items);
								show_current_item_only(settings,$slider_items);
								apply_new_navigation_classes(settings,$slider_items);
							}
							if(settings.direction == "controls"){
								show_current_item_only(settings,$slider_items);
								apply_new_navigation_classes(settings,$slider_items);
							}
					});
				}, 300);
			},
			split_fold_outward : function(settings,$slider_items){
				$slider =  $slider_items.parent();
				var slider_height = $slider.outerHeight();
				var slider_width = $slider.outerWidth();
				console.log("entering split");
				settings.animating_state = true;
				var effect_name = settings.effect+"-";
				var $prev_item = $slider_items.eq(settings.prev_index);
				var $current_item = $slider_items.eq(settings.current_index);
				var $next_item = $slider_items.eq(settings.next_index);
				var part_width = slider_width/2;
				var part_height = slider_height/2;
				var org_item_parts_object= {};

					for (var i = 0; i < 2; i++) {
						for (var j = 0; j < 2; j++){
							var temp = {};
							// Setting the starting position of each parts
							temp.y = i * part_height;
							temp.x = j * part_width;
					
							// insert matrix_indexing 
							temp.matrix_code = (i+1)+""+(j+1);
							var matrix_code = temp.matrix_code;
							org_item_parts_object[matrix_code] = temp;
						}
					}
				if(settings.direction == 'next'){
					// use current and next
					$original_item = $current_item;
					$new_item =  $next_item;
				}
				if(settings.direction == "prev"){
					// use current and prev
					$original_item = $current_item;
					$new_item =  $prev_item;
				}
				if(settings.direction == "controls"){
					$original_item = $slider_items.eq(settings.old_index);
					$new_item = $slider_items.eq(settings.current_index);		
				}

				var img_src = $original_item.find("img").attr('src');
				var img_src_new = $new_item.find("img").attr('src');

				$original_item.empty();
				$original_item.append("<img src='"+img_src_new+"' alt='' />");
				//console.log(org_item_parts_object);
				Object.keys(org_item_parts_object).forEach(function(current_key,index){
					var part = document.createElement("div");
					part.className = effect_name+"old-part";
					switch(index){
						case 0:
							part.classList.add("border-tl");
							break;
						case 1:
							part.classList.add("border-tr");
							break;
						case 2:
							part.classList.add("border-bl");
							break;
						case 3:
							part.classList.add("border-br");
							break;
					}
					part.style.cssText = "background:url('"+img_src+"'); top:"+org_item_parts_object[current_key].y+"px; left:"+org_item_parts_object[current_key].x+"px;";
					part.style.backgroundPosition = org_item_parts_object[current_key].x+"px "+org_item_parts_object[current_key].y+"px";
					part.style.backgroundSize = slider_width+"px "+slider_height+"px"; 
					part.style.width = part_width+"px";
					part.style.height = part_height+"px";
					part.id = "j-"+org_item_parts_object[current_key].matrix_code;
					//console.dir(part);
					$original_item.append(part);
				});

				setTimeout(function() {
					Object.keys(org_item_parts_object).forEach(function(current_key,index){
						$("#j-"+org_item_parts_object[current_key].matrix_code).addClass(effect_name+"old-part-"+org_item_parts_object[current_key].matrix_code+"-ani-after");
					});
					$original_item.one(transitionEvent,function(e){
						console.log("final end");
							$original_item.empty();
							$original_item.append("<img src='"+img_src+"' alt='' />");
							settings.animating_state = false;
							if(settings.direction =="prev"){
								update_index_for_prev(settings,$slider_items);
								show_current_item_only(settings,$slider_items);
								apply_new_navigation_classes(settings,$slider_items);
							}
							if(settings.direction =="next"){
								update_index_for_next(settings,$slider_items);
								show_current_item_only(settings,$slider_items);
								apply_new_navigation_classes(settings,$slider_items);
							}
							if(settings.direction == "controls"){
								show_current_item_only(settings,$slider_items);
								apply_new_navigation_classes(settings,$slider_items);
							}
					});
				}, 300);
			},
			split_fold_scale : function(settings,$slider_items){
				$slider =  $slider_items.parent();
				var slider_height = $slider.outerHeight();
				var slider_width = $slider.outerWidth();
				console.log("entering split");
				settings.animating_state = true;
				var effect_name = settings.effect+"-";
				var $prev_item = $slider_items.eq(settings.prev_index);
				var $current_item = $slider_items.eq(settings.current_index);
				var $next_item = $slider_items.eq(settings.next_index);
				var part_width = slider_width/2;
				var part_height = slider_height/2;
				var org_item_parts_object= {};

					for (var i = 0; i < 2; i++) {
						for (var j = 0; j < 2; j++){
							var temp = {};
							// Setting the starting position of each parts
							temp.y = i * part_height;
							temp.x = j * part_width;
					
							// insert matrix_indexing 
							temp.matrix_code = (i+1)+""+(j+1);
							var matrix_code = temp.matrix_code;
							org_item_parts_object[matrix_code] = temp;
						}
					}
				if(settings.direction == 'next'){
					// use current and next
					$original_item = $current_item;
					$new_item =  $next_item;
				}
				if(settings.direction == "prev"){
					// use current and prev
					$original_item = $current_item;
					$new_item =  $prev_item;
				}

				if(settings.direction == "controls"){
					$original_item = $slider_items.eq(settings.old_index);
					$new_item = $slider_items.eq(settings.current_index);		
				}

				var img_src = $original_item.find("img").attr('src');
				var img_src_new = $new_item.find("img").attr('src');

				$original_item.empty();
				$original_item.append("<img src='"+img_src_new+"' alt='' />");
				//console.log(org_item_parts_object);
				Object.keys(org_item_parts_object).forEach(function(current_key,index){
					var part = document.createElement("div");
					part.className = effect_name+"old-part";
					switch(index){
						case 0:
							part.classList.add("border-tl");
							break;
						case 1:
							part.classList.add("border-tr");
							break;
						case 2:
							part.classList.add("border-bl");
							break;
						case 3:
							part.classList.add("border-br");
							break;
					}
					part.style.cssText = "background:url('"+img_src+"'); top:"+org_item_parts_object[current_key].y+"px; left:"+org_item_parts_object[current_key].x+"px;";
					part.style.backgroundPosition = org_item_parts_object[current_key].x+"px "+org_item_parts_object[current_key].y+"px";
					part.style.backgroundSize = slider_width+"px "+slider_height+"px"; 
					part.style.width = part_width+"px";
					part.style.height = part_height+"px";
					part.id = "j-"+org_item_parts_object[current_key].matrix_code;
					//console.dir(part);
					$original_item.append(part);
				});

				setTimeout(function() {
					Object.keys(org_item_parts_object).forEach(function(current_key,index){
						$("#j-"+org_item_parts_object[current_key].matrix_code).addClass(effect_name+"old-part-"+org_item_parts_object[current_key].matrix_code+"-ani-after");
					});
					$original_item.one(transitionEvent,function(e){
						console.log("final end");
							$original_item.empty();
							$original_item.append("<img src='"+img_src+"' alt='' />");
							settings.animating_state = false;
							if(settings.direction == "prev"){
								update_index_for_prev(settings,$slider_items);
								show_current_item_only(settings,$slider_items);
								apply_new_navigation_classes(settings,$slider_items);
							}
							if(settings.direction == "next"){
								update_index_for_next(settings,$slider_items);
								show_current_item_only(settings,$slider_items);
								apply_new_navigation_classes(settings,$slider_items);
							}
							if(settings.direction == "controls"){
								show_current_item_only(settings,$slider_items);
								apply_new_navigation_classes(settings,$slider_items);
							}
					});
				}, 300);
			}
};
