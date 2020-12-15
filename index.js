const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const DB = require('./models');
const app = express();
const logger = require('./middleware/logger');
// const { allmembers,admin,subfield,field,indicator,databib,highschoollvl } = require('./models');

const PORT = process.env.PORT || 5000;

// fix CORS on another client
app.use(cors());

//request parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Init MiddleWare
app.use(logger);

app.get('/', (req, res) => {
    res.send("Hello World");
});

/// bibdata api route ///
app.use("/bibdata",  require("./routes/Bibdata"));

/// marc helper route ///
app.use("/marc",  require("./routes/MarcData"));

/// login route ///
app.use("/userlogin",  require("./routes/Users"));


DB.sequelize.sync().then((req) => {
    app.listen(PORT, err => {
        if (err) return console.log('Cannot lisening at port:', PORT);
        console.log('Server listening on port:', PORT);
    })
});


