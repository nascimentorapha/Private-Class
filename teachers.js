const fs = require('fs') //filesystem
const data = require('./data.json')

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
        education_level,
        class_type,
        classes,
        avatar_url,
        created_at,
    }) //push incrementa objeto no array
    

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){ //criação do arquivo
        if (err) //tratamento de erro                           //JSON com os dados do login
            return res.send("Write file error")

        return res.redirect("/teachers")
    })

}