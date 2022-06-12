import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/actions/authAction";
import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";
import Tooltip from "react-simple-tooltip";

const Menu = () => {
  // const darkModeRef = useRef();

  const { auth, theme } = useSelector((state) => state);
  const [showSettings, setShowSettings] = useState(" ");
  const [showMsgs, setShowMsgs] = useState(" ");
  const dispatch = useDispatch();

  // console.log(auth)

  // const alternateTheme = () => {
  //   // document.getElementById('themePoint').click();
  //   darkModeRef.current.click()

  //   dispatch({ type: GLOBAL_TYPES.ALERT, payload: !theme })
  //   // onClick={() => dispatch({type: GLOBAL_TYPES.THEME, payload: !theme})}
  // }

  return (
    <>
      <nav
        id="navbar-main"
        className="navbar navbar-expand-lg shadow-sm sticky-top"
      >
        <div className="w-100 justify-content-md-center">
          <ul className="nav navbar-nav enable-mobile px-2">
            
          </ul>

          <ul className="navbar-nav mr-5 flex-row" id="main_menu">
            <Link className="navbar-brand nav-item mr-lg-5" to="/home">
              <img
                src="/favicon_logos/header-logo-dark-x2.png"
                width="100"
                height="40"
                className="mr-3"
                alt="Logo"
              />
            </Link>

            <li className="nav-item s-nav nav-icon d-mobile d-flex align-items-center justify-content-center text-center">
              <Tooltip
                content="Mi perfil"
                placement="bottom"
                style={{ fontSize: "1rem" }}
              >
                <Link
                  to={`/${auth.user.username}`}
                  data-title="Perfil"
                  className="nav-link settings-link rm-drop-mobile drop-w-tooltip bg-pill-shadow rounded-pill "
                >
                  <div className="menu-user-image">
                    {/* PROFILE PHOTO */}
                    <img
                      src={
                        auth.user.avatar
                          ? auth.user.avatar
                          : "https://res.cloudinary.com/solumobil/image/upload/v1639261011/user/icons8-usuario-masculino-en-c%C3%ADrculo-96_ipicdt.png"
                      }
                      style={{ filter: `${theme ? "invert(1)" : "invert(0)"}` }}
                      className="menu-user-img ml-1 nav-settings"
                      alt="Foto de perfil en ionix"
                    />
                  </div>
                  <span className="text-dark fs-6 fw-bold m-1">
                    {auth.user.firstname}
                  </span>
                </Link>
              </Tooltip>
            </li>

            <li className="nav-item s-nav nav-icon dropdown">
              {/* BTN DROPDOWN SETTINGS AVATAR */}

              <i
                onClick={() =>
                  setShowSettings(showSettings == "show" ? " " : "show")
                }
                data-toggle="dropdown"
                data-placement="bottom"
                data-title="Settings"
                className="nav-link settings-link rm-drop-mobile drop-w-tooltip rounded-circle position-relative fas fa-sort-down text-dark fa-sm position-absolute pointer"
              ></i>
              {/* END BTN DROPDOWN SETTINGS AVATAR */}

              <div
                className={`dropdown-menu dropdown-menu-right settings-dropdown shadow-sm ${showSettings}`}
                aria-labelledby="settings-dropdown"
              >

                <a
                  className="dropdown-item d-table align-items-center dark-mode"
                  href="#"
                >
                  <img
                    className=""
                    src="/images/icons/navbar/moon.png"
                    alt="Navbar icon"
                  />

                  {/* <span className="position-absolute mt-1 pt-1">
                          Modo Oscuro
                        </span> */}

                  <div className="d-inline pointer">
                    <label
                      htmlFor="theme"
                      onClick={() =>
                        dispatch({
                          type: GLOBAL_TYPES.THEME,
                          payload: !theme,
                        })
                      }
                      // onClick={alternateTheme}
                      // ref={darkModeRef}
                      // id="themePoint"
                      className="pointer"
                    >
                      {theme ? "Modo Claro" : "Modo Oscuro"}
                    </label>
                    {/* <button type="button" className="btn btn-lg btn-toggle ml-auto" style={{ marginLeft: "auto" }} data-toggle="button" aria-pressed="false" autoComplete="off">
                              <div className="handle"></div>
                            </button> */}
                  </div>
                </a>

                <Link
                  className="dropdown-item logout-btn"
                  to="/"
                  onClick={() => dispatch(logout())}
                >
                  <img
                    src="/images/icons/navbar/logout.png"
                    alt="Navbar icon"
                  />
                  Salir
                </Link>
              </div>
            </li>
           
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Menu;
