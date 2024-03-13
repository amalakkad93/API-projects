const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { Upload } = require("@aws-sdk/lib-storage");
const path = require("path");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET,
  },
});

const uploadFile = async ({ file, isPublic = false }) => {
  const Key = `${new Date().getTime()}${path.extname(file.originalname)}`;
  const uploadParams = {
    Bucket: process.env.S3_BUCKET,
    Key,
    Body: file.buffer,
    ACL: isPublic ? 'public-read' : undefined,
  };

  try {
    const parallelUploads3 = new Upload({
      client: s3Client,
      params: uploadParams,
    });

    await parallelUploads3.done();
    return `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${Key}`;
  } catch (error) {
    console.error("Error uploading file: ", error);
    throw new Error("Error uploading file");
  }
};

const getSignedUrlForGetObject = async ({ Key, Expires = 3600 }) => {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn: Expires });
};

module.exports = {
  uploadFile,
  getSignedUrlForGetObject,
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
