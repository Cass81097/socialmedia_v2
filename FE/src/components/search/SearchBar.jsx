import React, { useState, useEffect, useRef, useContext } from "react";
import { FaSearch } from "react-icons/fa";
import "../../styles/search-bar/SearchBar.css";
import { useNavigate } from "react-router-dom";
import { SearchContext, useSearch } from "../../context/SearchContext";
export const SearchBar = ({ setResults, results }) => {
  const [input, setInput] = useState("");
  const [hasResults, setHasResults] = useState(false);
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm } = useContext(SearchContext)

  const inputRef = useRef(null); // Create a ref for the input field

    useEffect(() => {
        setHasResults(results.length > 0);
    }, [results]);

  useEffect(() => {
    setInput("");
  }, [window.location.pathname]);

  const fetchData = (value) => {
    fetch("http://localhost:5000/users/")
        .then((response) => response.json())
        .then((json) => {
          const filteredResults = json.filter((user) => {
            return (
                value &&
                user &&
                user.fullname &&
                (user.fullname.toLowerCase().includes(value) ||
                    user.fullname.includes(value))
            );
          });
          setResults(filteredResults);
        });
  };
  const fetchDataGroup = (value) =>{
      // fetch("")
  }

  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  };

  const handleSearch = () => {
    setSearchTerm(input);
    navigate("/status");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    // Add a click event listener to the document body
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {

        setResults([]);
      }
    };

    // Add the event listener when the component mounts
    document.body.addEventListener("click", handleClickOutside);

    // Remove the event listener when the component unmounts
    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, [setResults]);

  return (
      <div className={`input-wrapper ${hasResults ? "with-results" : ""}`}>
        <FaSearch className="icon-search" onClick={handleSearch} />
        <input
            placeholder="Search..."
            value={input}
            onChange={(e) => handleChange(e.target.value)}
            onKeyPress={handleKeyPress}
            ref={inputRef}
        />
      </div>
  );
};