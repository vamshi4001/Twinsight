var jQueryInit = false;
function initJQuery() {
	if (typeof(jQuery) == 'undefined') {
		if (! jQueryInit) {
			jQueryInit = true;
			document.write("<scr" + "ipt type=\"text/javascript\" src=\"http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js\"></scr" + "ipt>");
		}
		setTimeout("initJQuery()", 250);
	} else {
		jQuery(document).ready(function() {
			// Setup workspace
			Chitika.Tweeter.setup();
			// Register Processing
			jQuery(document).mouseup(function(e) { Chitika.Tweeter.process(e); });
			// Register Registers (heh :D)
			jQuery(document).mousedown(function(e) { Chitika.Tweeter.register(e); });
			// Register Clicking
			jQuery(".tweeterLink").click(function() { 
				jQuery(".tweeterHover").stop().hide();
			});
		});
	}
}

// Initialize JQuery on body load
initJQuery();

// Configuration
var clickX, clickY;
var tooltipOffsetX = 20;
var tooltipOffsetY = 15;
var minChars = 5;
var maxChars = 1000;
var processURL = "http://labs.chitika.net/TinyTweet/tweet.php?q=";
var lastSelection = "";

// Initiate Chitika Engine
if(!window.Chitika){ Chitika = {}; }

// Create Module
Chitika.Tweeter = {};

/******* Get Selected Text *******/
Chitika.Tweeter.getSelected = function() {
	if (window.getSelection){ return window.getSelection(); }
	else if(document.getSelection){ return document.getSelection(); }
	else if(document.selection){ return document.selection.createRange().text; }
	return '';
}

