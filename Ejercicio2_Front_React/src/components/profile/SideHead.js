import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Tooltip from "react-simple-tooltip";
import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";
import { postDataAPI } from "../../utils/fetchData";
import { getUserProfileByUserName } from "../../redux/actions/profileAction";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Toast from "../../components/alert/Toast";

const SideHead = ({ username, children, active }) => {
  const history = useHistory();

  useEffect(() => {
    if (!active || active == 'profile')
      history.push(`/${username}/profile`)
  }, [active, history])

  console.log('active: ', active);
  const { auth, profile } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [userData, setUserData] = useState([]);
  const [avatar, setAvatar] = useState('')
  const [userNameCopy, setUserNameCopy] = useState(false);
  const [showInputUserName, setShowInputUserName] = useState(false);
  const [showInputIntro, setShowInputIntro] = useState(false);
  const [txtUserName, setTxtUserName] = useState("");
  const [intro, setIntro] = useState("");
  let inputUserNameRef = useRef();
  let inputIntroRef = useRef();

  useEffect(() => {
    if (username === auth.user.username) {
      console.log("PERFIL PROPIO");
      setUserData([auth.user]);
      setIntro(auth.user.story);
    } else {
      console.log(" -------- PERFIL AJENO -------");

      dispatch(getUserProfileByUserName({ users: profile.users, username, auth }));

      const data = profile.users.filter(user => user.username === username);
      let set = new Set(data.map(JSON.stringify))
      let newUserData = Array.from(set).map(JSON.parse);
      // console.log('userData: ',  profile.users);

      setUserData(newUserData);

      if (newUserData.story)
        setIntro(newUserData.story);
    }
  }, [username, auth.user, profile.users, getUserProfileByUserName, dispatch, setUserData, setIntro]);

  const submitSetUserName = async (e) => {
    
    postDataAPI(`setTxtUserName`, { txtUserName }, auth.token)
      .then((res) => {
        let newArr = [];
        newArr.push(res.data.user);
        setUserData(newArr);
        setShowInputUserName(false);
      })
      .catch((err) => {
        return dispatch({
          type: GLOBAL_TYPES.ALERT,
          payload: {
            error: err.response.data.msg ? err.response.data.msg : err,
          },
        });
      });

  };

  const submitSetIntro = async (e) => {

    let tempData = userData
    tempData[0].story = intro;
    setUserData(tempData);

    setShowInputIntro(false);

    postDataAPI(`setStory`, { story: intro }, auth.token)
      .then((res) => {
        let newArr = [];
        newArr.push(res.data.user);

        console.log('newArr', newArr)

        setUserData(newArr);
        setShowInputIntro(false);
      })
      .catch((err) => {
        return dispatch({
          type: GLOBAL_TYPES.ALERT,
          payload: {
            error: err.response.data.msg ? err.response.data.msg : err,
          },
        });
      });
  console.log('userData:',  userData);

  };

  console.log('userData:',  userData);

  return (
    <>
      {userNameCopy && (
        <Toast
          msg={{ title: "Nombre de usuario copiado", body: "" }}
          handleShow={() => {
            setUserNameCopy(false);
            dispatch({ type: GLOBAL_TYPES.ALERT, payload: {} });
          }}
          bgColor="bg-dark"
          onlyTitle={true}
        />
      )}

      {
        userData.map((user, index) => (
          <div className="row profile-right-side-content" key={index}>
            <div className="user-profile">
              <div className="row profile-rows">
                <div className="col-md-3">
                  <div className="profile-info-left">
                    <div className="text-center ">
                      <div className="profile-img w-shadow pointer">
                        <div className="profile-img-overlay pointer"></div>
                        <img
                          src={
                            user.avatar
                              ? user.avatar
                              : "https://res.cloudinary.com/solumobil/image/upload/v1639261011/user/icons8-usuario-masculino-en-c%C3%ADrculo-96_ipicdt.png"
                          }
                          alt="Foto de perfil en ionix"
                          className="avatar img-circle pointer"
                        />
                        <div className="profile-img-caption pointer">
                          <label
                            htmlFor="updateProfilePic"
                            className="upload pointer"
                          >
                            <i className="fas fa-camera pointer"></i> Actualizar
                            <input
                              type="file"
                              id="updateProfilePicInput"
                              className="text-center upload pointer"
                            />
                          </label>
                        </div>
                      </div>
                      <p className="profile-fullname mt-3">{user.fullname}</p>

                      {user.username ? (
                        <p className="profile-username mb-3 text-muted pointer">
                          <CopyToClipboard
                            text={user.username}
                            onCopy={() => {
                              setUserNameCopy(true);

                              setTimeout(() => {
                                setUserNameCopy(false);
                              }, 7000);
                            }}
                          >
                            <span>@{user.username}</span>
                          </CopyToClipboard>
                        </p>
                      ) : (
                        <div>
                          {username === auth.user.username && (
                            <div className="p-1">
                              <div
                                className={`${showInputUserName ? "d-none" : " "
                                  }`}
                              >
                                @
                                <a
                                  href="#"
                                  onClick={() => {
                                    setShowInputUserName(true);
                                    setTimeout(() => {
                                      inputUserNameRef.current.focus();
                                    }, 100);
                                  }}
                                >
                                  Agrega tu nombre de
                                  {user.gender == "male" ? (
                                    <span> usuario</span>
                                  ) : (
                                    <span> usuaria</span>
                                  )}
                                </a>
                              </div>
                              {/* CAMPO INGRESE USUARIO */}
                              <div
                                className={`d-flex justify-content-center text-center mt-2 ${showInputUserName ? " " : "d-none"
                                  }`}
                              >
                                <p className="profile-username mb-3 text-muted d-flex justify-content-center text-center">
                                  <div className="input-group d-contents">
                                    @
                                    <input
                                      ref={inputUserNameRef}
                                      value={txtUserName}
                                      name="txtUserName"
                                      onChange={(e) =>
                                        setTxtUserName(e.target.value)
                                      }
                                      type="text"
                                      placeholder="Usuario"
                                      className="border-0 outline-none w-50"
                                    />

                                    <Tooltip content="Guardar" placement="bottom">
                                      <button
                                        type="button"
                                        onClick={submitSetUserName}
                                        className="btn btn-primary btn-sm text-initial"
                                      >
                                        <i className="fas fa-save"></i>
                                      </button>
                                    </Tooltip>

                                    <Tooltip
                                      content="Cancelar"
                                      placement="bottom"
                                    >
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setShowInputUserName(false)
                                        }
                                        className="btn btn-danger btn-sm text-initial"
                                      >
                                        <i className="fas fa-window-close"></i>
                                      </button>
                                    </Tooltip>
                                  </div>
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="intro mt-4 mv-hidden">
                      <div className={`${user.story ? '' : 'mb-3'} intro-item d-flex justify-content-between align-items-center mb-0 pb-0`}>
                        <h3 className="intro-about m-0 p-0">Detalles</h3>
                      </div>

                      {user.story && (
                        <div
                          className={`${showInputUserName ? "d-none" : " "
                            } col-md-12 justify-content-center d-flex text-center pt-0 mt-0`}
                          style={{ wordBreak: "break-word" }}
                        >
                          <div className=" p-3 w-100 text-wrap">
                            <span className="fs-7 w-50 text-wrap">
                              {user.story}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* CAMPO INGRESE PRESENTACIÓN */}
                      {username === auth.user.username && (
                        <>
                          <div
                            className={`d-flex justify-content-center text-center mt-2 ${showInputIntro ? " " : "d-none"
                              }`}
                          >
                            <p className="profile-username mb-3 text-muted d-flex justify-content-center text-center">
                              <div className="input-group d-flex">
                                <div className="col-12">
                                  <textarea
                                    ref={inputIntroRef}
                                    value={intro}
                                    rows={2}
                                    name="intro"
                                    maxLength="60"
                                    onChange={(e) => setIntro(e.target.value)}
                                    placeholder="Describe quién eres"
                                    className="border p-2 outline-none w-100"
                                  ></textarea>
                                </div>

                                <div className="col-12">
                                  <Tooltip content="Guardar" placement="bottom">
                                    <button
                                      type="button"
                                      onClick={submitSetIntro}
                                      className="btn btn-primary btn-sm text-initial"
                                    >
                                      <i className="fas fa-save"></i> Guardar
                                    </button>
                                  </Tooltip>
                                  <Tooltip content="Cancelar" placement="bottom">
                                    <button
                                      type="button"
                                      onClick={() => setShowInputIntro(false)}
                                      className="btn btn-danger btn-sm text-initial ms-2"
                                    >
                                      <i className="fas fa-window-close"></i> Cancelar
                                    </button>
                                  </Tooltip>
                                </div>
                              </div>
                            </p>
                          </div>

                          <div
                            className={`${showInputIntro ? "d-none" : " "
                              } col-md-12`}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setShowInputIntro(true);
                                setTimeout(() => {
                                  inputIntroRef.current.focus();
                                }, 100);
                              }}
                              className={`btn btn-sm btn-primary d-block w-100 ${user.story ? 'bg-neutro hover-text-white text-dark' : 'btn-primary'} fw-less-bold fs-6 text-initial`}
                            >
                              {user.story ? 'Editar presentación' : 'Presentarme'}
                            </button>
                          </div>
                        </>
                      )}
                      {/* END CAMPO INGRESE PRESENTACIÓN */}

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      }
    </>
  );
};

export default SideHead;
