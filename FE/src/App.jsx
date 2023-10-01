import React, { useContext, useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Loading from "./components/common/Loading";
import ListPendFriend from "./components/profile/container/mainContainer/ListPendFriend";
import SearchPost from './components/search/SearchPost';
import SearchPostId from "./components/search/SearchPostId";
import { AuthContext } from "./context/AuthContext";
import { HomeContextProvider } from './context/HomeContext';
import { PostContextProvider } from './context/PostContext';
import { ProfileContextProvider } from "./context/ProfileContext";
import { SearchContextProvider } from './context/SearchContext';
import { GroupContextProvider } from './context/GroupContext';
import Chat from './pages/Chat';
import Home from "./pages/Home";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import Profile from "./pages/Profile";
import ErrorBoundary from "./error/ErrorBoundary";
import Group from './pages/Group';
import MemberGroup from './components/group/common/MemberGroup';

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
          <GroupContextProvider>
            <ProfileContextProvider user={user}>
              <PostContextProvider>
                <Routes>
                  <Route path="/loading" element={<Loading />} />
                  <Route path="/404" element={<PageNotFound />} />
                  <Route path="/" element={user ? <Home /> : <Login />} />
                  <Route path="/login" element={user ? <Home /> : <Login />} />
                  <Route path="/home" element={user ? <Home /> : <Login />} />
                  {/* {allUser?.length > 0 &&
                    allUser.map((username) => (
                      <Route
                        key={username}
                        path={`/${username}`}
                        element={user ? <Profile user={username} /> : <Login />}
                      />
                    ))} */}
                  <Route path="/:username" element={user ? <Profile /> : <Login />} />
                  <Route path="/status" element={<SearchPost />} />
                  <Route path="/messages" element={<Chat />} />
                  <Route path="/status/:id" element={<SearchPostId />} />
                  <Route path="/listPendFriend" element={<ListPendFriend />} />
                  <Route path="/groups/:groupId" element={<Group />} />
                </Routes>
                {/*<Notification></Notification>*/}
              </PostContextProvider>
            </ProfileContextProvider>
          </GroupContextProvider>
        </HomeContextProvider>
      </SearchContextProvider>
    </Router>
  );
}