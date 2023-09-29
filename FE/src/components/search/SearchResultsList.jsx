import "../../styles/search-bar/SearchResultsList.css";
import { SearchResult } from "./SearchResult";
import { ProfileContext } from "../../context/ProfileContext";
import React, { useEffect, useState, useContext } from "react";

export const SearchResultsList = ({ results, clearSearchResult }) => {
  const { userProfile } = useContext(ProfileContext)
  const [resultList, setResultList] = useState(true);
  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    setResultList(true);
  }, []);

  useEffect(() => {
    setFilteredResults(results.filter((result) => {
      const storedId = JSON.parse(localStorage.getItem("User"));
      return result?.id !== storedId?.id ;
    }));
  }, [results, userProfile, window.location.pathname]);

  const onClickSearchResult = () => {
    setFilteredResults([]);
    clearSearchResult();
  };


  return (
    <div className="results-list">
      {filteredResults.map((result, id) => {
        return <SearchResult 
        fullname={result.fullname} 
        username={result.username}
        userId={result.id} 
        avatar={result.avatar} 
        key={id} 
        onClickSearchResult={onClickSearchResult} 
        groupName={result.groupName}
        groupPhoto={result.image}
        groupId={result.id}
        />;
      })}
    </div>
  );
};