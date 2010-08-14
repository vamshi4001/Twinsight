/* 	Realtime Related Tweets Bar v1.0
	Blog : http://www.moretechtips.net
	Project: http://code.google.com/p/realtime-related-tweets-bar/
	Copyright 2009 [Mike @ moretechtips.net] 
	Licensed under the Apache License, Version 2.0 
	(the "License"); you may not use this file except in compliance with the License. 
	You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
*/

(function($){ 
$.fn.relatedTweets = function(allOptions) {  
	// This default options will apply on all matched elements unless element has his own options
	var defaults = {
		debug:0
		,query:''
		,default_query:''
		,realtime:2
		,status:0
		,lang:'en'
		,n:10
		,max_tags:5
		,or_tags:1
		,show_avatar:1
		,show_author:1
		,show_date:1
		,show_source:1
		,image_width:48
		,from_users:''
		,to_users:''
		,at_users:'' 
		,links_only:0
		,geocode:''
		,stay_time:5000
		,enter_time:300
		,exit_time:200
		,animate:'opacity'
	};
	allOptions = $.extend({}, defaults, allOptions);
		
	return this.each(function() {  
		var div = $(this);
		var count=0, ul=null, max_id = 0;
		var visibleI = -1; // Index of visibleI element
		var calls=0,removeExtra = false;
		var effectParams = new Object;
		
		//override passed options by element embedded options if any
		var op = allOptions;
		if (div.attr('options')) {
			try { 
				op = eval('('+div.attr('options')+')'); 
			} catch(e) { 
				if(op.debug) div.html('<b style="color:red">'+e+'</b>');
				return;
			}
			op = $.extend({}, defaults, op);
		};
		
		//JSON is loaded
		var searchLoaded = function(json,status){
			// Errors!
			if(!json.results || !json.max_id) {
				if(op.debug) div.html('<b style="color:red">Error:'+(json.error? json.error:'unkown')+'</b>');
				return; //exit
			}
			var rs = json.results;
			if(json.max_id>0) max_id = json.max_id;
			
			//Start output on first time
			if (calls==0) {
				//no results on first time! tags didn't return any!
				if(rs.length==0) return;
				count = rs.length;
				var inDiv = $('<div class="rrt-inner"></div>').appendTo(div.html('')); //Add inner div
				ul = $('<ul></ul>').appendTo(inDiv); //Add ul
			}
			calls++;
			
			//Add results starting from older
			for(var i=rs.length-1;i>=0;i--) appendLI(rs[i],rs.length-1-i);
			
			// extra calls: adding extra li: flag to removal old ones and update count
			if (calls>1 && rs.length) removeExtra = true;
			//start fade cycle after first search only! 
			if (calls==1) fadeOut();
		};
		var appendLI = function(x,i) {
			//Init style as display:none
			$('<li style="display:none;">'
				+ (op.show_avatar? '<span class="rrt-author-img">'
									+'<a href="http://twitter.com/'+ x.from_user +'" title="'+ x.from_user +'">'
										+'<img src="'+ x.profile_image_url +'" height="'+op.image_width+'" width="'+op.image_width+'" border="0"/>'
									+'</a>'
								+'</span>' :'')
				+'<span class="rrt-body">'
					+ (op.show_author? '<strong>'
						+'<a href="http://twitter.com/'+ x.from_user +'" title="'+ x.from_user +'">'
							+x.from_user
						+'</a>'
					+'</strong>' :'')
					+'<span class="rrt-content">'+ linkify(x.text) +'</span>'
					+'<span class="rrt-meta">'
						+ (op.show_date? '<a class="rrt-date" href="http://twitter.com/'+ x.from_user +'/status/'+ x.id +'">'
							+ formatDate(x.created_at)
						+'</a>' :'')
						+ (op.show_source? '<span class="rrt-source"> from '+ decodeHTML(x.source) +'</span>' : '')
					+'</span>'
				+'</span>'
			+'</li>').appendTo(ul);
		};
		
		// Fade out the current link
		var fadeOut = function(){
			if (visibleI>-1) {
				$('li',ul).eq(visibleI).fadeOut(op.exit_time,fadeIn);
			}
			else fadeIn();
		};
		// Fade in the next link
		var fadeIn = function(){
			//after fading-out last old one: remove extra li's and update count
			if (removeExtra) removeExtraLI();
			
			//Incremnet visibleI index
			visibleI++;
			if (visibleI>=count) visibleI=0;
			
			//create effect param and set it show
			effectParams[op.animate] = 'show';
			$('li',ul).eq(visibleI).animate(effectParams,op.enter_time,"linear", fadeStill);
			
			//search again as last tweet appears if in realtime mode
			if (visibleI+1>=count && op.realtime) search();
		};
		// Dummy fade in effect to keep current link for a while
		var fadeStill = function(){
			$('li',ul).eq(visibleI).animate({opacity:1},op.stay_time,"linear", fadeOut);
		};
		
		//Remove Extra LI
		var removeExtraLI = function(){
			var crntCount = $('li',ul).size();
			//remove extra if any
			if (crntCount>op.n) {
				$('li:lt('+(crntCount-op.n)+')',ul).remove();
				count = op.n;
			}
			else {
				count = crntCount;
			}
			//set flag off
			removeExtra = false;
		};
		
		//parse links, user id's, hashtags
		var linkify= function(d){
			return d.replace(/\bhttps?\:\/\/\S+/gi, function(b){
				var c='';
				b= b.replace(/(\.*|\?*|\!*)$/,function(m,a){
					c=a;
					return ''
				});
				return '<a class="rrt-link" href="'+b+'">'+((b.length>25)?b.substr(0,24)+'...':b)+'</a>'+c;
			})
			.replace(/\B\@([A-Z0-9_]{1,15})/gi,'@<a class="rrt-at" href="http://twitter.com/$1">$1</a>')
			.replace(/\B\#([A-Z0-9_]+)/gi,'<a class="rrt-hashtag" href="http://search.twitter.com/search?q=%23$1">#$1</a>')
		};
		//decode html at source
		var decodeHTML = function(s) {
			return s.replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/&quot;/gi,'"');
		};
		// Format publish date 
		var formatDate = function(dstr){
			var dat = new Date(),tody = new Date();
			dat.setTime(Date.parse(dstr));
			var td = tody.getDate(), tm = tody.getMonth()+1, ty = tody.getFullYear(), th = tody.getHours(), tmn = tody.getMinutes(), ts = tody.getSeconds();
			var d = dat.getDate(), m = dat.getMonth()+1, y = dat.getFullYear(), h = dat.getHours(), mn = dat.getMinutes(), s = dat.getSeconds();
			//today
			if (y==ty && m==tm && d==td) {
				var dh = th-h;
				if (dh>0) return dh+' hour'+(dh>1?'s':'')+' ago';
				var dmn = tmn-mn;
				if (dmn>0) return dmn+' minute'+(dmn>1?'s':'')+' ago';
				var ds = ts-s;
				return ds+' second'+(ds>1?'s':'')+' ago';
			}
			//Old one
			else return m+'/'+d+'/'+y;
		};
		//do search 
		var search = function() {
			//Call RESTful Interface and get JSON
			var data = {lang:op.lang,q:op.query,rpp:op.n,since_id:max_id};
			if(op.geocode) data.geocode = op.geocode;
			$.ajax({url:'http://search.twitter.com/search.json'
				   ,data:data
				   ,success:searchLoaded
				   ,dataType:'jsonp'
			});
		};
		// Init : get page tags, build query, call search
		var init = function() {
			var tags = [];
			//get tags if search query was not pre-set & not in status mode
			if (!op.query && !op.status) 
				$('a[rel="tag"]:lt('+op.max_tags+')').each(function () {
					var tag= $.trim($(this).text().replace(/\n/g,''));
					if($.inArray(tag,tags)==-1) tags[tags.length]=tag;
				});
			//Search expression by ORing tags
			if(tags.length>0) op.query = tags.join((op.or_tags? ' OR ':' ')); 
			//No Tags found, use default search query
			if(!op.query) op.query = op.default_query;
		
			//user related search
			if(op.from_users) op.query += " from:" + op.from_users.replace(/\s/g,'').replace(/,/g,' OR from:');
			if(op.to_users) op.query += " to:"+ op.to_users.replace(/\s/g,'').replace(/,/g,' OR to:');
			if(op.at_users) op.query += " @"+ op.at_users.replace(/\s/g,'').replace(/,/g,' OR @');
			if(op.links_only) op.query+= ' filter:links';
			
			search();
		};
		
		init();
	});  
}

})(jQuery);  
//auto load div with class set to related-tweets
jQuery(document).ready(function(){
	jQuery('div.related-tweets').relatedTweets();
});
