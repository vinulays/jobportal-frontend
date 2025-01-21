import "./App.css";
import Login from "./Components/Login/Login";
import NavBar from "./Components/NavBar/NavBar";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Signup from "./Components/Signup/Signup";
import Search from "./Components/Search/Search";
import JobList from "./Components/JobList/JobList";
import JobRequest from "./Components/JobRequest/JobRequest";
import { useAuth } from "./Context/AuthProvider";
import JobTable from "./Components/JobTable/JobTable";
import JobRequestTable from "./Components/JobRequestTable/JobRequestTable";
import Calendar from "./Components/Calendar/Calendar";
import Profile from "./Components/Profile/Profile";

function App() {
  const { auth, user } = useAuth();

  return (
    <div className="w-[90%] m-auto">
      <Router>
        <Routes>
          <Route path="/login/consumer" element={<Login role="consumer" />} />
          <Route path="/login/provider" element={<Login role="provider" />} />
          <Route path="/signup/provider" element={<Signup role="provider" />} />
          <Route path="/signup/consumer" element={<Signup role="consumer" />} />

          {auth && (
            <Route
              path="/job/:_id"
              element={
                <>
                  <NavBar />
                  <JobRequest />
                </>
              }
            />
          )}

          {auth && user.role === "provider" && (
            <Route
              path="/jobs/manage"
              element={
                <>
                  <NavBar />
                  <JobTable />
                </>
              }
            />
          )}

          {auth && user.role === "provider" && (
            <Route
              path="/provider/requests"
              element={
                <>
                  <NavBar />
                  <JobRequestTable />
                </>
              }
            />
          )}

          {auth && user.role === "consumer" && (
            <Route
              path="/consumer/requests"
              element={
                <>
                  <NavBar />
                  <JobRequestTable />
                </>
              }
            />
          )}

          {auth && user.role === "provider" && (
            <Route
              path="/provider/calendar"
              element={
                <>
                  <NavBar />
                  <Calendar />
                </>
              }
            />
          )}

          {auth && (
            <Route
              path="/provider/:_id"
              element={
                <>
                  <NavBar />
                  <Profile />
                </>
              }
            />
          )}

          {auth && user.role === "consumer" && (
            <Route
              path="/consumer/calendar"
              element={
                <>
                  <NavBar />
                  <Calendar />
                </>
              }
            />
          )}

          <Route
            path="/"
            element={
              <>
                {/* {auth == null ? <h1>No Login</h1> : <NavBar />} */}
                <NavBar />
                <Search />
                <JobList />
              </>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
