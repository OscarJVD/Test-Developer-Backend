import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import NotFound from "../../components/NotFound";

const generatePage = (pageLocation) => {

  console.log(pageLocation);
  const component = () => require(`../../pages/${pageLocation}`).default;

  try {
    return React.createElement(component());
  } catch (err) {
    console.log(err);
    return <NotFound />;
  }
};

const PageRender = () => {
  const { id, username } = useParams();
  const { auth } = useSelector((state) => state);
  let pageName = "";

  if (auth.token) {

    const staticRootTargets = [
      "home",
      "loginAndRegister",
      "notify",
    ]

    const staticProfileTargets = [
      "about",
    ]

    /*** username = ruta ***/
    const ifId = id ? '/[id]' : ''

    // Si es differente a cada elemento del arreglo
    if (staticRootTargets.every(file => file !== username)) {

      pageName = staticProfileTargets.every(file => file !== id)
        ? `profile/[username]`
        : `profile/${id}`

    } else {

      pageName = staticRootTargets.some(file => file === username)
        ? `${username}${ifId}`
        : `profile/${username}${ifId}`

    }
  }

  return generatePage(pageName);
};

export default PageRender;