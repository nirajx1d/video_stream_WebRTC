var video_out  = document.getElementById("vid-box");
var embed_code = document.getElementById("embed-code");
var embed_demo = document.getElementById("embed-demo");
var here_now   = document.getElementById('here-now');
var stream_info= document.getElementById('stream-info');
var end_stream = document.getElementById('end');

var streamName;

function stream(form) {
	streamName = form.streamname.value || Math.floor(Math.random()*100)+'';
	var phone = window.phone = PHONE({
	    number        : streamName, // listen on username line else random
	    publish_key   : 'pub-c-561a7378-fa06-4c50-a331-5c0056d0163c',
	    subscribe_key : 'sub-c-17b7db8a-3915-11e4-9868-02ee2ddab7fe',
	    oneway        : true,
	    broadcast     : true
	});
	//phone.debug(function(m){ console.log(m); })
	var ctrl = window.ctrl = CONTROLLER(phone);
	ctrl.ready(function(){
		form.streamname.style.background="#55ff5b";
		form.streamname.value = phone.number(); 
//		form.stream_submit.hidden="true";
		ctrl.addLocalStream(video_out);
		ctrl.stream();
        stream_info.hidden=false;
        end_stream.hidden =false;
		addLog("Streaming to " + streamName); 
	});
	ctrl.receive(function(session){
	    session.connected(function(session){ addLog(session.number + " has joined."); });
	    session.ended(function(session) { addLog(session.number + " has left."); console.log(session)});
	});
	ctrl.streamPresence(function(m){
		here_now.innerHTML=m.occupancy;
		addLog(m.occupancy + " currently watching.");
	});
	return false;
}

function watch(form){
	var num = form.number.value;
	var phone = window.phone = PHONE({
	    number        : "Viewer" + Math.floor(Math.random()*100), // listen on username line else random
	    publish_key   : 'pub-c-561a7378-fa06-4c50-a331-5c0056d0163c',
	    subscribe_key : 'sub-c-17b7db8a-3915-11e4-9868-02ee2ddab7fe',
	    oneway        : true
	});
	var ctrl = window.ctrl = CONTROLLER(phone);
	ctrl.ready(function(){
		ctrl.isStreaming(num, function(isOn){
			if (isOn) ctrl.joinStream(num);
			else alert("User is not streaming!");
		});
		addLog("Joining stream  " + num); 
	});
	ctrl.receive(function(session){
	    session.connected(function(session){ 
            video_out.appendChild(session.video); 
            addLog(session.number + " has joined.");
            stream_info.hidden=false;
        });
	    session.ended(function(session) { addLog(session.number + " has left."); });
	});
	ctrl.streamPresence(function(m){
		here_now.innerHTML=m.occupancy;
		addLog(m.occupancy + " currently watching.");
	});
	return false;
}

function getVideo(number){
	return $('*[data-number="'+number+'"]');
}

function addLog(log){
	$('#logs').append("<p>"+log+"</p>");
}

function end(){
	if (!window.phone) return;
	ctrl.hangup();
    video_out.innerHTML = "";
//	phone.pubnub.unsubscribe(); 
}

function genEmbed(w,h){
	if (!streamName) return;
	var url = "https://kevingleason.me/SimpleRTC/embed.html?stream=" + streamName;
	var embed    = document.createElement('iframe');
	embed.src    = url;
	embed.width  = w;
	embed.height = h;
	embed.setAttribute("frameborder", 0);
	embed_demo.innerHTML = "<a href='embed_demo.html?stream="+streamName+"&width="+w+"&height="+h+"'>Embed Demo</a>" 
	embed_code.innerHTML = 'Embed Code: ';
	embed_code.appendChild(document.createTextNode(embed.outerHTML));
}

function errWrap(fxn, form){
	try {
		return fxn(form);
	} catch(err) {
		alert("WebRTC is currently only supported by Chrome, Opera, and Firefox");
		return false;
	}
}
