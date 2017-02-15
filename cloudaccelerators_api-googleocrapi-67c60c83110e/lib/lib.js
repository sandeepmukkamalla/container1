'use strict';

const promise = require('bluebird');

module.exports = (config)=>{

    // init the google API  wrapper...
    const vision = require('@google-cloud/vision')({
        projectId : config.GOOGLE_PROJECT_ID,
        keyFilename : config.GOOGLE_API_KEY_FILE
    });

    /**
    var makeServiceCall = (req)=>{
        return vision.detectText(req).then((res)=>{
                    if(res.responses[0].error)
                        return Promise.reject(JSON.stringify(res.responses[0].error));

                    return Promise.resolve(res.responses[0].textAnnotations);
                },(err)=>{
                    return Promise.reject(err);
                });
    };

    var annotateImageUrl = (imageUrl)=>{
        var req = new vision.Request({
                    image: new vision.Image({
                        "url": imageUrl
                    }),
                    features: [
                        new vision.Feature('TEXT_DETECTION',4)
                    ]
                });
        return makeServiceCall(makeServiceCall);        
    };

    var annotateImage = (imagePath)=>{
        var req = new vision.Request({
                    image: new vision.Image({
                        "url": imageUrl
                    }),
                    features: [
                        new vision.Feature('TEXT_DETECTION',4)
                    ]
                });
        return makeServiceCall(makeServiceCall);
    }; */

    var detectText = (image, verboseOption)=>{
        var option = {};
        if(verboseOption) option = { 'verbose' : true };

        return vision.detectText(image, option)
           .then((result)=>{
                return promise.resolve(result);
            })
            .catch((err)=>{
                return promise.reject(err);
            });
        
    };
    
    return {
        "detectText": detectText
    };
};