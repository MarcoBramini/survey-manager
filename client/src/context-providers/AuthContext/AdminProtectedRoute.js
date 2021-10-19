import { Redirect, Route } from "react-router";
import { AuthContext } from "./AuthContextProvider";
import { UserRole } from "../../services/models/user";

function AdminProtectedRoute(props) {
  return (
    <Route
      key={props.key}
      path={props.path}
      render={() => (
        <AuthContext.Consumer>
          {(value) =>
            value.currentUser && value.currentUser.role === UserRole.ADMIN ? (
              props.children
            ) : (
              <Redirect to={props.failureRedirectPath} />
            )
          }
        </AuthContext.Consumer>
      )}
    />
  );
}

export default AdminProtectedRoute;
