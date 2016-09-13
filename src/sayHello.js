var gpio = require('rpi-gpio');
gpio.setup(7, gpio.DIR_OUT);
console.log("setup");
 
export function sayHello() {
    console.log("Hello");

    gpio.write(7, true, function(err) {
        if (err) throw err;
        console.log('Written to pin');
    });
}
