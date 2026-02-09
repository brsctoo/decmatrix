"use client";

import {useContext, createContext, useState} from 'react'; 

export const UIContext = createContext();

// A função do Provider
export function UIProvider({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(isSidebarOpen === true ? false : true);
    };

    return (
        <UIContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
            {children}
        </UIContext.Provider>
    );
}

// A função de uso
export const useUI = () => useContext(UIContext);