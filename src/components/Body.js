import React from 'react'
import Loader from './Loader';
import moment from 'moment';
import 'font-awesome/css/font-awesome.min.css';

export default function Body(props) {

    const parseDomain = (url) => {

        if(!url) return;

        return url.replace(/^(http[s]?:\/\/)/, '').split('/')[0];
    }

    const formattedDate = (date) => {

        return moment(date).fromNow()
    }

    const NewsFeedItem = (props) => {
        return (
            <div key={props.id} id={props.id} className="news-feed">
                <div className="slNum-upvote">{props.num_comments}</div>
                <div className="slNum-upvote">
                    {props.points} <i className="fa fa-play" onClick={() => props.handleUpvote(props.id)}></i>
                </div>
                <div>{props.title}</div>
                {props.url && <div className="color-light-gray">
                    (<a href={props.url} target="blank">{parseDomain(props.url)}</a>)
                </div>}
                <div><span className="color-light-gray">by</span> {props.author}</div>
                <div className="color-light-gray">{formattedDate(props.createdTime)}</div>
                <div className="color-light-gray">
                    [ <span className="color-black cursor-pointer" onClick={() => props.handleNewsHide(props.id)}>hide</span> ]
                </div>
            </div>
        )
    }

    const IsMore = (props) => {
        return <div className="news-feed">
                    <span className="fetch-more" onClick={props.handleFetchMore}>More</span>
                </div>
    }
    
    return (
        <div className="main-body">
            {props.isLoading ? <div align="center" style={{margin: "50px 10px"}}>
                    <Loader />
                </div> 
            : 
                (
                    <>
                        {props.newsFeed.map(item => {
                            return <NewsFeedItem
                                        key={item.objectID}
                                        id={item.objectID}
                                        num_comments={item.num_comments}
                                        points={item.points}
                                        title={item.title}
                                        url={item.url}
                                        author={item.author}
                                        createdTime={item.created_at}
                                        handleUpvote={props.handleUpvote}
                                        handleNewsHide={props.handleNewsHide} />
                        })}
                        { props.isMore && <IsMore handleFetchMore={props.handleFetchMore} /> }
                    </>
                )
            }
            
        </div>
    )
}
