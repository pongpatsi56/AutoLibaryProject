const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const DB = require('./models');
const app = express();
const path = require('path');
const router = express.Router();

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

const { allmembers } = require('./models');

app.get('/all', (req, res) => {
    allmembers.findAll().then((user)=>{
        res.send(user);
    })
});


app.get('/add', (req, res) => {
    allmembers.create({
        member_ID:"56543206025-1",
        mem_Citizenid:"15099273649172",
        FName:"Phongphat",
        LName:"Singlek",
        Username:"pongpat_si56",
        Password:"123456",
        Position:"student",
        mem_type:"2"
    }).catch((err)=>{if (err) { console.log(err);}})
});
app.delete('/del', (req, res) => {
    res.send("del");
});
app.put('/put', (req, res) => {
    res.send("put");
});


DB.sequelize.sync().then((req) => {
    app.listen(PORT, err => {
        if (err) return console.log('Cannot lisening at port:', PORT);
        console.log('Server listening on port:', PORT);
    })
});


