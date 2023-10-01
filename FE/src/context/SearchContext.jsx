import React, { createContext, useCallback, useEffect, useState, useContext } from "react";
import { baseUrl, getRequest } from "../utils/services";

export const SearchContext = createContext();

export const SearchContextProvider = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
            {children}
        </SearchContext.Provider>
    );
};