/******* URL Encode/Decode *******/
Chitika.Tweeter.urlencode = function (str) {
	return escape(str).replace(/\+/g, '%2B').replace(/%20/g,'+').replace(/\*/g, '%2A').replace(/\//g, '%2F').replace(/\@/g, '%40');
}
Chitika.Tweeter.urldecode = function (str) {
	return unescape(str.replace(/\+/g, ' '));
}

/******* Process Seleted Text *******/
Chitika.Tweeter.process = function(e){
	// Get selection, convert to string & trim it
	var selection = Chitika.Tweeter.getSelected().toString().replace(/^\s+|\s+$/g,"");
	if (lastSelection == selection)	{ return; } else { lastSelection = selection; }
	if(selection != "" && selection.length >= minChars && selection.length <= maxChars) {
		var diffX = (clickX + e.pageX) / 2;
		var diffY = (clickY + e.pageY) / 2;
		
		// Complete selection
		selection = Chitika.Tweeter.completeSelection(selection);
		
		// Set X
		if (diffX > 0) { jQuery(".tweeterHover").css("left", diffX - tooltipOffsetX);
		} else if (diffX < 0) { jQuery(".tweeterHover").css("left", diffX + tooltipOffsetX);
		} else { jQuery(".tweeterHover").css("left", e.pageX + tooltipOffsetX); }
		
		// Set Y
		jQuery(".tweeterHover").css("top", e.pageY + tooltipOffsetY);
		
		// Set URL
		jQuery(".tweeterLink").attr("href", processURL + Chitika.Tweeter.urlencode(selection));
		
		// Fade In
		jQuery(".tweeterHover").fadeIn("slow");
	}

}

/******* Register Initial Click / Fadeout *******/
Chitika.Tweeter.register = function(e) {
	
	// Record initial click positions
	clickX = e.pageX; 
	clickY = e.pageY;
	
	// Fade out
	jQuery(".tweeterHover").fadeOut("slow");

}


/******* Complete user-made selection (prev/next chars) *******/
Chitika.Tweeter.completeSelection = function(str) {

	// Find Container
	var container = jQuery('*:contains("'+str+'"):last');
	if (container.length == 0) return str;
	
	// Capture, convert and trim text.
	container = jQuery(container).html().toString().replace(/^\s+|\s+$/g,"").replace(/\t/g,"");
	var findIndex = container.indexOf(str);
	if (findIndex == -1) return str;
	
	// Config
	maxTries = 15;
	
	// Attempt previous
	var prevTry = true, prevStr = "", prevChar = "", charCount = 0;
	do {
		prevChar = container.substr(findIndex - (charCount += 1), 1)
		//console.debug("Previous: Looping on " + charCount + " -- char = [" + prevChar + "] | prevStr = " + prevStr + " SUm => " + (findIndex - charCount) + " | Index => " + findIndex);
		if (prevChar != " " && prevChar != ">" && charCount <= maxTries && (findIndex - charCount) >= 0) {
			prevStr = prevChar + prevStr;
		} else { prevTry = false; }
	} while (prevTry);
	
	// Attempt next
	var nextTry = true, nextStr = "", nextChar = "", charCount = -1;
	do {
		nextChar = container.substr(findIndex + str.length + (charCount += 1), 1)
		//console.debug("Next: Looping on " + charCount + " -- char = " + nextChar + " | nextStr = " + nextStr);
		if (nextChar != " " && nextChar != "<" && nextChar != "" && charCount <= maxTries) {
			nextStr += nextChar;
		} else { nextTry = false }
	} while (nextTry);
	
	// Compile and return
	return prevStr + str + nextStr;
}


/******* Setup Workstation *******/
Chitika.Tweeter.setup = function(){
	// Generate Elements
	var tweeterHover = jQuery("<div>")
		.css("z-index","99999")
		.css("width", "114px")
		.css("height", "47px")
		.css("background-image", "url('http://labs.chitika.net/TinyTweet/images/bg.png')")
		.css("position", "absolute")
		.css("display", "none")
		.addClass("tweeterHover");
	var tweeterBody = jQuery("<div>").css("width", "100px").css("height", "25px").css("margin", "15px 7px 0px 7px");
	var tweeterIcon = jQuery("<div>").css("padding", "4px").css("float", "left");
	var tweeterText = jQuery("<div>").css("padding", "5px 0px 0px 2px").css("float", "left");
	var tweeterIMG = jQuery("<img>").attr("src", "http://labs.chitika.net/TinyTweet/images/icon.gif");
	var tweeterLink = jQuery("<a>").attr("href", "#").text("Tweet this").css("font-size","12px").addClass("tweeterLink");
	
	var tweeterStyle = "";
	tweeterStyle += ".tweeterHover a:link { color:#2276BB; text-decoration:none; }";
	tweeterStyle += ".tweeterHover a:visited { color:#2276BB; text-decoration:none; }";
	tweeterStyle += ".tweeterHover a:hover { color:#2276BB; text-decoration:underline; }";
	tweeterStyle += ".tweeterHover a:active { color:#2276BB; text-decoration:none; }";
	tweeterStyle += ".tweeterHover { margin: 0; padding: 0; border: 0; font-size: 100%; line-height: 1; list-style: none; }";
	tweeterStyle += ".tweeterHover { font: 12px 'Lucida Grande', Verdana, Verdana, Arial, Helvetica, sans-serif; }";
	
	// Compile set
	tweeterHover.append(tweeterBody);
		tweeterBody.append(tweeterIcon);
			tweeterIcon.append(tweeterIMG);
		tweeterBody.append(tweeterText);
			tweeterText.append(tweeterLink);
	// Add Style
	jQuery('head').append('<style type="text/css">'+tweeterStyle+'</style>');
	// Finally, append all to body
	jQuery("body").prepend(tweeterHover);
}

/** Analytical Usage Tracking **/
var app_name = "TinyTweet";
var app_ref = document.referrer ? document.referrer : "";
var app_log = new Image(1,1);
app_log.src = "http://labs.chitika.net/usage.php?app="+escape(app_name)+"&ref="+escape(app_ref)+"&cb="+parseInt(Math.random() * 9999);
app_log.style.display = "none";