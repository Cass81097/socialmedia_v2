import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ProfileContext } from "../../context/ProfileContext";
import "../../styles/search-bar/SearchResult.css";
import { baseUrl, getRequest } from "../../utils/services";
import { HomeContext } from "../../context/HomeContext";

export const SearchResult = ({ result, userId, onClickSearchResult }) => {
  const { user, setUser } = useContext(AuthContext);
  const { userProfile, setUserProfile } = useContext(ProfileContext);
  const { setShowComment } = useContext(HomeContext)

  const navigate = useNavigate();
  const [userSearched, setUserSearched] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRequest(`${baseUrl}/users/find/id/${userId}`);
        setUserSearched(response);
      } catch (error) {
        console.error("Error checking friend status:", error);
      }
    };
    fetchData();
  }, [userId]);

  const handleSearchUser = (res) => {
    const currentDomain = window.location.pathname.split("/")[1];
    const targetUsername = userSearched[0]?.username;
    if (`/${targetUsername}` !== `/${currentDomain}`) {
      navigate(`/${targetUsername}`);
      onClickSearchResult();
      setShowComment(false);
    } else {
      onClickSearchResult();
      setShowComment(false);
    }
  };
  return (
    <div className="search-result" onClick={handleSearchUser}>
      <div className="search-result-container">
        <div className="search-result-avatar">
          <img src={userSearched[0]?.avatar} alt="" />
        </div>
        <p>{result}</p>
      </div>
    </div>
  );
};