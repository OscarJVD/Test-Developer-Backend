const isValidEmail = require('is-valid-email');
const isPhone = require('is-phone');
const isValidUsername = require('is-valid-username');
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLNY_KEY,
  api_secret: process.env.CLNY_SECRET,
});

const getMyCollections = mongoose => new Promise((resolve, reject) => {
  try {
    mongoose.connection.db.listCollections().toArray().then(collections => {
      const names = collections.map(col => col.name);
      resolve(names);
    })

  } catch (error) {
    console.log(error)
    console.log(util.inspect(error))
  }
});

function isEmailTelOrUserName(value) {
  if (isValidEmail(value)) return 'email';
  if (isPhone(value)) return 'tel';
  if (isValidUsername(value)) return 'username';
  const userRegex = new RegExp("^[a-zA-Z0-9]+$");
  if (!userRegex.test(value)) return 'usernameerror';
  return 'error';
}

function getRandomNum(min, max) {
  return parseInt(Math.random() * (max - min) + min);
}

function sort(object) {
  // Don't try to sort things that aren't objects
  if (typeof object != "object") {
    return object;
  }

  // Don't sort arrays, but do sort their contents
  if (Array.isArray(object)) {
    object.forEach(function (entry, index) {
      object[index] = sort(entry);
    });
    return object;
  }

  console.log(object)
  // Sort the keys
  let newObject = {};
  if (object) {
    let keys = Object.keys(object);
    keys.sort(function (a, b) {
      let atype = typeof object[a],
        btype = typeof object[b],
        rv;
      if (atype !== btype && (atype === "object" || btype === "object")) {
        // Non-objects before objects
        rv = atype === 'object' ? 1 : -1;
      } else {
        // Alphabetical within categories
        rv = a.localeCompare(b);
      }
      return rv;
    });

    // Create new object in the new order, sorting
    // its subordinate properties as necessary
    keys.forEach(function (key) {
      newObject[key] = sort(object[key]);
    });
  }
  return newObject;
}

async function uploadToCloudinary(locaFilePath) {

  // locaFilePath: path of image which was just
  // uploaded to "uploads" folder

  var mainFolderName = "main";
  // filePathOnCloudinary: path of image we want
  // to set when it is uploaded to cloudinary
  var filePathOnCloudinary =
    mainFolderName + "/" + locaFilePath;

  return cloudinary.uploader
    .upload(locaFilePath, { public_id: filePathOnCloudinary })
    .then((result) => {

      // Image has been successfully uploaded on
      // cloudinary So we dont need local image 
      // file anymore
      // Remove file from local uploads folder
      fs.unlinkSync(locaFilePath);

      return {
        message: "Success",
        url: result.url,
      };
    })
    .catch((error) => {

      // Remove file from local uploads folder
      fs.unlinkSync(locaFilePath);
      return { message: "Fail" };
    });
}

module.exports = { isEmailTelOrUserName, getRandomNum, sort, getMyCollections, uploadToCloudinary };
