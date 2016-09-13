
import { sayHello } from "./sayHello"
import { getRandomCatFact } from "./getRandomCatFact"

sayHello();
getRandomCatFact().then(function(fact) {
    console.log(fact);
});

