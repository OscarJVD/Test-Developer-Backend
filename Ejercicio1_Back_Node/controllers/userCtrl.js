const User = require("../models/userModel");
const { uploadToCloudinary } = require("../utils/functions");
const util = require("util");

const userCtrl = {
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select("-password");
      if (!user) return res.status(400).json({ msg: "Usuario no encontrado. Error: US001" });

      return res.json({ user });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateAvatar: async (req, res) => {
    console.log('req');
    console.log(util.inspect(req));

    // req.file is the `profile-file` file
    // req.body will hold the text fields,
    // if there were any

    // req.file.path will have path of image
    // stored in uploads folder
    let locaFilePath = req.file.path;

    // Upload the local image to Cloudinary 
    // and get image url as response
    let result = await uploadToCloudinary(locaFilePath);

    // Generate html to display images on web page.
    return res.json({ result, msg: 'Actualizado', error: false });
  },
  setUserName: async (req, res) => {
    try {
      const { username } = req.body;

      console.log(username);

      if (!username)
        return res.status(400).json({ msg: "Ingresa tu nombre de usuario." });

      const usernameValidation = isEmailTelOrUserName(username);

      if (usernameValidation == "error")
        return res.status(400).json({ msg: "Verifica tu nombre de usuario" });

      if (usernameValidation == "usernameerror")
        return res
          .status(400)
          .json({ msg: "Tu nombre de usuario debe tener letras." });

      let usernameFixed = "";
      if (usernameValidation == "username") {
        usernameFixed = username.toLowerCase().replace(/ /g, "");

        const username_exists = await User.findOne({
          username: usernameFixed,
        });

        if (username_exists)
          return res
            .status(400)
            .json({ msg: "El nombre de usuario ya existe." });
      } else {
        return res.status(400).json({ msg: "Verifica tu nombre de usuario" });
      }

      const newUserDoc = await User.findOneAndUpdate(
        { _id: req.authUser._id },
        { username: usernameFixed }
      );

      // console.log(newUserDoc._doc);
      newUserDoc.username = usernameFixed;
      console.log(newUserDoc);

      res.json({
        msg: "Nombre de usuario actualizado correctamente.",
        username: usernameFixed,
        user: newUserDoc,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  setStory: async (req, res) => {
    try {
      const { story } = req.body;

      console.log(story);

      await User.findOneAndUpdate(
        { _id: req.authUser._id },
        { story }
      );

      let user = await User.findById(req.authUser._id).select("-password");

      user['story'] = story;

      res.json({
        msg: "Presentación actualizada.",
        user
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = userCtrl;
