const isValidEmail = require('is-valid-email');
const isPhone = require('is-phone');
const isValidUsername = require('is-valid-username');

function isEmailTelOrUserName(value) {
  if (isValidEmail(value)) return 'email';
  if (isPhone(value)) return 'tel';
  if (isValidUsername(value)) return 'username';
  return 'error';
}

function getEsDate(date, ret = "fulldate") {
  date = new Date(date);

  // let day = date.getDate().length === 1 ? '0' + date.getDate() : date.getDate();
  let day = date.getDate();
  let month = date.getMonth(),
    year = date.getFullYear(),
    options = { year: "numeric", month: "long", day: "numeric" },
    splitDate = new Date(year, month, day),
    esDate = splitDate.toLocaleDateString("es-ES", options);

  // console.log(esDate)

  esDate = esDate.replaceAll(" de ", " - ");

  let esTime = date.toLocaleTimeString("es-CO");

  if (ret == "onlydate") date = esDate;
  else date = esDate + " " + esTime;

  date = date.toString();

  if (ret == "onlydate") {
    if (date.indexOf("p.") > -1) date = date.slice(0, -9) + " PM";
    if (date.indexOf("a.") > -1) date = date.slice(0, -9) + " AM";
  }

  // console.log(date)

  return date;
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

  // Sort the keys
  var keys = Object.keys(object);
  keys.sort(function (a, b) {
    var atype = typeof object[a],
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
  var newObject = {};
  keys.forEach(function (key) {
    newObject[key] = sort(object[key]);
  });
  return newObject;
}

function getRandomNum(min, max) {
  return parseInt(Math.random() * (max - min) + min);
}

function capFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const removeDuplicateWords = s => s.replace(/(\b\S.+\b)(?=.*\1)/g, "").trim()

export { isEmailTelOrUserName, getEsDate, sort, capFirstLetter, getRandomNum, removeDuplicateWords };
