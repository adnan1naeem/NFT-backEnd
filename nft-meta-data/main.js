var express = require("express");
const pinataSDK = require("@pinata/sdk");
var bodyParser = require("body-parser");
const router = express.Router();
const pinata = pinataSDK(
  "05c306c327884a5878f3",
  "67120cf8fd012968abe12fc56c271ffd26d085454a1427b4f5653bed2055f556"
);
const fs = require("fs");
var app = express({ limit: "50mb" });
app.use(express.static("files"));
const cors = require("cors");
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
const { callbackify } = require("util");
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
async function addJsonToIPFS(metaData) {
  try {
    const meta = await pinata.pinJSONToIPFS(metaData, {});
    return `https://gateway.pinata.cloud/ipfs/${meta.IpfsHash}`.toString();
  } catch (err) {
    throw new ApiError(httpStatus[400], "Error pinning meta data to ipfs");
  }
}

//function to upload image on pinata
async function addFilesToIPFS(photo, type) {
  const options = {
    pinataMetadata: {
      name: "test image",
    },
    pinataOptions: {
      cidVersion: 0,
    },
  };

  const imgData = await pinata.pinFileToIPFS(photo, options);
  //handle results here
  console.log(imgData);
  return `https://gateway.pinata.cloud/ipfs/${imgData.IpfsHash}`.toString();
}

//api calling
app.route("/metadata").post(abc);

async function abc(req, res) {
  console.dir(req.body);

  try {
    const metaUrl = await addJsonToIPFS({
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
      price: req.body.price,
      offer: req.body.offer,
    });
    console.log("metaUrl is ", metaUrl);
    res.send({ metaUrl: metaUrl });
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, multipart/form-data"
    );
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
  }
}

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
