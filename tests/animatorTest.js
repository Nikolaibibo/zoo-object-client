var Animator      = require('./Animator.js');
var animationFile = require('./animations/animationSingle1.json');

var myAnimator = new Animator();
myAnimator.on("color_single", function (data) {
  console.log("Animator color_single::: " + data.pixel0 + "  ::  " + data.pixel1 + "  ::  " + data.pixel2);
});
myAnimator.doSingleAni(animationFile);
