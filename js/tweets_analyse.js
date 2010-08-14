//Javascript file containing jQuery coding for getting tweets and Analyzing them 

	var lat;
	var lon;
	var bar;
	var p;
	var categories=new Array();
	var users=new Array();
	var tweetscum="";
	var ter;
	var tweetTerms=new Array();
 (function($){
    // Parses returned response and extracts
	getKeywords=function(){
		$("#cat").html('<center><img src="loading.gif" id="loading" /></center>');
		$("#term").html('<center><img src="loading.gif" id="loading" /></center>');

			var text = $("#pagebody").text();
			if (text=="") {
			alert("There is no text to send");
			} else {
				text = text.replace(/<\/?[^>]+(>|$)/g,"")
				//alert("Category")
				//alert( "Data Saved: " + text );
				 $.ajax({
				   type: "POST",
				   url: "tagger.php",
				   data: { text:text },
				   dataType: text,
				   success: function(data){
				  // alert( "Data Saved: " + data );
				   $("#cat").html(data);
				   },
				  error: function(msg) { alert(msg) }
				});
				//alert("Keywords")
				//alert( "Data Saved: " + text );
				 $.ajax({
				   type: "POST",
				   url: "keyword.php",
				   data: { text:text },
				   dataType: text,
				   success: function(data){
				  //alert( "Data Saved: " + data );
				   $("#term").html(data);
				   $("#term").hide();
				   $("#term22").html(data);
				   myFunction();
				   $('#doc2').fadeIn();
				   },
				  error: function(msg) { alert(msg) }
				});
			  }
	};
	getTweets(){
					var u=$('#username').val();
			$('#getting').fadeIn();
			$('#posts').fadeIn();
			$("#logo").slideUp();
			$("#logo").fadeIn();
			$("#logo").attr("src", "small.png");
			var x;
			var y;
			if($('#username').val() != ''){
					if($('#number').val() != '')
					{	x=$('#number').val();	}
					else
					{	x=10;	}
					if($('#key').val() != '')
					{	y=$('#key').val();	}
					else
					{	y='*';	}
					$.jTwitter($('#username').val(),x, function(data){
						$('#posts').empty();
						$('#tuser').text($('#username').val());
						$.each(data, function(i, post){
							$('#pagebody').append(
								'<div class="demo">'
								+'<div class="users">'
								+ post.text
								+'<hr noshade="noshade" />'
								+' </div>'
								+'</div>'
							);
						});
					});
			}
			$('#getting').fadeOut();
			$('#createkwords').fadeIn();
	};	
 })(jQuery);
