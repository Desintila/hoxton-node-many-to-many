import Database from "better-sqlite3";

const db = new Database('./database.db', {
    verbose: console.log
})

const applicants = [
    {
        name: 'Desintila',
        email: 'desintila@email.com'
    },
    {
        name: 'Denis',
        email: 'denis@email.com'
    },
    {
        name: ' Fjona',
        email: 'fjona@email.com'
    },
    {
        name: 'Pamela',
        email: 'pamela@email.com'
    },
    {
        name: 'Bijona',
        email: 'bijona@email.com'
    }
]

const interviewers = [
    {
        name: 'Ani',
        email: 'ani@email.com'
    },
    {
        name: 'Arber',
        email: 'arber@email.com'
    },
    {
        name: 'Ajla',
        email: 'ajla@email.com'
    },
    {
        name: 'Ina',
        email: 'ina@email.com'
    },
    {
        name: 'Besa',
        email: 'besa@email.com'
    }
]

const interviews = [
    {
        "applicantId": 1,
        "interviewerId": 1,
        "date": '22/02/2022',
        "score": 80.5
    },
    {
        "applicantId": 1,
        "interviewerId": 2,
        "date": '20/02/2022',
        "score": 75
    },
    {
        "applicantId": 2,
        "interviewerId": 2,
        "date": '10/02/2022',
        "score": 40
    },
    {
        "applicantId": 2,
        "interviewerId": 5,
        "date": '1/02/2022',
        "score": 50.4
    },
    {
        "applicantId": 2,
        "interviewerId": 4,
        "date": '8/01/2022',
        "score": 62.4
    },
    {
        "applicantId": 3,
        "interviewerId": 3,
        "date": '10/01/2022',
        "score": 55.5
    },
    {
        "applicantId": 4,
        "interviewerId": 5,
        "date": '15/02/2022',
        "score": 78.5
    },
    {
        "applicantId": 4,
        "interviewerId": 3,
        "date": '10/02/2021',
        "score": 89.1
    },
    {
        "applicantId": 5,
        "interviewerId": 5,
        "date": '21/02/2022',
        "score": 56.8
    },
    {
        "applicantId": 5,
        "interviewerId": 2,
        "date": '05/02/2022',
        "score": 35.2
    },
]



db.exec(`
DROP TABLE IF EXISTS interviews;
DROP TABLE IF EXISTS applicants;
DROP TABLE IF EXISTS interviewers;
`)


const createApplicants = db.prepare(`
CREATE TABLE applicants(
id INTEGER PRIMARY KEY,
name TEXT NOT NULL,
email TEXT
);
`)

const createInterviewers = db.prepare(`
CREATE TABLE  interviewers(
id INTEGER PRIMARY KEY,
name TEXT NOT NULL,
email TEXT
);
`)

const createInterviews = db.prepare(`
CREATE TABLE interviews(
id INTEGER PRIMARY KEY,
applicantId INTEGER,
interviewerId INTEGER,
date TEXT NOT NULL,
score REAL NOT NULL,
FOREIGN KEY (applicantId) REFERENCES applicants(id),
FOREIGN KEY (interviewerId) REFERENCES interviewers(id)
);
`)

createApplicants.run()
createInterviewers.run()
createInterviews.run()


const createApplicant = db.prepare(`
INSERT INTO applicants(name,email) VALUES (?,?);
`)

const createInterviewer = db.prepare(`
INSERT INTO interviewers(name,email) VALUES (?,?);
`)

const createInterview = db.prepare(`
INSERT INTO interviews(applicantId,interviewerId,date,score) VALUES (?,?,?,?);
`)

for (const applicant of applicants) {
    createApplicant.run(applicant.name, applicant.email)
}

for (const interviewer of interviewers) {
    createInterviewer.run(interviewer.name, interviewer.email)
}

for (const interview of interviews) {
    createInterview.run(interview.applicantId, interview.interviewerId, interview.date, interview.score)
}