const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const util = require("util");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const passwordValidator = require("password-validator");
const { isEmailTelOrUserName, getRandomNum } = require("../utils/functions");
const generator = require('nickname-generator');

const authCtrl = {
  register: async (req, res) => {
    try {
      const {
        firstname,
        lastname,
        username_email_or_mobile_register,
        new_password,
        gender,
      } = req.body;

      if (
        !firstname ||
        !lastname ||
        !username_email_or_mobile_register ||
        !new_password
      ) {
        return res.status(400).json({ msg: "Llena todos los campos." });
      }

      const registerType = isEmailTelOrUserName(
        username_email_or_mobile_register
      );
      
      if (registerType == "error")
        return res
          .status(400)
          .json({ msg: "Verifica tu usuario, correo o móvil." });
      if (registerType == "usernameerror")
        return res
          .status(400)
          .json({ msg: "Tu nombre de usuario debe tener letras." });

      const schema = new passwordValidator();
      schema.is().min(4).is().max(50);

      if (!schema.validate(new_password))
        return res
          .status(400)
          .json({ msg: "La contraseña debe ser de minimo a 4 caracteres" });

      const passwordHash = await bcrypt.hash(new_password, 12);

      const fullname = firstname + " " + lastname;

      const userObj = {
        firstname,
        lastname,
        fullname,
        password: passwordHash,
        gender,
      };

      if (registerType == "username") {
        let shortUserName = username_email_or_mobile_register
          .toLowerCase()
          .replace(/ /g, "");

        const username_exists = await User.findOne({
          username: shortUserName,
        });
        if (username_exists)
          return res
            .status(400)
            .json({ msg: "El nombre de usuario ya existe." });

        userObj.username = shortUserName;
      }

      if (registerType == "email") {
        const email_exists = await User.findOne({
          email: username_email_or_mobile_register,
        });

        if (email_exists)
          return res.status(400).json({ msg: "El correo ya existe." });

        userObj.email = username_email_or_mobile_register;
      }

      if (registerType == "tel") {
        const mobile_exists = await User.findOne({
          mobile: username_email_or_mobile_register,
        });

        console.log('mobile_exists', mobile_exists);

        if (mobile_exists)
          return res.status(400).json({ msg: "El móvil ya existe." });

        userObj.mobile = [username_email_or_mobile_register];
      }

      if (!userObj.hasOwnProperty('username')) {
        const random = getRandomNum(1, 3);

        const randomUsername = generator.randomNickname(
          {
            locale: 'en',
            numberOfWords: random,
            separator: random == 2 ? '-' : '_',
            suffixLength: random,
            wordCase: 'lower', // lowercase
          }
        );

        const randomUsername_exists = await User.findOne({
          username: randomUsername,
        });

        if (randomUsername_exists)
          return res
            .status(400)
            .json({ msg: "El nombre de usuario ya existe." });

        userObj.username = randomUsername;
      }

      console.log(util.inspect(userObj));
      // return;
      // Creamos el usuario
      const newUser = new User(userObj);

      const access_token = createAccessToken({ id: newUser._id });
      const refresh_token = createRefreshToken({ id: newUser._id });

      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/refreshtoken",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      await newUser.save();

      res.json({
        msg: gender == 'female' ? "¡Registrada!" : "¡Registrado!",
        access_token,
        user: {
          ...newUser._doc,
          password: "",
        },
      });
    } catch (err) {
      console.log(util.inspect(err));
      console.log(err)
      return res.status(500).json({ msg: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { username_email_or_mobile_login, password } = req.body;

      if (!username_email_or_mobile_login || !password) {
        return res.status(400).json({ msg: "Llena todos los campos." });
      }

      const registerType = isEmailTelOrUserName(username_email_or_mobile_login);
      if (registerType == "error")
        res.status(400).json({ msg: "Verifica tu usuario, correo o móvil." });
      if (registerType == "usernameerror")
        res
          .status(400)
          .json({ msg: "Tu nombre de usuario debe tener letras." });

      let user = null;
      if (registerType == "username") {
        user = await User.findOne({
          username: username_email_or_mobile_login,
        });

        if (!user)
          return res
            .status(400)
            .json({ msg: "El usuario no existe." });
      }

      if (registerType == "email") {
        user = await User.findOne({
          email: username_email_or_mobile_login,
        })

        if (!user) return res.status(400).json({ msg: "El correo no existe." });
      }

      if (registerType == "tel") {
        user = await User.findOne({
          mobile: username_email_or_mobile_login,
        })

        if (!user) return res.status(400).json({ msg: "El móvil no existe." });
      }

      const isPassMatch = await bcrypt.compare(password, user.password);
      if (!isPassMatch)
        return res.status(400).json({ msg: "Contraseña incorrecta" });

      const access_token = createAccessToken({ id: user._id });
      const refresh_token = createRefreshToken({ id: user._id });

      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/refreshtoken",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.json({
        msg: "¡Ingreso exitoso!",
        access_token,
        user: {
          ...user._doc,
          password: "",
        },
      });
    } catch (err) {
      // console.log(err.message);
      return res.status(500).json({ msg: err.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/api/refresh_token" });
      return res.json({ msg: "¡Sesión cerrada!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  genAccessTkn: async (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token)
        return res.status(400).json({ msg: "Por favor inicia sesión." });

      jwt.verify(
        rf_token,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, result) => {
          if (err)
            return res.status(400).json({ msg: "Por favor inicia sesión." });

          // console.log(result);
          const user = await User.findById(result.id)
            .select("-password")

          if (!user)
            return res.status(400).json({ msg: "Autenticación invalida" });

          const access_token = createAccessToken({ id: result.id });

          res.json({ access_token, user });
        }
      );
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = authCtrl;
