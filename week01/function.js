"use strict";

// CLASS
class Movie {
	constructor(title, genre, duration) {
		this.title = title;
		this.genre = genre;
		this.duration = duration;
		this.isLong = () => duration >= 120;
	}
}

// FUNCTION CONSTRUCTOR
//function Movie(title, genre, duration) {
//    this.title = title;
//    this.genre = genre;
//    this.duration = duration;
//    this.isLong = () => duration >= 120;
//}

let inception = new Movie("Inception", "sci-fi", 180);
let it = new Movie("IT", "horror", 90);

console.log(inception);
console.log(it.isLong());
