var EventEmitter        = require("events").EventEmitter;
var util                = require("util");

var _this;

var inter;
var itemLength;
var index;

function Animator () {
    EventEmitter.call(this);
    _this = this;
}
util.inherits(Animator, EventEmitter);






function colorSingle (col0, col1, col2) {
  if (index >= itemLength-1) {
    clearInterval(inter);
  }
  console.log("colorSingle ");
  index++;
  
  strip.pixel(0).color(col0);
  strip.pixel(1).color(col1);
  strip.pixel(2).color(col2);
  strip.show();
}



Animator.prototype.doSingleAni = function (obj) {
  console.log("doSingleAni item count: " + obj.sequence.length);

  itemLength = obj.sequence.length;
  index = 0;

  inter = setInterval( 
    function () { 
      colorSingle(obj.sequence[index].triple[0], obj.sequence[index].triple[1], obj.sequence[index].triple[2]);
    }, obj.sequence[index].time )
}

module.exports = Animator;
