const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const DB = require('./models');
const app = express();
const path = require('path');
const router = express.Router();
const { allmembers } = require('./models');
const { admin } = require('./models');
const { subfield } = require('./models');
const { field } = require('./models');
const { indicator } = require('./models');
const { databib } = require('./models');
const { highschoollvl } = require('./models');


const PORT = process.env.PORT || 5000;

//request parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("Hello World");
});

//get all
app.get('/allmembers', (req, res) => {
    allmembers.findAll().then((user) => {
        res.send(user);
    })
});
app.get('/alladmin', (req, res) => {
    admin.findAll().then((user) => {
        res.send(user);
    })
});
app.get('/allsubfield', (req, res) => {
    subfield.findAll().then((user) => {
        res.send(user);
    })
});
app.get('/allfield', (req, res) => {
    field.findAll().then((user) => {
        res.send(user);
    })
});
app.get('/allindc', (req, res) => {
    indicator.findAll().then((user) => {
        res.send(user);
    })
});
app.get('/allindc/:order', (req, res) => {
    indicator.findAll({
        where:{
            order:req.params.order
        }
    }).then((user) => {
        res.send(user);
    })
});
app.get('/alldbib', (req, res) => {
    databib.findAll().then((user) => {
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


