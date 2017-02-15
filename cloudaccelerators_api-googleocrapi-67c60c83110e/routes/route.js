'use strict';

const express = require('express');
const promise = require('bluebird');
const router = express.Router();


module.exports = (config, logger)=>{
    const lib = require('../lib/lib')(config);

    // important in order to send request to next middleware...
    router.use((req,res, next)=>{
        console.log('Req time: ' + Date.now());
        next();
    });

   function handleError(err, req, res){
        logger.error(req.url);
        logger.error(err);
        return res.status(500).send(err);
    }

    // route: ~/processImage?imageUrl=<imageurl>
    router.get('/processImageUrl', (req, res)=>{
        if (!req.query.imageUrl)
            return res.status(400).send('please specify image URL');

        var option = true;    

        return lib.detectText(req.query.imageUrl, option)
            .then((data)=>{
                return res.status(200).send(data);
            })
            .catch((err)=>{
                return handleError(err, res);
            });
    });

    // TODO...
    /*
    router.get('/processImage', (req, res)=>{
        if (!req.query.imageLoc)
            return res.status(400).send('please specify image lication.');
    });
    */ 

    return router;
};