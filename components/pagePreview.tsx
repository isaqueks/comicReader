import React from "react";
import '../styles/pagePreview.css';

export default function pagePreview(
    selectedIndex: number, 
    index: number, 
    url: string, 
    scrollTop: number, 
    onClick: Function
): JSX.Element {

    const indexDistance = Math.abs(selectedIndex - index);
    
    const myScrollTop = index * 270;
    const scrollDist = Math.abs(scrollTop - myScrollTop);

    const useRealImage = scrollDist < window.innerHeight * 2 || indexDistance < 3;
    

    const classes = ['pagePreview'];
    if (selectedIndex === index) {
        classes.push('selected');
    }
    if (!useRealImage) {
        classes.push('placeholder');
    }

    return (
        <img 
            width="100%" 
            key={index} 
            data-index={index} 
            src={useRealImage ? (url) : undefined} 
            className={classes.join(' ')} 
            onClick={e => onClick && onClick(index)} 
        />
    );
}