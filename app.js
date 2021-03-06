var five          = require("johnny-five");
var pixel         = require("node-pixel");
var io 			      = require('socket.io-client');
var request       = require('request');
var fs            = require('fs');
var shell         = require('shelljs');
var Animator      = require('./Animator.js');

// external config data
var target_file_still   = "/home/pi/nodejs/zoo-object-client/images/cam.jpg";
var shell_stillimage    = "raspistill -o " + target_file_still + " -w 800 -h 534 -t 500";

// animation files
var animation1File       = require('./animations/animationSingle_1.json');
var animationNikolaiFile = require('./animations/animationSingle_nikolai.json');
var startupAnimationFile = require('./animations/animationSingle_startup.json');

// host config
var config 			         = require('./config.json');
var host                 = config.socket_host;

// connect to socket server
var socket 		           = io.connect(host, {reconnect: true});

// ############################
// Animator
// ############################

var myAnimator = new Animator();
myAnimator.on("color_single", function (data) {
  //console.log("Animator color_single");
  console.log("Animator color_single::: " + data.pixel0 + "  ::  " + data.pixel1 + "  ::  " + data.pixel2);
  showColorSingle(data.pixel0, data.pixel1, data.pixel2);
});

// ############################
// ############################
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

socket.on('notification', function(msg) {
  	console.log('notification');
    myAnimator.doSingleAni(animation1File);
});

socket.on('nikolai', function(msg) {
  	console.log('notification');
    myAnimator.doSingleAni(animationNikolaiFile);
    //capturePic();
});

// image_saved

socket.on('image_saved', function(msg) {
  	console.log('pi client -> image_saved on server:: ' + msg.path);
    //myAnimator.doSingleAni(animationNikolaiFile);
});

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
        myAnimator.doSingleAni(startupAnimationFile);
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

  capturePic();
}

function showColorSingle (col0, col1, col2) {
  if (blinker) clearInterval(blinker);
  strip.pixel(0).color(col0);
  strip.pixel(1).color(col1);
  strip.pixel(2).color(col2);
  //strip.color(arg);
  strip.show();
}

function showColorByID (id, col) {
  if (blinker) clearInterval(blinker);
  strip.pixel(id).color(col);
  strip.show();

  capturePic();
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

function capturePic () {
  console.log("capturePic");
  shell.exec(shell_stillimage, function(code, output) {
    console.log("pic captured on pi");
    sendPic();
  });
}

function sendPic () {

  console.log("sendPic");
  var url = config.socket_host + "/upload";

  var req = request.post(url, function (err, resp, body) {
    if (err) {
      console.log('Error!');
    } else {
      console.log('URL: ' + body);
    }
  });
  var form = req.form();
  form.append('file', fs.createReadStream(target_file_still));
}

console.log('### client is running ###');
