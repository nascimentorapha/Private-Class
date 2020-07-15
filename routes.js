const express = require('express')
const routes = express.Router()
const teachers = require('./controllers/teachers.js')
const students = require('./controllers/students.js')

routes.get("/", function(req, res){
    return res.redirect("/teachers")
})
routes.get('/teachers', teachers.index)
routes.get('/teachers/create', function (req, res){
    return res.render("teachers/create")
})
routes.get('/teachers/:id', teachers.show)
routes.get('/teachers/:id/edit', teachers.edit)
routes.post('/teachers', teachers.post)
routes.put('/teachers', teachers.put)
routes.delete('/teachers', teachers.delete)


routes.get('/students', students.index)
routes.get('/students/create', students.create)


routes.use(function(req, res) {
    res.status(404).render("not-found");
});

module.exports = routes