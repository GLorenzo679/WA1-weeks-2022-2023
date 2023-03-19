'use strict';

const dayjs = require('dayjs');
const sqlite = require('sqlite3');

const db = new sqlite.Database('questions.sqlite', (err) => { 
    if (err) throw err; 
});

function QuestionList() {
    this.addQuestion = function addQuestion(question) {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO question VALUES (?, ?, ?, ?)";

            db.run(sql, [question.id, question.text, question.author, question.date.toISOString()]);
        });
    }

    this.getQuestion = function getQuestion(id) {
        return new Promise((resolve, reject) => {
            console.log("Preparing for the query");
            const sql = "SELECT * FROM question WHERE id = ?";
            
            db.get(sql, [id], (err, row) => {
                if (err)
                    reject(err);
                else
                    resolve(row);
            })    
        });
    }

    this.addAnswer = function addAnswer(answer, questionId) {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO answer VALUES (?,?,?,?,?,?)";
            
            db.run(sql, [answer.id, answer.text, answer.author, answer.date, answer.score, questionId]);
        });
    }

    this.getAnswers = function getAnswers(questionId) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM answer WHERE id = ?";
            
            db.all(sql, [questionId], (err, rows) => {
                if (err)
                    reject(err);
                else
                    resolve(rows);
            })
        });
    }

    this.getTop = function getTop(num) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM answer ORDER BY score DESC LIMIT ?";
            
            db.all(sql, [num], (err, rows) => {
                if (err)
                    reject(err);
                else
                    resolve(rows);
            })
        });
    }

    this.afterDate = function afterDate(date) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM question WHERE date > ?";
            
            db.all(sql, [date.toISOString()], (err, rows) => {
                if (err)
                    reject(err);
                else
                    resolve(rows);
            }) 
        });
    }
}

function Answer(id, text, author, score, date) {
    this.id = id;
    this.text = text;
    this.author = author;
    this.score = score;
    this.date = dayjs(date);
}

function Question(id, text, author, date) {
    this.id = id;
    this.text = text;
    this.author = author;
    this.date = dayjs(date);
}

async function main(){
    const qList = new QuestionList();
    console.log("Question list created");
    
    const q1 = await qList.getQuestion(1);
    console.log("The first question is: ", q1);

    const question = new Question(3, "How to pass WebApp I?", "John Lennon", "2022-07-22");
    qList.addQuestion(question);

    const q3 = await qList.getQuestion(3);
    console.log("The third question is: ", q3);

    const question2 = new Question(4, "How to pass WebApp II?", "Mario Rossi", "2023-03-14")
    qList.addQuestion(question2);

    const q4 = await qList.getQuestion(4);
    console.log("The third question is: ", q4);

    const answer = new Answer(5, "Study", "JS developer", "2023-03-14", "150")
    qList.addAnswer(answer, q4.id);

    console.log(qList.getTop(2).then((rows) => {rows.forEach((row) => console.log(row));}));
}

main();
debugger;