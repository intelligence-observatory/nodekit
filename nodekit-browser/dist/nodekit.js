var NodeKit = (function(exports) {
  "use strict";
  function play() {
    console.log("Hello, NodeKit!");
  }
  exports.play = play;
  Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
  return exports;
})({});
