'use strict';

const express = require('express');
const promise = require('bluebird');
const multer = require('multer');
const fs = require('fs');
const _ = require('underscore');
const router = express.Router();
const fileSys = promise.promisifyAll(fs);

module.exports = (config, logger)=>{
    const storage = require('../lib/storage')(config);
    
    let options = multer.diskStorage({
        destination: (req, file, cb)=>{
            cb(null, config.UPLOAD_DIR);
        },
        filename: (req, file, cb)=>{
            cb(null, file.originalname);
        }
    });

    let upload = multer({storage: options});

    function handleError(err, req, res){
        logger.error(req.url);
        logger.error(err);
        return res.status(500).send(err);
    }
    
    // create bucket...
    router.post('/storage', (req, res)=>{
        if (!req.query.bucketname)
            return res.status(400).send('a bucketname must be specified');

        return storage.createBucket(req.query.bucketname)
            .then((result)=>{
                return res.status(200).send(_.pluck(result, 'metadata'));
            })
            .catch((err)=>{
                return handleError(err, req, res);
            });
    });
  
    // remove bucket...
    router.delete('/storage', (req, res)=>{
        if (!req.query.bucketname)
            return res.status(400).send('a bucketname must be specified');

        return storage.deleteBucket(req.query.bucketname)
            .then((result)=>{
                var resData = _.pluck(result, 'metadata')
                return res.status(200).send(resData);
            })
            .catch((err)=>{
                return handleError(err, req, res);
            });  
    });

    // upload file...
    router.post('/storage/:bucket', upload.single('file'), (req, res)=>{

        if (!req.file)
            return res.status(400).send('please specify a file to upload.');
        
        return fileSys.accessAsync(req.file.path, fs.R_OK)
            .then(()=>{
                return storage.uploadFile(req.params.bucket, req.file.path);
            })          
            .then((result)=>{
                return res.status(200).send(_.pick(result, 'metadata'));
            })
            .then((result)=>{
              // TODO: cleanup
              return result;
            })
            .catch((err)=>{
                return handleError(err, req, res);
            });
    });

    // download file...
    router.get('/storage/:bucket', (req, res)=>{
        if (!req.query.filename)
            return res.status(400).send('a filename must be specified');

        return storage.downloadFile(req.params.bucket,req.query.filename)
            .then((result)=>{
                res.setHeader('Content-Disposition', 'attachment; filename=' + req.query.filename);
                result.pipe(res);
                return res;
            })
            .catch((err)=>{
                return handleError(err, req, res);
            });
    });

    // delete file...
    router.delete('/storage/:bucket', (req, res)=>{
        if (!req.query.filename)
            return res.status(400).send('a filename must be specified');

        return storage.deleteFile(req.params.bucket,req.query.filename)
            .then((result)=>{
                return res.status(200).send(_.pluck(result, 'metadata'));
            })
            .catch((err)=>{
                return handleError(err, req, res);
            }); 
    });

    // list files in a bucket...
    router.get('/storage/:bucket/ls', (req, res)=>{
        return storage.listFiles(req.params.bucket)
            .then((result)=>{
                return res.status(200).send( _.pluck(result, 'metadata'));
            })
            .catch((err)=>{
                return handleError(err, req, res);
            });
    });

    return router;
};