require('dotenv').config();

const http = require('http');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const routes = require('./app/routes');
routes.attachTo(app);

app.use((req, res, next) => {
    if ('body' in res) {
        res.status(200).send(res.body);
        return;
    }
    res.status(404).send('<h1>Resource not found!</h1>');
});
app.use((err, req, res, next) => {
    if(err.code) {
        res.status(err.code);
    }
    else {
        res.status(500);
    }
    if('message' in err) {
        res.send(err.message);
    }
    else {
        res.send(err);
    }
})

let server = http.createServer(app);
let port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});