const { MongoClient, GridFSBucket } = require("mongodb");
const fs = require("fs");
const path = require("path");

const uri =
  "mongodb+srv://shivamarora:AB999AB@assetbharat.yle9m0h.mongodb.net/AssetBharat?retryWrites=true&w=majority";

async function uploadFilesToGridFS() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const database = client.db("AssetBharat");
    const bucket = new GridFSBucket(database);

    // Delete all documents from fs.chunks
    await database.collection("fs.files").deleteMany({});
    await database.collection("fs.chunks").deleteMany({});

    const dirPath = path.join(__dirname, "../Questions");
    const files = fs.readdirSync(dirPath);

    const uploadPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const filePath = path.join(dirPath, file);
        const uploadStream = bucket.openUploadStream(file);
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(uploadStream);
        uploadStream.on("finish", () => {
          console.log(`File ${file} uploaded successfully`);
          resolve();
        });
        uploadStream.on("error", reject);
      });
    });

    await Promise.all(uploadPromises);

    // Get all files in fs.files
    const allFiles = await database.collection("fs.files").find().toArray();
    console.log("All files in fs.files:");
    allFiles.forEach((file) => console.log(`Filename: ${file.filename}`));
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

uploadFilesToGridFS();
