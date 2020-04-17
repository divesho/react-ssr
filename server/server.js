import express from 'express';
import fs from 'fs';
import path from 'path';

import React from 'react';
import ReactDomServer from 'react-dom/server';

import App from './../src/App';

const app = express();
const port = 8080;

app.listen(port, () => {
    console.log(`server listening at port ${port}`);
});

app.use(express.static(path.resolve(__dirname, '..', 'build')))

app.use('^/$', (req, res, next) => {
    fs.readFile(path.resolve("./build/index.html"), 'utf-8', (err, data) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Some error occured")
        }

        return res.send(data.replace(
                '<div id="root"></div>',
                `<div id="root">${ReactDomServer.renderToString(<App />)}</div>`
            ))
    })
})