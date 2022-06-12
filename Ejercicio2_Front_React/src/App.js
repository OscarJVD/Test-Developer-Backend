import { BrowserRouter as Router, Route } from "react-router-dom";
import LoginAndRegister from "./pages/loginAndRegister";
import Home from "./pages/home";
import Alert from "./components/alert/Alert";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { refreshToken } from "./redux/actions/authAction";
import Menu from "./components/base/Menu";
import PageRender from "./utils/customRouter/PageRender";
import PrivateRouter from "./utils/customRouter/PrivateRouter";

function App() {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshToken());
  }, [
    dispatch,
    // , auth.token
  ]);

  // console.log(auth.token);
  return (
    <Router>
      <Alert />
      <input type="checkbox" id="theme" />
      <div className="App">
        <div className="container-fluid" id="wrapper">
          <div className="row newsfeed-size">
            <div className="col-md-12 newsfeed-right-side">
              {auth.token && <Menu />}

              <Route
                exact
                path="/"
                component={auth.token ? Home : LoginAndRegister}
              />

              <PrivateRouter
                exact
                path="/:username"
                component={auth.token ? PageRender : LoginAndRegister}
              />

              <PrivateRouter
                exact
                path="/:username/:id"
                component={auth.token ? PageRender : LoginAndRegister}
              />
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
