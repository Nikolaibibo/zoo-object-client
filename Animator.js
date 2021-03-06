var EventEmitter        = require("events").EventEmitter;
var util                = require("util");

var _this, inter, itemLength, index, colorObject;

// ############################
// ############################

function Animator () {
    EventEmitter.call(this);
    _this = this;
}
util.inherits(Animator, EventEmitter);

// ############################
// ############################

function startSingleAnimation (obj) {



}

function processColors () {
  console.log("processColors");

  var col0 = colorObject.sequence[index].triple[0];
  var col1 = colorObject.sequence[index].triple[1];
  var col2 = colorObject.sequence[index].triple[2];

  var data = {
    pixel0: col0,
    pixel1: col1,
    pixel2: col2
  };

  _this.emit("color_single", data);

  index++;

  if (index <= itemLength-1) {
    setTimeout(processColors, colorObject.sequence[index].time );
  }else{
    console.log("ENDE");
  }


}

// ############################
// ##### public functions #####
// ############################

Animator.prototype.doSingleAni = function (obj) {
  console.log("doSingleAni item count: " + obj.sequence.length);

  colorObject = obj;
  itemLength = colorObject.sequence.length;
  index = 0;

  setTimeout(processColors, colorObject.sequence[index].time );
}


// ############################
module.exports = Animator;
