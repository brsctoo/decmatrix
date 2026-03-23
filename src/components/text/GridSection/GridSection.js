"use client";

import React, { createContext, useContext } from "react";
import style from "./GridSection.module.css";
import { useRouter, usePathname, useParams } from 'next/navigation';

const GridContext = createContext({ clickable: false }); // Contexto para o estado de clique

function GridSections({title, subtitle, children, extraClassname="", clickable=false}) {
  return (
    <GridContext.Provider value={{ clickable }}> 
        <div className={style.mainTitle}>{title}</div>
        <div className={style.subTitle}>{subtitle}</div>
        
        <div className={`${style.gridSectionContainer} ${extraClassname}`}>
            <div className={style.children}>{children}</div>
        </div>
    </GridContext.Provider>
    );
}

function GridSection({title, children, route="", clickSubtitle=""}) {
    const router = useRouter();
    const pathname = usePathname(); // Retorna "/pt/alguma-coisa"
    const params = useParams();     
    const locale = params.locale;   // "pt" ou "en"

    const { clickable } = useContext(GridContext); // Pega o contexto do pai
    
    const handleClick = () => {
        if (clickable && route) {
            router.push(`/${locale}${route}`);
        }
    };

    const isClickable = clickable && route !== ""; 

    return (
        <div 
            className={isClickable ? `${style.gridSection} ${style.clickable}` : style.gridSection}
            onClick={isClickable ? handleClick : undefined}
            style={{ cursor: isClickable ? "pointer" : "default" }}
        >
            <div className={isClickable ? `${style.gridSectionTextContainer}` : ""}>
                <h3>{title}</h3>
                <p>{children}</p>
                {clickSubtitle && <span className={style.clickSubtitle}>{clickSubtitle}</span>}
            </div>
        </div>
    );
}

export { GridSections, GridSection };