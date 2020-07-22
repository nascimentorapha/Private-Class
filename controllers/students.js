const fs = require('fs') //filesystem
const Intl = require('intl')
const data = require('../data.json')
const { age, date } = require('../utils')

//index
exports.index = function (req, res){
    return res.render("students/index", { students: data.students } )
}

//show
exports.show = function (req, res){
    
    const { id } = req.params

    const foundStudent = data.students.find(function(student){
        return student.id == id
    })

    if (!foundStudent)
        return res.send("Student not found")
    
    const student ={
        ...foundStudent, //coloca todos os campos do student
        birth: age(foundStudent.birth), //corrige esses campos
        created_at: new Intl.DateTimeFormat('pt-BR').format(foundStudent.created_at),
    }

    return res.render("students/show", { student })
}

//new
exports.create = function (req, res){
    return res.render('students/create')
}

//create
exports.post = function (req, res){
    
    const keys = Object.keys(req.body) //Cria array com as chaves do submit

    for (key of keys){
        if (req.body[key] =="") //Validação das informações
            return res.send("Please fill all fields!")
    }

    let {avatar_url, name, birth, email, gender, school_year, hours_week} = req.body //Busca somente informação específica

    birth = Date.parse(birth) //transforma p/ milissegundo a data
    const created_at = Date.now() //cria a data atual na criação do registro
    const id = Number(data.students.length + 1) //Cria o ID pro registro
    
    data.students.push({
        id,
        name,
        birth,
        email,
        gender,
        avatar_url,
        school_year,
        hours_week,
        created_at,
    }) //push incrementa objeto no array
    

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){ //criação do arquivo
        if (err) //tratamento de erro                           //JSON com os dados do login
            return res.send("Write file error")

        return res.redirect("/students")
    })

}

//edit
exports.edit = function(req, res){
    const { id } = req.params /* "req.params" é o parametro id na rota */

    const foundStudent = data.students.find(function(student){
        return student.id == id
    })

    if (!foundStudent){
        return res.send("Student not found") // finaliza a localização
    }

    const student = {
        ...foundStudent,
        birth: date(foundStudent.birth),
        created_at: new Intl.DateTimeFormat('pt-BR').format(foundStudent.created_at),
        id: Number(foundStudent.id)
    }
    
    return res.render("students/edit", { student })
}

//put | update
exports.put = function(req, res){
    const { id } = req.body
    let index = 0

    const foundStudent = data.students.find(function(student, foundIndex){
        if (id == student.id){
            index = foundIndex
            return true
        }
    })

    if (!foundStudent){
        return res.send("Student not found") // finaliza a localização
    }

    const student = {
        ...foundStudent,
        ...req.body,
        birth: Date.parse(req.body.birth)
    }

    data.students[index] = student

    console.log(req.body.id)

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err)
            return res.send ("Write error!")
        
        return res.redirect(`/students/${id}`)
    })

}

//delete
exports.delete = function(req, res){
    const { id } = req.body

    const filteredStudents = data.students.filter(function(student){
        return student.id != id
    })

    data.students = filteredStudents

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err)
            return res.send("Write file error")
        
        return res.redirect("/students")
    })

}