var five        = require("johnny-five");
var pixel       = require("node-pixel");
var io 			= require('socket.io-client');

var host = "https://socket-1136.appspot.com";
//var host = "http://192.168.2.108:8080";
var socket 		= io.connect(host, {reconnect: true});

// ############################
socket.on('connect', function(msg) {
  console.log('Connected!');
});
socket.on('led_multi', function(msg) {
  	console.log('led multi  :: ' + " :: " + msg.color);
	 showColorAll(msg.color);
});

socket.on('led_single', function(msg) {
  	console.log('led single  :: ' + msg.id + " :: " + msg.color);
	showColorByID(msg.id, msg.color);
});

socket.on('animation', function(msg) {
  	console.log('animation');
    startLightshow();
    setTimeout(stopLightshow, 2000);
});

console.log('### client is running ###');


// ############################
// johnny-five options
// ############################
var opts        = {};
opts.port       = process.argv[2] || "";

var board       = new five.Board(opts);
var strip       = null;
var blinker;
var fps         = 10; // TODO: figure out how many frames per second

var colorArray  = ["red", "green", "blue", "yellow", "cyan", "magenta", "white"];
var routeArray  = ["/api/turnon", "/api/turnoff", "/api/colors", "/api/colors/red", "/api/colors/green", "/api/colors/blue", "/api/colors/yellow", "/api/colors/cyan", "/api/colors/magenta", "/api/colors/white", "/api/colors/black"];

// ############################
// johnny-five startup
// ############################
board.on("ready", function() {
    console.log("Ardunio ready, start the show");
    strip = new pixel.Strip({
        data: 6,
        length: 3,
        board: this,
        controller: "FIRMATA",
    });

    strip.on("ready", function() {
        console.log("Strip ready, let's go");
        //setupSockets();
        //doLightshow();
    });

});


// ############################
// methods
// ############################
function showColorAll (arg) {
  if (blinker) clearInterval(blinker);
  //strip.pixel(0).color(arg);
  //strip.pixel(1).color(arg);
  strip.color(arg);
  strip.show();
}

function showColorByID (id, col) {
  if (blinker) clearInterval(blinker);
  strip.pixel(id).color(col);
  //strip.pixel(1).color(arg);
  //strip.color(col);
  strip.show();
}


function stopLightshow () {
  console.log("stopLightshow");

  clearInterval(blinker);
  strip.color("#000");
  strip.show();
}



function startLightshow () {
  console.log("doLightshow");
  var current_colors = [0,1,2,3,4];
  //var current_pos = [0,1,2,3,4,75,76,77,78,79]
  var current_pos = [0,1,2,3,4];
  blinker = setInterval(function() {

      //strip.color("#000"); // blanks it out

      for (var i=0; i< current_pos.length; i++) {
          if (++current_pos[i] >= strip.stripLength()) {
              current_pos[i] = 0;
              if (++current_colors[i] >= colorArray.length) current_colors[i] = 0;
          }
          strip.pixel(current_pos[i]).color(colorArray[current_colors[i]]);
      }

      strip.show();

  }, 1000/fps);
}
