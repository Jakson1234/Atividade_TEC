const express = require("express");
const app = express();
const bodyParser = require('body-parser')
const Core = require("./core");
new Core();

const User = require("./schema/user");

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get("/users", async (req, res)=>{
    const user = await User.find({age:req.query.age});
    return res.status(200).json({
        data: user,
    });
});

app.get("/users/:id", async(req, res)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return res.status(404).json({"error": "Usuario não encontrado"});
    }
    return res.status(200).json({
        data: user
    });
});
app.get("/users/findByCell", async (req, res) => {
    const user = await User.findOne({ cell: req.query.cell });
    if (!user) {
        return res.status(404).json({ "error": "Usuario não encontrado" });
    }
    return res.status(200).json({
        data: user
    });
});

app.post("/users", async (req, res)=>{
    if((await User.findById(req.body.id))) {
        return res.status(400).json({error: "Id ja existe na base de dados"});
    }
   if(String(req.body.cell).length > 11) {
       return res.status(400).json({ error: "cell tem mais de 11 caracteres" });
    }
    if (String(req.body.cell).length < 11) {
        return res.status(400).json({ error: "cell tem menos de 11 caracteres" });
    }
    const user = {
        name: req.body.name,
        cpf: req.body.cpf,
        age: req.body.age,
        cell: req.body.cell
    };
    await (new User(user).save());
    return res.status(200).json({data: user});
});

app.patch("/users/:id", async(req, res)=>{
    const user = await User.findById(req.params.id);
    if(!user) {
        return res.status(404).json({
            error: "Usuario não encontrado"
        });
    }
    const {cell} = req.body
    if(String(cell).length != 11) {
       return res.status(400).json({ error: "cell tem mais de 11 caracteres" });
    }
    await user.updateOne(req.body);
    return res.status(200).json({data: req.body});
});

app.delete("/users/:id", async (req, res)=>{
    return res.status(200).json({
        data: (await User.findOneAndRemove({_id: req.params.id}))
    });
});

app.listen(3000, ()=>{
    console.log("Server Started");
});