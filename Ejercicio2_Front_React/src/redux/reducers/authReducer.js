import { GLOBAL_TYPES } from "../actions/globalTypes";

const authReducer = (state = {}, action) => {
  switch (action.type) {
    case GLOBAL_TYPES.LOGIN_USER:
      return action.payload;
    default:
      return state;
  }
};

export default authReducer;
