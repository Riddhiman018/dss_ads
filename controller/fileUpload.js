const S3 = require('aws-sdk/clients/s3')
const fs = require('fs')

const s3 = new S3({
    accessKeyId: "AKIAVAR7LPOHXP7CV5AZ",
    secretAccessKey: "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",
    region: "ap-south-1",
  });
const uploadFile = (file)=>{
    const fileStream = fs.createReadStream(file.path)
    const BucketParams = {
        Bucket:'mologmedia',
        Body:fileStream,
        Key:file.filename
    }
    return s3.upload(BucketParams).promise()
}
module.exports = {
    uploadFile
}