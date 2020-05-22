const fs = require('fs') //filesystem
const Intl = require('intl')
const data = require('./data.json')
const { age, date } = require('./utils')

//show
exports.show = function (req, res){
    
    const { id } = req.params

    const foundTeacher = data.teachers.find(function(teacher){
        return teacher.id == id
    })

    if (!foundTeacher)
        return res.send("Teacher not found")
    
    const teacher ={
        ...foundTeacher, //coloca todos os campos do teacher
        birth: age(foundTeacher.birth), //corrige esses campos
        classes: foundTeacher.classes.split(","),
        created_at: new Intl.DateTimeFormat('pt-BR').format(foundTeacher.created_at),
    }

    return res.render("teachers/show", { teacher })
}



//create
exports.post = function (req, res){
    
    const keys = Object.keys(req.body) //Cria array com as chaves do submit

    for (key of keys){
        if (req.body[key] =="") //Validação das informações
            return res.send("Please fill all fields!")
    }

    let {avatar_url, name, birth, education_level, class_type, classes} = req.body //Busca somente informação específica

    birth = Date.parse(birth) //transforma p/ milissegundo a data
    const created_at = Date.now() //cria a data atual na criação do registro
    const id = Number(data.teachers.length + 1) //Cria o ID pro registro
    
    data.teachers.push({
        id,
        name,
        birth,
        avatar_url,
        education_level,
        class_type,
        classes,
        created_at,
    }) //push incrementa objeto no array
    

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){ //criação do arquivo
        if (err) //tratamento de erro                           //JSON com os dados do login
            return res.send("Write file error")

        return res.redirect("/teachers")
    })

}


//edit
exports.edit = function(req, res){
    const { id } = req.params /* "req.params" é o parametro id na rota */

    const foundTeacher = data.teachers.find(function(teacher){
        return teacher.id == id
    })

    if (!foundTeacher){
        return res.send("Teacher not found") // finaliza a localização
    }

    const teacher = {
        ...foundTeacher,
        birth: age(foundTeacher.birth),
        created_at: new Intl.DateTimeFormat('pt-BR').format(foundTeacher.created_at),
    }
    


    return res.render("teachers/edit", { teacher })
}

//put | update
exports.put = function(req,res){
    const { id } = req.body
    let index = 0

    const foundTeacher = data.teachers.find(function(teacher){
        return teacher.id == id
    })

    if (!foundTeacher){
        return res.send("Teacher not found") // finaliza a localização
    }

    const teacher = {
        ...foundTeacher,
        ...req.body,
        birth: Date.parse(birth),
    }

    data.teachers[index] = teacher

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err)
            return res.send ("Write error!")
        
        return res.redirect(`/teachers/${id}`)
    })

}