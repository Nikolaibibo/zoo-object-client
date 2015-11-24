var EventEmitter        = require("events").EventEmitter;
var util                = require("util");

var _this, inter, itemLength, index;

// ############################
// ############################

function Animator () {
    EventEmitter.call(this);
    _this = this;
}
util.inherits(Animator, EventEmitter);

// ############################
// ############################

function colorSingle (col0, col1, col2) {
  if (index >= itemLength-1) {
    clearInterval(inter);
  }
  //console.log("colorSingle ");
  index++;

  var data = {
    pixel0: col0,
    pixel1: col1,
    pixel2: col2
  };

  _this.emit("color_single", data);
}

// ############################
// ##### public functions #####
// ############################

Animator.prototype.doSingleAni = function (obj) {
  console.log("doSingleAni item count: " + obj.sequence.length);

  itemLength = obj.sequence.length;
  index = 0;

  inter = setInterval(
    function () {
      colorSingle(obj.sequence[index].triple[0], obj.sequence[index].triple[1], obj.sequence[index].triple[2]);
    }, obj.sequence[index].time )
}


// ############################
module.exports = Animator;
