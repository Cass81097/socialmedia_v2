import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { ProfileContextProvider } from "./context/ProfileContext";
import { AuthContextProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import Profile from "./pages/Profile";
import Chat from './pages/Chat';
import Loading from "./components/common/Loading"
import SearchPostId from "./components/search/SearchPostId"
import ListPendFriend from "./components/profile/container/mainContainer/ListPendFriend"
import { PostContextProvider } from './context/PostContext';
import { SearchContextProvider } from './context/SearchContext';
import SearchPost from './components/search/SearchPost';
import { HomeContextProvider } from './context/HomeContext';
import Notification from './components/common/Notification';

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
        <HomeContextProvider>
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
                <Route path="/messages" element={<Chat />} />
                <Route path="/status/:id" element={<SearchPostId />} />
                <Route path="/listPendFriend" element={<ListPendFriend />} />
              </Routes>
              <Notification></Notification>
            </PostContextProvider>
          </ProfileContextProvider>
        </HomeContextProvider>
      </SearchContextProvider>
    </Router>
  );
}