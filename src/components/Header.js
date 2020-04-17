import React from 'react'

export default function Header(props) {
    
    return (
        <div className="main-title">
            <img src="https://news.ycombinator.com/y18.gif" />
            {props.isLoading ? <></> : (
                <>
            <div className={"news-feed-type" + (props.isActive.top ? " active" : "")} onClick={() => props.handleClick('top')}>
                top
            </div>
            <div className="news-feed-type no-cursor">
                |
            </div>
            <div className={"news-feed-type" + (props.isActive.new ? " active" : "")} onClick={() => props.handleClick('new')}>
                new
            </div></>
            )}
        </div>
    )
}