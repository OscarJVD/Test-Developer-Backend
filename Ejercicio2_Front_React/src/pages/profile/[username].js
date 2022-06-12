import { useParams } from "react-router-dom";
import SideHead from "../../components/profile/SideHead";

const Profile = () => {
  const { username } = useParams();

  return (
  <SideHead username={username}/>
  );
};

export default Profile;
