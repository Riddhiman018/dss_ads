const S3 = require('aws-sdk/clients/s3')
const fs = require('fs')

const s3 = new aws.S3({
    accessKeyId: "AKIAVAR7LPOHXP7CV5AZ",
    secretAccessKey: "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",
    region: "ap-south-1",
  });
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