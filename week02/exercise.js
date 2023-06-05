"use strict";

const dayjs = require("dayjs");

const currentDate = dayjs("2023-03-07"); //give the current date
console.log(currentDate);

function Answer(text, name, date, score = 0) {
	this.text = text;
	this.name = name;
	this.date = dayjs(date);
	this.score = score;

	this.toString = () => {
		return `${this.name} replied ${this.text} on ${this.date.format(
			"YYYY-MM-DD"
		)} with a score of ${this.score}`;
	};
}

function Question(text, name, date) {
	this.text = text;
	this.name = name;
	this.date = dayjs(date);
	this.answers = [];

	this.add = (answer) => {
		this.answers.push(answer);
	};

	/* ALTERNATIVE METHOD */
	/*
    this.findAll = (name) => {
        const foundAnswers = [];

        for(const a of this.answers)
            if(a.name === name)
                this.foundAnswers.push(a);

        return foundAnswers;
    }*/

	this.findAll = (name) => this.answers.filter((a) => a.name === name);

	this.afterDate = (date) => this.answers.filter((a) => a.date.isAfter(date));

	this.listByDate = () => {
		// we create a copy (spread operator) of the original array, sort it, and return it
		return [...this.answers].sort((a, b) => a.date.diff(b.date));
	};

	this.listByScore = () => {
		return [...this.answers].sort((a, b) => b.score - a.score);
	};

	this.toString = () => {
		return `Question ${this.name} asked by ${
			this.text
		} on ${this.date.format("YYYY-MM-DD")}.
                    It received ${this.answers.length} answers so far: ${
			this.answers
		}.`;
	};
}

const question = new Question(
	"Is JS better than python?",
	"Mario Rossi",
	"2023-02-07"
);
const firstAnswer = new Answer("Yes", "Luca", "2023-02-15");
const secondAnswer = new Answer(
	"Not in a million year",
	"Guido van Rossum",
	"2023-03-02"
);
const thirdAnswer = new Answer("No", "Mario Rossi", "2023-03-02");

question.add(firstAnswer);
question.add(secondAnswer);
question.add(thirdAnswer);

console.log("Answers by Luca: " + question.findAll("Luca"));
console.log("\nAfter February: " + question.afterDate("2023-02-28"));
console.log("\nList by date: " + question.listByDate());
console.log("\nList by score: " + question.listByScore());
