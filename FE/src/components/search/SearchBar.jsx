import React, {useState, useEffect, useRef, useContext} from "react";
import {FaSearch} from "react-icons/fa";
import "../../styles/search-bar/SearchBar.css";
import {useNavigate} from "react-router-dom";
import {SearchContext, useSearch} from "../../context/SearchContext";
import { baseUrl } from "../../utils/services";

export const SearchBar = ({setResults, results}) => {
    const [input, setInput] = useState("");
    const [hasResults, setHasResults] = useState(false);

    const navigate = useNavigate();
    const {searchTerm, setSearchTerm} = useContext(SearchContext)

    const inputRef = useRef(null); // Create a ref for the input field

    useEffect(() => {
        setHasResults(results.length > 0);
    }, [results]);

    useEffect(() => {
        setInput("");
    }, [window.location.pathname]);

    const fetchData = (value) => {
        const userPromise = fetch(`${baseUrl}/users/`).then((response) =>
            response.json()
        );
        const groupPromise = fetch(`${baseUrl}/groups/`).then((response) =>
            response.json()
        );

        Promise.all([userPromise, groupPromise]).then(([users, groups]) => {
            const userResults = users.filter(
                (user) =>
                    user.fullname &&
                    (user.fullname.toLowerCase().includes(value) ||
                        user.fullname.includes(value))
            );
            const groupResults = groups.filter(
                (group) =>
                    group.groupName &&
                    (group.groupName.toLowerCase().includes(value) ||
                        group.groupName.includes(value))
            );

            const mergedResults = [...userResults, ...groupResults];
            setResults(mergedResults);
        });
    };

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

    return (
        <div className={`input-wrapper ${hasResults ? "with-results" : ""}`}>
            <FaSearch className="icon-search" onClick={handleSearch}/>
            <input
                placeholder="Search..."
                value={input}
                onChange={(e) => handleChange(e.target.value)}
                onKeyPress={handleKeyPress}
                ref={inputRef}
            />
        </div>
    );
}
//     useEffect(() => {
//         // Add a click event listener to the document body
//         const handleClickOutside = (event) => {
//             if (inputRef.current && !inputRef.current.contains(event.target)) {
//
//                 setResults([]);
//             }
//         };
//
//         // Add the event listener when the component mounts
//         document.body.addEventListener("click", handleClickOutside);
//
//         // Remove the event listener when the component unmounts
//         return () => {
//             document.body.removeEventListener("click", handleClickOutside);
//         };
//     }, [setResults]);
//
//     return (
//         <div className={`input-wrapper ${hasResults ? "with-results" : ""}`}>
//             <FaSearch className="icon-search" onClick={handleSearch}/>
//             <input
//                 placeholder="Search..."
//                 value={input}
//                 onChange={(e) => handleChange(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 ref={inputRef}
//             />
//         </div>
//     );
// };
