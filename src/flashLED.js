var gpio = require('rpi-gpio');
var Rx = require("rxjs/Rx");

// test code to make sure it works.
// var gpio = {
//     write:function(pin, value, callback) {
//         callback();
//     },
// };


export function flashLED(pin, duration) {
    return Rx.Observable.create(observer => {
        var id = setInterval(function () {
            gpio.write(pin, true, function (err) {
                observer.next(true);
                setTimeout(function () {
                    observer.next(false);
                    gpio.write(pin, false, function (err) {
                    });
                }, duration / 2);
            });
        }, duration);

        return () => {
           clearInterval(id);
            gpio.write(pin, false, function (err) {
            });
        }
    });
};

// test code for the led flasher
// let flasher$ = flashLED(1, 500);
// let subscription = flasher$.subscribe(val => console.log(val));
// Rx.Observable.timer(5000).subscribe(_ => subscription.unsubscribe());
