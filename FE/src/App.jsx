import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { ProfileContextProvider } from "./context/ProfileContext";
import { AuthContextProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import Profile from "./pages/Profile";
import Loading from "./components/common/Loading"
import { PostContextProvider } from './context/PostContext';

import { SearchContextProvider } from './context/SearchContext';
import SearchPost from './components/search/SearchPost';

export default function App() {
  const { user, allUser } = useContext(AuthContext);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (allUser) {
      setIsDataLoaded(true);
    }
  }, [allUser]);

  if (!isDataLoaded) {
    return <Loading />;
  }

  return (
    <Router>
      <SearchContextProvider>
        <ProfileContextProvider user={user}>
          <PostContextProvider>

            <Routes>
              <Route path="/loading" element={<Loading />} />
              <Route path="/404" element={<PageNotFound />} />
              <Route path="/" element={user ? <Home /> : <Login />} />
              <Route path="/login" element={user ? <Home /> : <Login />} />
              <Route path="/home" element={user ? <Home /> : <Login />} />
              {allUser?.length > 0 &&
                allUser.map((username) => (
                  <Route
                    key={username}
                    path={`/${username}`}
                    element={user ? <Profile user={username} /> : <Login />}
                  />
                ))}
             <Route path="/status" element={<SearchPost />} />

            </Routes>
          </PostContextProvider>
        </ProfileContextProvider>
      </SearchContextProvider>
    </Router>
  );
}