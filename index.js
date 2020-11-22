const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const DB = require('./models');
const app = express();
const path = require('path');
const router = express.Router();
const { allmembers } = require('./models');


const PORT = process.env.PORT || 5000;

//request parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// http.createServer((req,res)=>{
//     res.writeHead(200,{"Content-Type":"text/plain"});
//     res.end("Hello world!!");
// }).listen(PORT);

app.get('/', (req, res) => {
    res.send("Hello World");
});

//get all
app.get('/all', (req, res) => {
    allmembers.findAll().then((user) => {
        res.send(user);
    })
});

// get single allmembers by member_ID
app.get("/find/:id", (req, res) => {
    allmembers.findAll({
        where: {
            member_ID: req.params.id
        }
    }).then(allmembers => res.send(allmembers));
});

// post new allmembers
app.post("/new", (req, res) => {
    allmembers.create({
        member_ID: req.body.memid, //"56543206025-1"
        mem_Citizenid: req.body.citid, //15099273649172",
        FName: req.body.fname, //"Phongphat",
        LName: req.body.lname, //"Singlek",
        Username: req.body.uname, //"pongpat_si56",
        Password: req.body.pass, //"123456",
        Position: req.body.posi, //"student",
        mem_type: req.body.memt //"2"
    }).then(allmembers => res.send(allmembers));
});

// delete allmembers
app.delete("/delete/:id", (req, res) => {
    allmembers.destroy({
        where: {
            id: req.params.id
        }
    }).then(() => res.send("success"));
});

// edit a allmembers
app.put("/edit", (req, res) => {
    allmembers.update(
        {
            text: req.body.text
        },
        {
            where: { id: req.body.id }
        }
    ).then(() => res.send("success"));
});


DB.sequelize.sync().then((req) => {
    app.listen(PORT, err => {
        if (err) return console.log('Cannot lisening at port:', PORT);
        console.log('Server listening on port:', PORT);
    })
});


