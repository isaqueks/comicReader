import React from 'react';
import '../styles/menuBar.css';

export default function MenuBar(props) {

    const returnArrowClasses = ['returnArrow'];
    if (!props.onReturnClicked) {
        returnArrowClasses.push('invisible');
    }

    return (<div className="menuBar">
        <div className={returnArrowClasses.join(' ')} onClick={e => props.onReturnClicked&&props.onReturnClicked(e)}></div>
        <div className="menuContent">
            {props.currentPage+1}/{props.maxPages} 
            &nbsp;-&nbsp;{((props.currentPage+1)/props.maxPages*100).toFixed(0)}%
        </div>
    </div>);
}