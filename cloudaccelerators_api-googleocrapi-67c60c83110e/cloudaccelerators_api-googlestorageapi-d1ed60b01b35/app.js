'use strict';

const express = require('express');
const config = require('./config');
const router = require('./routes/route');
const bodyParser = require('body-parser');
const log4js = require('log4js');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

let server = express();

// setup logging...
!fs.exists(config.LOG_DIR) || fs.mkdir(config.LOG_DIR);

// add middlewares....
server.use(bodyParser.json());
server.use(cors());
server.use('public', express.static('public'));

let logger = log4js.configure(config.LOG_INFO);
server.use(config.ROUTE_VIRTUAL_DIR + '/', router(config, log4js.getLogger()));

// start the server
server.listen(config.SERVER_PORT, ()=>{
    console.log('OCR restful service started on port ' + config.SERVER_PORT);
});