var five        = require("johnny-five");
var pixel       = require("node-pixel");

var Animator = require('./Animator.js');
var animationFile = require('./animations/animationSingle1.json');


var myAnimator = new Animator();
myAnimator.on("animation_complete", function (resultobject) {
  console.log("animation complete");
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
        //doSingleAni(animationFile);
        //setupSockets();
        //doLightshow();
        //myAnimator.doSingleAni(animationFile);
    });

});
// ############################

var inter;
var itemLength;
var index;

var animStrip = {
  animation: [{ color:"white", time:200 }, { color:"red", time:200 }, { color:"green", time:200 }, { color:"blue", time:200 }, { color:"black", time:200 }]
}


var animSingle = {

  sequence: [ {triple: ["white", "red", "green" ], time: 500},
              {triple: ["red", "green", "blue" ], time: 500},
              {triple: ["green", "blue", "white" ], time: 500},
              {triple: ["blue", "white", "red" ], time: 500},
              {triple: ["white", "red", "green" ], time: 500},
              {triple: ["red", "green", "blue" ], time: 500},
              {triple: ["green", "blue", "white" ], time: 500},
              {triple: ["blue", "white", "red" ], time: 500},
              {triple: ["black", "black", "black" ], time: 500}
            ]  
}

// ############################
// ############################
// ############################




// ############################
// ############################
// ############################

function doStripAni (obj) {
  console.log("doStripAni item count: " + obj.animation.length);

  itemLength = obj.animation.length;
  index = 0;

  inter = setInterval( 
    function () { 
      colorStrip(obj.animation[index].color);
    }, obj.animation[index].time )
};

function colorStrip (col) {
  if (index >= itemLength-1) {
    clearInterval(inter);
  }
  console.log("colorStrip: " + col);
  index++;
  strip.color(col);
  strip.show();
}

// ############################
// ############################
// ############################
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
