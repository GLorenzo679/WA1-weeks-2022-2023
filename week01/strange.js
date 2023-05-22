/* Strange JS behaviors and where to find (some of) them */
"use strict";

const type = typeof NaN;
console.log("NaN is a " + type); //number
console.log(`NaN === NaN? ${NaN === NaN}\n`); //false

console.log(`NaN == NaN? ${NaN == NaN}\n`); //false
console.log(`null == null? ${null == null}\n`); //true
console.log(`undefined == undefined?
                ${undefined == undefined}\n`); //true

console.log(`null == false? ${null == false}`); //false
console.log(`'' == false? ${"" == false}`); //true
console.log(`3 == true? ${3 == true}\n`); //false
console.log(`0 == -0? ${0 == -0}\n`); //true

console.log(`true + true = ${true + true}`); //2
console.log(`true !== 1? ${true !== 1}`); //true

console.log(`5 + '10' = ${5 + "10"}\n`); //510 -> string

console.log(`1 < 2 < 3? ${1 < 2 < 3}`); //true
console.log(`3 > 2 > 1? ${3 > 2 > 1}\n`); //false

console.log(`0.2 + 0.1 === 0.3? ${0.2 + 0.1 === 0.3}\n`); //false -> (0.2 + 0.1 = 0.30000000004 != 0.3)

console.log("b" + "a" + +"a" + "a"); //baNaNa -> (ba + NaN + a)
