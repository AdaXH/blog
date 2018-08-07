// Author:AdaXH
// 2018-1-31

(function($){
		$.fn.extend({
			glitch:function(config){
				var option = {      //default configure
					zIndexDefault:3,
					effect1TimeMin:600,
					effect1TimeMax:900,
					effect2TimeMin : 10,
					effect2TimeMax : 115,
					time:100
				};
				option = $.extend(option,config);

				function randomInt(min, max) {
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                 }

                function init(el,option){
                	var el1 = el.clone();
                    el1.insertBefore(el).css({'z-index': option.zIndexDefault});

                    var el2 = $(el).clone();
                    el2.insertAfter(el).addClass('front-3').
                    css({'z-index' : option.zIndexDefault + 1});   
                    
                    var el3 = el.clone();
                    el3.insertAfter(el).css({'z-index': option.zIndexDefault+2});
                }

				function mix(el,option) {
                
                     var clipPos1 = randomInt(10, 1900);
                     var clipPos2 = 9999;
                     var clipPos3 = randomInt(10, 1300);
                     var clipPos4 = 0;
                     var leftValue = randomInt(0, 40);
                     var rightValue = randomInt(0, 40);
                     var scaleValue = (Math.random() * (1.1 - 0.9) + 0.9).toFixed(2);
                     var randomTime = randomInt(option.effect2TimeMin, option.effect2TimeMax); 
                     $(el).next().next().css({
                    	     'clip' : 'rect('+clipPos1+'px, '+clipPos2+'px, '+clipPos3+'px,' + clipPos4 +'px)',
                    	     'left' : leftValue,
                           	'right' : rightValue,
                    	      '-webkit-transform' : 'scale(' + scaleValue + ')',
                               '-ms-transform' : 'scale(' + scaleValue + ')',
                              'transform' : 'scale(' + scaleValue + ')',
                              'mix-blend-mode':'hue'
                            });
                }
				
                function glitch1(el,config) {                   	
             		 var clip1 = randomInt(10, 1900);
             		 var clip2 = 9999;
             		 var clip3 = randomInt(10, 1300);
             		 var clip4 = 0;
             		 var left = randomInt(0, 16);
             		 var right = randomInt(0, 16);
             		 var randomTime = randomInt(config.effect1TimeMin, config.effect1TimeMax);
             		
             		 $(el).css({   //attention to : the principle of glitch effect
             		         'clip' : 'rect('+clip1+'px, '+clip2+'px, '+clip3+'px,' + clip4 +'px)' ,
             		         'right' : right,
             		         'left' : left	
             		 });
         		}
            	
         		function glitch2(el,config) {
                     var clip1 = randomInt(10, 1900);
                     var clip2 = 9999;
                     var clip3 = randomInt(10, 1300);
                     var clip4 = 0;
                     var left = randomInt(0, 40);
                     var right = randomInt(0, 40);
                     var randomTime = randomInt(config.effect2TimeMin, config.effect2TimeMax);
                     var scale = (Math.random() * (1.1 - 0.9) + 0.9).toFixed(2);

                     $(el).next().css({
                          'clip' : 'rect('+clip1+'px, '+clip2+'px, '+clip3+'px,' + clip4 +'px)',
                          'left' : left,
                             'right' : right,
                             '-webkit-transform' : 'scale(' + scale + ')',
                             '-ms-transform' : 'scale(' + scale + ')',
                          'transform' : 'scale(' + scale + ')',
                     });
                   }

                  init(this,option);
                  setInterval(()=>{
                  	glitch1(this,option);
                  	glitch2(this,option);
                  	mix(this,option);
                  },option.time);
			}
		})
})(jQuery);