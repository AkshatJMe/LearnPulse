import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

interface OpenRouteProps {
  children: React.ReactNode;
}

const OpenRoute: React.FC<OpenRouteProps> = ({ children }) => {
  //@ts-ignore
  const { token } = useSelector((state) => state.auth);

  if (token === null) {
    return <>{children}</>;
  } else {
    return <Navigate to="/dashboard/profile" />;
  }
};

export default OpenRoute;
