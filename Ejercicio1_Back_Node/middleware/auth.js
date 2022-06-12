const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const util = require("util");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token)
      return res
        .status(400)
        .json({ msg: "Sin autenticar, vuelva he inicie sesión." });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded) return res.status(400).json({ msg: "Token inválido." });

    // Obtener valor de la cookie por medio del token cookie encriptado
    // const User = mongoose.model('user',UserSchema);
    const user = await User.findOne({ _id: decoded.id });

    req.authUser = user;

    next();
  } catch (error) {
    console.log(util.inspect(error));
    res.status(500).json({ msg: error.message });
  }
};

module.exports = auth;
