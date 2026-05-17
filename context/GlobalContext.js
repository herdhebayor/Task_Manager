"use client"

import { createContext,useContext, useState,useEffect } from "react"
import { applyThemeToDocument } from '@/utils/theme';

//Create context
const GlobalContext = createContext();

//Create Provider

export function GlobalProvider({children}){
        const [darkMode, setDarkMode] = useState(false);

        useEffect(() => {
                // manual toggle only: read last saved choice, fallback to 'dark'
                const saved = window.localStorage.getItem('theme');
                const nextMode = saved === 'light' || saved === 'dark' ? saved : 'dark';
        
        
                // apply immediately; avoid syncing React state from effect to satisfy eslint rule
                applyThemeToDocument(nextMode);
            }, [])
        
        
            useEffect(() => {
                setDarkMode(document.documentElement.classList.contains('dark'));
            }, []);

    return(
        <GlobalContext.Provider
        value={{
            darkMode,
            setDarkMode
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export function useGlobalContext(){
    return useContext(GlobalContext)
}