import { postDataAPI } from "../../utils/fetchData";
import { GLOBAL_TYPES } from "./globalTypes";

export const loginUser = (user) => async (dispatch) => {
  try {
    dispatch({ type: GLOBAL_TYPES.ALERT, payload: { loading: true } });

    const result = await postDataAPI("login", user);

    console.log(result);

    dispatch({
      type: GLOBAL_TYPES.LOGIN_USER,
      payload: { token: result.data.access_token, user: result.data.user },
    });

    localStorage.setItem("firstSlidesLogin", true);

    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: { success: result.data.msg },
    });

    // console.log(result);
    // console.log(user);
  } catch (error) {
    console.log(error.response.data.msg);
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: { error: error.response.data.msg },
    });
  }
};

export const registerUser = (user) => async (dispatch) => {
  try {
    dispatch({ type: GLOBAL_TYPES.ALERT, payload: { loading: true } });

    const result = await postDataAPI("register", user);

    // console.log(result);

    dispatch({
      type: GLOBAL_TYPES.LOGIN_USER,
      payload: { token: result.data.access_token, user: result.data.user },
    });

    localStorage.setItem("firstSlidesLogin", true);

    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: { success: result.data.msg },
    });

    window.location.reload();
    // console.log(result);
    // console.log(user);
  } catch (error) {
    // console.log(error.response.data.msg);
    // console.log(error.response);
    console.log(error);
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: { error: error.response.data.msg },
    });
  }
};

export const refreshToken = () => async (dispatch) => {
  const firstSlidesLogin = localStorage.getItem("firstSlidesLogin");

  if (firstSlidesLogin) {
    dispatch({ type: GLOBAL_TYPES.ALERT, payload: { loading: true } });

    try {
      const result = await postDataAPI("refreshtoken");

      console.log(result);

      if (result)
        dispatch({
          type: GLOBAL_TYPES.LOGIN_USER,
          payload: { token: result.data.access_token, user: result.data.user },
        });

      dispatch({ type: GLOBAL_TYPES.ALERT, payload: {} });
    } catch (error) {
      // console.log(error.response.data.msg);

      // console.log(window.location)
      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/"
      ) {
        localStorage.removeItem('firstSlidesLogin')
        window.location.reload();
        
        dispatch({
          type: GLOBAL_TYPES.ALERT,
          payload: {
            error: error.response,
          },
        });
      } else {
        dispatch({
          type: GLOBAL_TYPES.ALERT,
          payload: {},
        });
      }
    }
  }
};

export const logout = () => async (dispatch) => {
  try {
    localStorage.removeItem("firstSlidesLogin");
    await postDataAPI("logout");

    window.location.href = "/";
  } catch (error) {
    dispatch({
      type: GLOBAL_TYPES.ALERT,
      payload: { error: error.response.data.msg },
    });
  }
};
