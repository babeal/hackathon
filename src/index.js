var gpio = require('rpi-gpio');
var buzzerPin = 12;
var ledRedPin = 16;
var ledGreenPin = 18;
 
gpio.setup(ledRedPin, gpio.DIR_OUT, write);
 
function write() {
    gpio.write(ledRedPin, false, function(err) {
        if (err) throw err;
        console.log('Written to pin');
    });
}



//import { sayHello } from "./sayHello"

//sayHello();
