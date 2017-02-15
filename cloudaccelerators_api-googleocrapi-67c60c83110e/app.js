'use strict';

const express = require('express');
const config = require('./config');
const router = require('./routes/route');
const log4js = require('log4js');
const fs = require('fs');
const cors=require('cors');

let server = express();

// setup logging...
let logger = log4js.configure(config.LOG_INFO);

// use middleware.
server.use(cors());
server.use(config.ROUTE_VIRTUAL_DIR + '/', router(config, log4js.getLogger()));

// start the server
server.listen(config.SERVER_PORT, ()=>{
    console.log('OCR restful service started on port ' + config.SERVER_PORT);
});