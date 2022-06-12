// AQUI SE DEFINE EL NOMBRE PARA SER LLAMADOS del obj ESTADO GLOBAL

import { combineReducers } from "redux";
import auth from "./authReducer";
import alert from "./alertReducer";
import theme from "./themeReducer";
import profile from "./profileReducer";

export default combineReducers({ auth, alert, theme, profile });
