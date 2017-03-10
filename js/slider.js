var sliderClass = function(context,options){
	var $slider = $(context);	
	var $slider_items = $slider.find(".jslider-item");
	console.log($slider);
	var	$slider_items_count = $slider_items.length;
		// Main settings
	var settings = $.extend({},$.fn.jslider.defaults,options);	

	var  animationEffects = {};
	var helper_functions = {};
		// Functions

		// Function from David Walsh: http://davidwalsh.name/css-animation-callback
		// May god bless him for this function :-)
		var whichTransitionEvent = function(){
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
		var transitionEvent = whichTransitionEvent();

		 var apply_new_navigation_classes = function(settings){
			$slider_items.eq(settings.current_index).addClass("current");
			$slider_items.eq(settings.prev_index).addClass("prev");
			$slider_items.eq(settings.next_index).addClass("next");
		};
		var remove_old_navigation_classes = function(settings){
			$slider_items.eq(settings.current_index).removeClass("current");
			$slider_items.eq(settings.prev_index).removeClass("prev");
			$slider_items.eq(settings.next_index).removeClass("next");
		};

		var run_animation = function(settings){
			if(!settings.animating_state){ // Run animation only when animating_State is false
				animationEffects[settings.effect](settings); //window[settings.effect](settings.duration);
				// $.fn.jslider.animationEffects[settings.effect](settings);
			}		
			else
				console.log("already animation is running");
		}; 

		var update_index_for_next = function(settings){
			settings.current_index = (settings.current_index + 1) % $slider_items_count;
			settings.prev_index = (settings.prev_index + 1) % $slider_items_count;
			settings.next_index = (settings.next_index + 1) % $slider_items_count;
		};

		var update_index_for_prev = function(settings){
			settings.current_index = (settings.current_index + $slider_items_count - 1) % $slider_items_count;
			settings.prev_index = (settings.prev_index + $slider_items_count - 1) % $slider_items_count;
			settings.next_index = (settings.next_index + $slider_items_count - 1) % $slider_items_count;
		};

		animationEffects.fade = function(settings){
			settings.animating_state = true;
			if(settings.direction =="prev"){
				console.log("updating index");
				update_index_for_prev(settings);	
			}
			if(settings.direction == "next"){
				console.log("updating index");
				update_index_for_next(settings);
			}
			apply_new_navigation_classes(settings);
			$slider_items.eq(settings.prev_index).hide();
			$slider_items.eq(settings.next_index).hide();
			$slider_items.eq(settings.current_index).fadeIn(settings.duration,function(){
				settings.animating_state = false;
			});
		};

		animationEffects.disperse = function(passed_object){
			x_center = (settings.row/2)+1;
			y_center = (settings.column/2)+1;

			for( i = 1;i <= settings.row; i++){
				for( j = 1;j <= settings.column; j++){
					key=i+""+j;
					// Whether present in first quarter
					if((i < x_center) && (j < y_center)){
						passed_object[key].x_target = passed_object[key].x - (Math.abs(i - x_center) * settings.offset);
						passed_object[key].y_target = passed_object[key].y - (Math.abs(j - y_center) * settings.offset);
					}
					// Whether present in second quarter
					if((i < x_center) && (j > y_center)){
						passed_object[key].x_target = passed_object[key].x + (Math.abs(i - x_center) * settings.offset);
						passed_object[key].y_target = passed_object[key].y - (Math.abs(j - y_center) * settings.offset);
					}
					// Whether present in third quarter
					if((i > x_center) && (j < y_center)){
						passed_object[key].x_target = passed_object[key].x - (Math.abs(i - x_center) * settings.offset);
						passed_object[key].y_target = passed_object[key].y + (Math.abs(j - y_center) * settings.offset);
					}
					// Whether present in four quarter
					if((i > x_center) && (j > y_center)){
						passed_object[key].x_target = passed_object[key].x + (Math.abs(i - x_center) * settings.offset);
						passed_object[key].y_target = passed_object[key].y + (Math.abs(j - y_center) * settings.offset);
					}

					// if(i == x_center)
					// {
					// 	if(j < y_center){
					// 		passed_object[key].x_target = passed_object[key].x - (Math.abs(j - y_center) * settings.offset);
					// 	}
					// 	else{
					// 		passed_object[key].x_target = passed_object[key].x + (Math.abs(j - y_center) * settings.offset);
					// 	}
					// }
					// if(j == y_center)
					// {
					// 	if(i < x_center){
					// 		passed_object[key].y_target = passed_object[key].y - (Math.abs(i - x_center) * settings.offset);
					// 	}
					// 	else{
					// 		passed_object[key].y_target = passed_object[key].y + (Math.abs(i - x_center) * settings.offset);
					// 	}
					// }
					
					
				}	
			}
		};

		animationEffects.split = function(duration){
			$prev_item = $slider_items.eq(settings.prev_index);
			$current_item = $slider_items.eq(settings.current_index);

			part_width = settings.width/settings.column;
			part_height = settings.height/settings.row;
			prev_item_parts_object = {};
			
			for(var i = 0; i < settings.row; i++){
				for(var j = 0; j < settings.column; j++)
				{
					var temp = {};
					// Setting the starting position of each parts
					temp.y = i * part_height;
					temp.x = j * part_width;

					// insert matrix_indexing 
					temp.matrix_code = (i+1)+""+(j+1);
					var matrix_code = temp.matrix_code;
					prev_item_parts_object[matrix_code] = temp;
				}
			}
			
			animationEffects.disperse(prev_item_parts_object);
				
			img_src = $prev_item.find("img").attr('src');			
			$prev_item.empty();

			Object.keys(prev_item_parts_object).forEach(function(current_key,index){
			
			//	console.log(current_key+"---"+index+"--->"+prev_item_parts_object[current_key].matrix_code);
				var part = document.createElement("div");
				part.className = "part"; 
				part.style.cssText = "background:url('"+img_src+"'); top:"+prev_item_parts_object[current_key].y+"px; left:"+prev_item_parts_object[current_key].x+"px;";
				part.style.backgroundPosition = prev_item_parts_object[current_key].x+"px "+prev_item_parts_object[current_key].y+"px";
				part.style.width = part_width+"px";
				part.style.height = part_height+"px";
				part.id = "j-"+prev_item_parts_object[current_key].matrix_code;
				console.dir(part);
				$prev_item.append(part);
			});
		
			Object.keys(prev_item_parts_object).forEach(function(key,index){
				
				$("#j-"+prev_item_parts_object[key].matrix_code).animate({
					top: prev_item_parts_object[key].y_target,
					left: prev_item_parts_object[key].x_target
				},settings.duration);

			});
		};

		animationEffects.hang = function(){

		};

		var show_current_item_only = function(settings){
			$slider_items.eq(settings.current_index).show();
			$slider_items.eq(settings.prev_index).hide();
			$slider_items.eq(settings.next_index).hide();
		};

		animationEffects.book_fold = function(settings){
			console.log("entering book fold");
			settings.animating_state = true;
			var effect_name = settings.effect+"-";
			var $prev_item = $slider_items.eq(settings.prev_index);
			var $current_item = $slider_items.eq(settings.current_index);
			var $next_item = $slider_items.eq(settings.next_index);
			var part_width = settings.width/2;
			var part_height = settings.height;
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

			var img_src = $original_item.find("img").attr('src');			
			$original_item.empty();

			org_item_parts_array.forEach(function(current_value,index){
				var part = document.createElement("div");
				part.className = effect_name+"old-part ";
				part.className += "old-part-no-"+index;
				part.style.cssText = "background:url('"+img_src+"'); top:"+current_value.y+"px; left:"+current_value.x+"px;";
				part.style.backgroundPosition = current_value.x+"px "+current_value.y+"px";
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
				part.style.width = part_width+"px";
				part.style.height = part_height+"px";
				// default css styles for animation
				if(index == 0){
					// for sheet1
					part.classList.add(effect_name+"new-part-page1-ani-before");
				}
				else{
					// for sheet2
					part.classList.add(effect_name+"new-part-page2-ani-before");
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
						$new_item.empty();
						$new_item.append("<img src='"+img_src_new+"' alt='' />");
						console.log("animation over"+count);
						settings.animating_state = false;
						if(settings.direction =="prev"){
							console.log("updating index");			
							update_index_for_prev(settings);
							show_current_item_only(settings);
							apply_new_navigation_classes(settings);
						}
						if(settings.direction =="next"){
							console.log("updating index");
							update_index_for_next(settings);
							show_current_item_only(settings);
							apply_new_navigation_classes(settings);
						}
				});

			},300);

		};

		var prev = function(settings,slider){
			if(!settings.animating_state)
			{
				remove_old_navigation_classes(settings);
				settings.direction ="prev";
				run_animation(settings);
			}					
		};
		
		var next = function(settings){
			if(!settings.animating_state)
			{
				remove_old_navigation_classes(settings);	
				settings.direction ="next";				
				run_animation(settings);
			}				
		};


		apply_new_navigation_classes(settings);

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
			prev(settings);
		});
		$("a.arrow-right", $slider).on("click",function(event){
			event.preventDefault();		
			next(settings);
		});

		if(settings.automatic){
			settings.automatic_ID = setInterval(function(){
				next(settings);
			},5000);
		}
		
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
			current_index: 1,
			prev_index: 0,
			next_index: 2,
			width: 600,
			height: 450,
			offset: 10,
			row: 5,
			column: 5
};

// $.fn.jslider.animationEffects = {
// 			fade: function(settings){
// 				settings.animating_state = true;
// 				if(settings.direction =="prev"){
// 					console.log("updating index");
// 					update_index_for_prev(settings);	
// 				}
// 				if(settings.direction == "next"){
// 					console.log("updating index");
// 					update_index_for_next(settings);
// 				}
// 				apply_new_navigation_classes(settings);
// 				$slider_items.eq(settings.prev_index).hide();
// 				$slider_items.eq(settings.next_index).hide();
// 				$slider_items.eq(settings.current_index).fadeIn(settings.duration,function(){
// 					settings.animating_state = false;
// 				});
// 			}
// };