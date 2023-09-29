import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ProfileContext } from "../../context/ProfileContext";
import "../../styles/search-bar/SearchResult.css";
import { baseUrl, getRequest } from "../../utils/services";
import { HomeContext } from "../../context/HomeContext";
import { GroupContext } from "../../context/GroupContext";

export const SearchResult = ({ fullname, userId, onClickSearchResult, avatar, groupName, groupPhoto, username, groupId }) => {
  const { user, setUser } = useContext(AuthContext);
  const { userProfile, setUserProfile } = useContext(ProfileContext);
  const { setShowComment } = useContext(HomeContext)
  const { showGroupCreate, setShowGroupCreate, showGroupList, fetchGroupInfo } = useContext(GroupContext)

  const navigate = useNavigate();
  const [userSearched, setUserSearched] = useState([]);

  const handleSearchUser = () => {
    const currentDomain = window.location.pathname.split("/")[1];
    const targetUsername = username;
    if (`/${targetUsername}` !== `/${currentDomain}`) {
      navigate(`/${targetUsername}`);
      onClickSearchResult();
      setShowComment(false);
    } else {
      onClickSearchResult();
      setShowComment(false);
    }
  };

  const handleSearchGroup = async() => {
    const currentDomain = window.location.pathname.split("/")[1];
    const targetUsername = groupId;
    if (`/${targetUsername}` !== `/${currentDomain}`) {
      navigate(`/groups/${targetUsername}`);
      await fetchGroupInfo(groupId);
      onClickSearchResult();
      setShowComment(false);

    } else {
      onClickSearchResult();
      setShowComment(false);
    }
  };

  return (
    <div className="search-result" >
      <div>
        {groupPhoto ? (
          <div className="search-result-container" onClick={handleSearchGroup}>
            <div className="search-result-avatar">
              <img src={groupPhoto} alt="" />
            </div>
            <div className="search-result-details">
              <p>Group Name: {groupName}</p>
            </div>
          </div>
        ) : (
          <div className="search-result-container" onClick={handleSearchUser}>
            <div className="search-result-avatar">
              <img src={avatar} alt="" />
            </div>
            <div className="search-result-details">
              <p>{fullname}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

};