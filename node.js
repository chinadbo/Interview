const EventEmitter = require("events");

let emitter = new EventEmitter();

/**

emitter.on('myEvent', () => {
  console.log('hi 1');
});

emitter.on('myEvent', () => {
  console.log('hi 2');
});

 *
 hi 1
 hi 2
 */

/**
emitter.on('myEvent', () => {
  console.log('hi 1');
  emitter.emit('myEvent');
});
*
RangeError: Maximum call stack size exceeded
*/

/**
emitter.on("myEvent", function fn() {
  console.log("hi");
  emitter.emit("myEvent", fn);
});
RangeError: Maximum call stack size exceeded
*/
emitter.emit("myEvent");
