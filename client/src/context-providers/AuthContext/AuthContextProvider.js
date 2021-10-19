import { createContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

import ErrorToast from "../../ui-components/ErrorToast/ErrorToast";
import Spinner from "../../ui-components/Spinner/Spinner";
import UserPanelModal from "../../ui-components/UserPanelModal/UserPanelModal";

import {
  loginUser as loginUserAPI,
  getCurrentUser,
  logoutUser as logoutUserAPI,
} from "../../services/AuthAPIClient";
const AuthContext = createContext();

const userFullNameLocalStorageKey = "userFullName";

function AuthContextProvider(props) {
  const location = useLocation();
  const history = useHistory();

  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  const [showUserPanelModal, setShowUserPanelModal] = useState(false);

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorToastMessage, setErrorToastMessage] = useState("");

  const [authState, setAuthState] = useState({
    userFullName: null,
    currentUser: null,
    redirectPath:
      location.pathname !== "/admin-login" &&
      location.pathname.startsWith("/manager")
        ? location.pathname
        : "/manager",

    setUserFullName: function (userFullName) {
      localStorage.setItem(userFullNameLocalStorageKey, userFullName);
      setAuthState({
        ...authState,
        userFullName: userFullName,
      });
    },

    unsetUserFullName: function () {
      localStorage.removeItem(userFullNameLocalStorageKey);
      setAuthState({
        ...authState,
        userFullName: null,
      });
    },

    loginUser: function (email, password) {
      return new Promise((resolve, reject) => {
        loginUserAPI(email, password)
          .then((user) => {
            let redirectPath = "";
            setAuthState((old) => {
              redirectPath = old.redirectPath;
              return { ...old, currentUser: user, redirectPath: "/manager" };
            });
            history.push(redirectPath);
            return resolve(user);
          })
          .catch((err) => {
            return reject(err.message);
          });
      });
    },

    showUserPanel: function () {
      setShowUserPanelModal(true);
    },

    logoutUser: function () {
      setShowUserPanelModal(false);
      return new Promise((resolve, reject) => {
        if (!this.currentUser) {
          return resolve();
        }
        logoutUserAPI()
          .then(() => {
            setAuthState((old) => {
              return {
                ...old,
                currentUser: null,
                redirectPath: "/manager",
              };
            });
            history.push("/discover");
            return resolve();
          })
          .catch((err) => {
            setErrorToastMessage(err.message);
            setShowErrorToast(true);
            return reject();
          });
      });
    },
  });

  useEffect(() => {
    const recoverUserFullName = () => {
      const userFullName = localStorage.getItem(userFullNameLocalStorageKey);
      if (userFullName) {
        setAuthState((old) => old.setUserFullName(userFullName));
      }
    };

    if (!isAuthInitialized) recoverUserFullName();
  }, [isAuthInitialized]);

  useEffect(() => {
    const fetchCurrentUser = () => {
      getCurrentUser()
        .then((currentUser) => {
          if (currentUser !== null) {
            let redirectPath = "";
            setAuthState((old) => {
              redirectPath = old.redirectPath;
              return {
                ...old,
                currentUser: currentUser,
              };
            });
            history.push(redirectPath);
          }
          setIsAuthInitialized(true);
        })
        .catch((err) => {
          setErrorToastMessage(err.message);
          setShowErrorToast(true);
        });
    };

    if (!isAuthInitialized) fetchCurrentUser();
  }, [isAuthInitialized, history]);

  return (
    <>
      {!isAuthInitialized ? (
        <Spinner fullPage />
      ) : (
        <AuthContext.Provider value={authState}>
          {props.children}
        </AuthContext.Provider>
      )}

      {authState.currentUser ? (
        <UserPanelModal
          show={showUserPanelModal}
          onHide={() => setShowUserPanelModal(false)}
          user={authState.currentUser}
          onLogout={() => authState.logoutUser()}
        />
      ) : null}

      <ErrorToast
        show={showErrorToast}
        onClose={() => setShowErrorToast(false)}
        title='Error'
        message={errorToastMessage}
      />
    </>
  );
}

export { AuthContextProvider as default, AuthContext };
