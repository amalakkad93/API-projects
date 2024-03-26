const AWS = require('aws-sdk');
const multer = require('multer');
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { Upload } = require("@aws-sdk/lib-storage");
const path = require("path");
const fs = require('fs');
const util = require('util');
const { v4: uuidv4 } = require('uuid');

const s3 = new AWS.S3({ apiVersion: '2012-10-17' });
const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET,
  },
});

// Storage configuration for multer
const storage = multer.memoryStorage();

// Single file upload using multer
const singleMulterUpload = (nameOfFileField) => multer({ storage }).single(nameOfFileField);

// Upload a single file to S3
const singleFileUpload = async (file, isPublic = false) => {

  const Key = `${uuidv4()}-${new Date().getTime()}${path.extname(file.originalname)}`;
  const uploadParams = {
    Bucket: process.env.S3_BUCKET,
    Key,
    Body: file.buffer,
    ACL: isPublic ? 'public-read' : undefined,
  };

  try {
    await s3Client.send(new PutObjectCommand(uploadParams));
    return `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${Key}`;
  } catch (error) {
    console.error("Error uploading file: ", error);
    throw new Error("Error uploading file");
  }
};

//
const multipleMulterUpload = (nameOfFileField) => multer({ storage }).array(nameOfFileField);

// Function to upload multiple files to S3
const multipleFilesUpload = async (files, isPublic = false) => {
  try {
    const uploadPromises = files.map((file) =>
    singleFileUpload(file, isPublic)
    );
    const uploadResults = await Promise.all(uploadPromises);
    return uploadResults;
  } catch (error) {
    console.error("Error uploading multiple files: ", error);
    throw new Error("Error uploading multiple files");
  }
};


// Retrieve a private file from S3
const retrievePrivateFile = async (Key) => {
  try {
    const url = await getSignedUrl(s3Client, new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key,
    }), { expiresIn: 3600 });
    return url;
  } catch (error) {
    console.error("Error generating signed URL: ", error);
    throw new Error("Error retrieving file");
  }
};

module.exports = {
  s3,
  singleFileUpload,
  multipleFilesUpload,
  retrievePrivateFile,
  singleMulterUpload,
  multipleMulterUpload
};





// const AWS = require('aws-sdk');
// const multer = require('multer');
// const path = require('path');

// // Configure AWS to use your credentials
// AWS.config.update({
//   accessKeyId: process.env.S3_KEY,
//   secretAccessKey: process.env.S3_SECRET
// });

// const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
// const NAME_OF_BUCKET = process.env.S3_BUCKET;

// const singleFileUpload = async ({ file, public = false }) => {
//   const { originalname, buffer } = file;
//   // Set the name of the file in your S3 bucket to the date in ms plus the
//   // extension name.
//   const Key = new Date().getTime().toString() + path.extname(originalname);
//   const uploadParams = {
//     Bucket: NAME_OF_BUCKET,
//     Key: public ? `public/${Key}` : Key,
//     Body: buffer
//   };
//   const result = await s3.upload(uploadParams).promise();
//   // Return the link if public. If private, return the name of the file in your
//   // S3 bucket as the key in your database for subsequent retrieval.
//   return public ? result.Location : result.Key;
// };

// const multipleFilesUpload = async ({ files, public = false }) => {
//   return await Promise.all(
//     files.map(file => {
//       return singleFileUpload({ file, public });
//     })
//   );
// };

// const retrievePrivateFile = key => {
//   let fileUrl;
//   if (key) {
//     fileUrl = s3.getSignedUrl('getObject', {
//       Bucket: NAME_OF_BUCKET,
//       Key: key
//     });
//   }
//   return fileUrl || key;
// };

// const storage = multer.memoryStorage({
//   destination: function (req, file, callback) {
//     callback(null, "");
//   }
// });

// const singleMulterUpload = (nameOfKey) =>
//   multer({ storage: storage }).single(nameOfKey);
// const multipleMulterUpload = (nameOfKey) =>
//   multer({ storage: storage }).array(nameOfKey);

// module.exports = {
//   s3,
//   singleFileUpload,
//   multipleFilesUpload,
//   retrievePrivateFile,
//   singleMulterUpload,
//   multipleMulterUpload
// };
