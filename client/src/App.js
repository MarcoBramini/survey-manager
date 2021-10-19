import { Redirect, Route, Switch } from "react-router-dom";

import UserIDPage from "./pages/UserIdentificationModule/UserIdentificationPage";
import AdminLoginPage from "./pages/AdminLoginModule/AdminLoginPage";
import SurveyDiscoverPage from "./pages/SurveyDiscoverModule/SurveyDiscoverPage";
import SurveyPage from "./pages/SurveyModule/SurveyPage";
import SurveyQuestionPage from "./pages/SurveyModule/SurveyQuestionPage";
import SurveySubmitPage from "./pages/SurveyModule/SurveySubmitPage";
import SurveyManagerPage from "./pages/SurveyManagerModule/SurveyManagerPage";
import CreateSurveyPage from "./pages/SurveyManagerModule/CreateSurveyPage";
import SurveyReportPage from "./pages/SurveyManagerModule/SurveyReportPage";

import AuthContextProvider from "./context-providers/AuthContext/AuthContextProvider";
import SurveyAttemptProvider from "./context-providers/SurveyAttemptProvider";

import AdminProtectedRoute from "./context-providers/AuthContext/AdminProtectedRoute";
function App() {
  return (
    <AuthContextProvider>
      <SurveyAttemptProvider>
        <Switch>
          {/* Discover Page */}
          <Route
            key='route-survey-discover-page'
            path='/discover'
            render={() => <SurveyDiscoverPage />}></Route>

          {/* User Identification Page */}
          <Route
            key='route-user-id-page'
            path='/user-id'
            render={() => <UserIDPage />}></Route>

          {/* Survey Pages */}
          <Route
            key='route-survey-page'
            path='/surveys/:surveyID'
            exact
            render={() => <SurveyPage />}></Route>

          <Route
            key='route-survey-question-page'
            path='/surveys/:surveyID/questions/:questionPosition'
            render={() => <SurveyQuestionPage />}></Route>

          <Route
            key='route-survey-submit-page'
            path='/surveys/:surveyID/submit/'
            render={() => <SurveySubmitPage />}></Route>

          {/* Admin Login Page */}
          <Route
            key='route-admin-login-page'
            path='/admin-login'
            render={() => <AdminLoginPage />}></Route>

          {/* Survey Manager Pages */}
          <AdminProtectedRoute
            key='route-survey-manager-page'
            path='/manager'
            exact
            failureRedirectPath='/admin-login'>
            <SurveyManagerPage />
          </AdminProtectedRoute>

          <AdminProtectedRoute
            key='route-create-survey-page'
            path={[
              "/manager/surveys/create/:surveyID",
              "/manager/surveys/create",
            ]}
            failureRedirectPath='/admin-login'>
            <CreateSurveyPage />
          </AdminProtectedRoute>

          <AdminProtectedRoute
            key='route-survey-report-page'
            path='/manager/surveys/:surveyID/report'
            failureRedirectPath='/admin-login'>
            <SurveyReportPage />
          </AdminProtectedRoute>

          <Redirect from='/' exact to='/discover' />
          <Redirect from='/*' to='/discover' />
        </Switch>
      </SurveyAttemptProvider>
    </AuthContextProvider>
  );
}

export default App;
