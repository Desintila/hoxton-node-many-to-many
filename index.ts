import Database from "better-sqlite3"
import cors from "cors"
import express from "express"

const app = express()
app.use(cors())
app.use(express.json())

const db = new Database('./database.db', {
    verbose: console.log
})

const getAllApplicants = db.prepare(`SELECT * FROM applicants;`)

const getAllInterviewers = db.prepare(`SELECT * FROM interviewers;`)

const getInterviewersForApplicant = db.prepare(`
SELECT DISTINCT interviewers.*, interviews.date,interviews.score FROM interviewers  JOIN interviews 
ON  interviewers.id=interviews.interviewerId WHERE interviews.applicantId=?; `)


const getApplicantsForInterviewer = db.prepare(`
SELECT DISTINCT applicants.*, interviews.date,interviews.score FROM  applicants JOIN interviews 
ON  applicants.id=interviews.applicantId WHERE interviews.interviewerId=?; `)


const createApplicant = db.prepare(`INSERT INTO applicants(name,email) VALUES(?,?);`)

const createInterviewer = db.prepare(`INSERT INTO interviewers(name,email) VALUES(?,?);`)

const createInterview = db.prepare(`INSERT INTO interviews(applicantId,interviewerId,date,score) VALUES(?,?,?,?);`)

const getApplicantById = db.prepare(`SELECT * FROM applicants WHERE id=?;`)

const getInterviewerById = db.prepare(`SELECT * FROM interviewers WHERE id=?;`)

const getInterviewById = db.prepare(`SELECT * FROM interviews WHERE id=?;`)

const deleteApplicant = db.prepare(`DELETE FROM applicants WHERE id=?;`)

const deleteInterviewer = db.prepare(`DELETE FROM interviewers WHERE id=?;`)

const deleteInterviewByApplicantId = db.prepare(`DELETE FROM interviews WHERE applicantId=?;`)

const deleteInterviewByInterviewerId = db.prepare(`DELETE FROM interviews WHERE interviewerId=?;`)

app.get('/applicants', (req, res) => {

    const applicants = getAllApplicants.all()

    for (const applicant of applicants) {
        const interviewers = getInterviewersForApplicant.all(applicant.id)
        applicant.interviews = interviewers
    }

    res.send(applicants)
})


app.get('/applicants/:id', (req, res) => {
    const id = req.params.id
    const applicant = getApplicantById.get(id)

    if (applicant) {

        const interviewers = getInterviewersForApplicant.all(applicant.id)
        applicant.interviews = interviewers

        res.send(applicant)
    }
    else {
        res.status(404).send({ error: 'Applicant not found' })
    }
})


app.get('/interviewers', (req, res) => {

    const interviewers = getAllInterviewers.all()

    for (const interviewer of interviewers) {
        const applicants = getApplicantsForInterviewer.all(interviewer.id)
        interviewer.applicants = applicants
    }

    res.send(interviewers)
})

app.get('/interviewers/:id', (req, res) => {
    const id = req.params.id
    const interviewer = getInterviewerById.get(id)

    if (interviewer) {
        const applicants = getApplicantsForInterviewer.all(interviewer.id)
        interviewer.applicants = applicants

        res.send(interviewer)
    }
    else {
        res.status(404).send({ error: 'Interviewer not found' })
    }
})


app.post('/applicants', (req, res) => {
    const { name, email } = req.body

    const errors = []

    if (typeof name !== 'string') errors.push('Name missing or not a string')
    if (typeof email !== 'string') errors.push('Email missing or not a string')

    if (errors.length === 0) {

        const result = createApplicant.run(name, email)

        const newApplicant = getApplicantById.run(result.lastInsertRowid)

        res.send(newApplicant)
    }
    else {
        res.status(400).send({ error: errors })
    }
})

app.post('/interviewers', (req, res) => {
    const { name, email } = req.body

    const errors = []

    if (typeof name !== 'string') errors.push('Name missing or not a string')
    if (typeof email !== 'string') errors.push('Email missing or not a string')

    if (errors.length === 0) {

        const result = createInterviewer.run(name, email)

        const newInterviewer = getInterviewerById.run(result.lastInsertRowid)

        res.send(newInterviewer)
    }
    else {
        res.status(400).send({ error: errors })
    }
})


app.post('/interviews', (req, res) => {
    const { applicantId, interviewerId, date, score } = req.body

    const errors = []

    if (typeof applicantId !== 'number') errors.push('ApplicantId missing or not a number')
    if (typeof interviewerId !== 'number') errors.push('InterviewerId missing or not a number')
    if (typeof date !== 'string') errors.push('Date missing or not a string')
    if (typeof score !== 'number') errors.push('Score missing or not a number')

    if (errors.length === 0) {

        const applicant = getApplicantById.get(applicantId)
        const interviewer = getInterviewerById.get(interviewerId)

        if (applicant && interviewer) {

            const result = createInterview.run(applicantId, interviewerId, date, score)

            const newInterview = getInterviewById.run(result.lastInsertRowid)

            res.send(newInterview)
        }
        else {
            res.status(404).send({ error: 'Applicant or Interviewer Not Found' })
        }
    }

    else {

        res.status(400).send({ error: errors })
    }
})



app.delete('/applicants/:id', (req, res) => {
    const id = req.params.id

    deleteInterviewByApplicantId.run(id)

    const result = deleteApplicant.run(id)

    if (result.changes !== 0) {
        res.send('Applicant deleted')
    }
    else {
        res.status(404).send({ error: 'Applicant not found' })
    }
})


app.delete('/interviewers/:id', (req, res) => {
    const id = req.params.id

    deleteInterviewByInterviewerId.run(id)

    const result = deleteInterviewer.run(id)

    if (result.changes !== 0) {
        res.send('Interviewer deleted')
    }
    else {
        res.status(404).send({ error: 'Interviewer not found' })
    }
})


app.listen(4000)