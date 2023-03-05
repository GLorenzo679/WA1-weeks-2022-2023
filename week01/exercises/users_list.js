'use strict';

const userString = 'Luigi De Russis, Luca Mannella, Fulvio Corno, Juan Pablo Saenz Moreno, Enrico Masala, Antonio Servetti, Eros Fani'
const acronimList = [];

const userArray = userString.split(', ');

for(const user of userArray) {
    const fields = user.split(" ")
    let acronim = "";
    
    for(const e of fields)
        acronim += e[0].toUpperCase();

    acronimList.push(acronim);
}

for(let i = 0; i < userArray.length; i++)
    console.log(`${acronimList[i]} - ${userArray[i]}`);





    