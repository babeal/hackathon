import * as Rx from "rxjs/Rx";
import {flashLED} from "./flashLED";
import {getRandomCatFact} from "./getRandomCatFact";

var gpio = require('rpi-gpio');

var buzzerPin = 12;
var ledRedPin = 16;
var ledGreenPin = 18;
var buttonPin = 32;
var joystickXPin = 33;
var joystickYPin = 29;
var joystickButtonPin = 31;
var distanceTriggerPin = 11;
var distanceEchoPin = 13;
 
gpio.setup(ledRedPin, gpio.DIR_OUT, write);
gpio.setup(buzzerPin, gpio.DIR_OUT, initBuzzer);
gpio.setup(joystickButtonPin, gpio.DIR_IN, gpio.EDGE_BOTH);
gpio.setup(buttonPin, gpio.DIR_IN, gpio.EDGE_BOTH);
gpio.setup(joystickXPin, gpio.DIR_IN, readInput);
gpio.setup(distanceTriggerPin, gpio.DIR_OUT, triggerMeasureDistance);
gpio.setup(distanceEchoPin, gpio.DIR_IN, gpio.EDGE_BOTH);

// test code for the led flasher
// let flasher$ = flashLED(1, 500);
// let subscription = flasher$.subscribe(val => console.log(val));
// Rx.Observable.timer(5000).subscribe(_ => subscription.unsubscribe());


gpio.on('change', function(channel, value) {
	if (channel == 13) {
		calculateDistance(value);
	}

    // console.log('Channel ' + channel + ' value is now ' + value);
});

var previousValue = undefined;
var previousValueArray = [];
var ledSub = undefined;
var ledReady = false;
var isBlinking = false;
var buzzerReady = false;
var catFactNumber = 1;

function calculateDistance(value) {
  if (value == true) {
   previousValue = new Date();
}
 if (value == false) {
if (previousValue == undefined) return;
   var timeSpan = new Date() - previousValue
   previousValueArray.push(timeSpan);


   // console.log("measured time: " + timeSpan)
   previousValue = undefined;
   var shouldBlink = timeSpan < 15;


   if (previousValueArray.length > 5) {
      for (var i = 0; i < 4; i++) {
      	if (previousValueArray[i] < 15){
          shouldBlink = true;
          
        }
      }
      previousValueArray = previousValueArray.slice(1);
   }

   // console.log("array count: " + previousValueArray.length);
   // console.log("should blink: " + shouldBlink);

   if (!isBlinking && shouldBlink && ledReady && buzzerReady) {
       var flash$ = flashLED(ledRedPin, 500);
       ledSub = flash$.subscribe();
       isBlinking = true;
      gpio.write(buzzerPin, false, function(err) {
        if (err) throw err;
    });
    getRandomCatFact().then(text => { 
console.log("RANDOM CAT FACT #" + catFactNumber++ + ": " + text);
console.log("");
});

   } else if (isBlinking && !shouldBlink && ledReady && buzzerReady) {

	  if (ledSub != undefined) {
	    ledSub.unsubscribe();
	    ledSub = undefined;
	isBlinking = false;
gpio.write(buzzerPin, true, function(err) {
        if (err) throw err;
    });
  }
}

}
}


 
function readInput() {
    gpio.read(joystickXPin, function(err, value) {
        //console.log('The value is ' + value);
    });
}

function triggerMeasureDistance() {
  Rx.Observable.interval(1000).subscribe(_ => {
   gpio.write(distanceTriggerPin, true, function(err) {
       if (err) throw err;
      // console.log('Written to pin');
       setTimeout(()=> {
	gpio.write(distanceTriggerPin, false, function(err) {})
	}, 0.01);
   });
});
}

function measuredDistance() {
   gpio.read(distanceEchoPin, function(err, value) {
	// console.log("measure distance:" + value);
  }); 
}

function initBuzzer() {
  buzzerReady = true;



gpio.write(buzzerPin, true, function(err) {
	if (err) throw err;
	      // console.log('Written to pin');
  });
}


function write() {
  ledReady = true;



   // gpio.write(ledRedPin, false, function(err) {
   //     if (err) throw err;
   //     console.log('Written to pin');
   // });
}



//import { sayHello } from "./sayHello"

//sayHello();
