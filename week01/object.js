'use strict';

const movie = {
    title: 'Inception',
    genre: 'sci-fi',
    duration: 180
}

console.log(movie);
console.log(movie['title']);
console.log(movie.title);

movie.director = 'Nolan';
console.log(movie);

delete movie.genre;

for(const prop in movie)
    console.log(`${prop} is ${movie[prop]}`);

const sameMovie = Object.assign({}, movie);
console.log(sameMovie);

Object.assign(movie, {budget: '1 million USD'});
console.log(movie);

const improvedMovie = Object.assign({}, movie, {cast: '...'});
console.log(improvedMovie);

const inceptionAgain = {... movie};     //it creates a new object