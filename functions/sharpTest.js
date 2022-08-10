import { Storage } from "@google-cloud/storage";
import sharp from "sharp";

const bucket = "codecamp-backend04-storage";
const storage = new Storage({
  projectId: "codecamp-backend04",
  keyFilename: "gcp-file-storage.json",
}).bucket(bucket);

let filename = "./library.jpeg";
const input = `./testImgs/${filename}`;

if (filename.includes("thumb")) {
  console.log("hi");
  throw new Error("error!");
}

filename = filename.replace(".jpg", "");
filename = filename.replace(".jpeg", "");

sharp(input)
  .resize({ width: 320 })
  .toFile(`./thumb/${filename}.png`)
  .then((data) => {
    // 320 pixels wide, auto-scaled height
    console.log(data);
  })
  .catch((e) => {
    throw new Error(e);
  });
