'use strict';

const promise = require('bluebird');

module.exports = (config)=>{

    const storage = require('@google-cloud/storage')({
        projectId: config.GOOGLE_PROJECT_ID,
        keyFilename : config.GOOGLE_API_KEY_FILE
    });

    /** 
     * Craete a  bucket in Google cloud.
     * @param bucketName {string} - Google cloud bucket name that is to be craeted
     * @return {object}
    */
    var createBucket = (bucketName)=>{
        return storage.createBucket(bucketName)
        .then((result) => {
                return promise.resolve(result);
            })
            .catch((err)=>{
                return promise.reject(err);
            });
    };
    

    /** 
     * Delete a given bucket in Google cloud.
     * @param bucketName {string} - Google cloud bucket name that is to be deleted
     * @return {object}
    */
    var deleteBucket = (bucketName)=>{
        let bucket = promise.promisifyAll(storage.bucket(bucketName));
        
        return bucket.delete()
            .then((result) => {
                return promise.resolve(result);
            })
            .catch((err)=>{
                return promise.reject(err);
            });
   
    };
    
    
    /** 
     * Upload a file to a given bucket in google cloud.
     * @param bucketName {string} - Google cloud bucket name.
     * @param fileName {string} - File that needs to be uploaded.
     * @return {object}
    */
    var uploadFile = (bucketName, fileName)=>{
        let bucket = promise.promisifyAll(storage.bucket(bucketName));
       
        return bucket.uploadAsync(fileName)
            .then((result)=>{
                return promise.resolve(result);
            })
            .catch((err)=>{
                return promise.reject(err);
            });
    }; 

    /** 
     * Download a file from a given bucket in google cloud.
     * @param bucketName {string} - Google cloud bucket name.
     * @param fileName {string} - File that needs to be downloaded.
     * @return {object}
    */
    var downloadFile = (bucketName, fileName)=>{
        let bucket = storage.bucket(bucketName);
        let file =  promise.promisifyAll(bucket.file(fileName));

        return file.existsAsync()
            .then((result)=>{
                if(result)
                    return promise.resolve(file.createReadStream());
                else
                    return promise.reject("File does not exists in bucket.");
            })
            .catch((err)=>{
                return promise.reject(err);
            });
    };
     
    /** 
     * lists all the file in a given bucket in Google cloud.
     * @param bucketName {string} - Google cloud bucket name.
     * @return {object}
    */
    var listFiles = (bucketName)=>{
        let bucket = promise.promisifyAll(storage.bucket(bucketName));

        return bucket.getFilesAsync()
            .then((result)=>{
                return promise.resolve(result);
            })
            .catch((err)=>{
                return promise.reject(err);
            });
    };
     
    /** 
    * Delete a file from a given bucket in google cloud.
    * @param bucketName {string} - Google cloud bucket name.
    * @param fileName {string} - File that needs to be uploaded.
    * @return {object}
    */
    var deleteFile=(bucketName, fileName)=>{
        let bucket = promise.promisifyAll(storage.bucket(bucketName));
        let file =  promise.promisifyAll(bucket.file(fileName));
        
        return file.deleteAsync()
           .then((result) => {
                return promise.resolve(result);
            })
            .catch((err)=>{
                return promise.reject(err);
            });
     }; 
    

    return {
        "createBucket" : createBucket,
        "deleteBucket" : deleteBucket,
        "uploadFile" : uploadFile,
        "downloadFile" : downloadFile,
        "listFiles" : listFiles,
        "deleteFile":deleteFile
    };
};


     
    
    

    
    
    
    
    

   