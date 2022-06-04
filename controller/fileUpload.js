const S3 = require('aws-sdk/clients/s3')
const fs = require('fs')

const s3 = new S3({
    region:'ap-south-1',
    accessKeyId:'AKIAVCSZ2D56JWCNDC5M',
    secretAccessKey:'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'   
})
const uploadFile = (file)=>{
    const fileStream = fs.createReadStream(file.path)
    const BucketParams = {
        Bucket:'mologds',
        Body:fileStream,
        Key:file.filename
    }
    return s3.upload(BucketParams).promise()
}

module.exports = {
    uploadFile
}