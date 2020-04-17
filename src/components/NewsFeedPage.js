import React, { Component } from 'react';
import axios from 'axios';

import Header from './Header';
import Body from './Body';
import {getHiddenFeed, setHiddenFeed} from './../services/storage';

import './newsFeed.css';

export default class NewsFeedPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            error: "",
            newsFeed: [],
            isActive: {top: true, new: false},
            isMore: false,
            currentPage: 0,
            hiddenFeed: []
        }
    }

    handleFetchMore = () => {

        this.fetchNewsFeed(null, true);
    }

    handleFeedType = (type) => {
        
        this.fetchNewsFeed(type);
    }

    fetchNewsFeed = (feedType, fetchMore) => {

        this.setState({ loading: true });

        let newActive = {};
        let feedTypeUrl = '';
        let pageNum = '';

        if(feedType) {
            pageNum = "";
        } else if(fetchMore) {
            pageNum = "&page=" + (this.state.currentPage + 1);
        } else if(this.state.currentPage > 0) {
            pageNum = "&page=" + this.state.currentPage;
        }

        if(feedType) {
            newActive = {top: false, new: false};
            newActive[feedType] = true;
            feedTypeUrl = feedType;
        } else {
            newActive = {...this.state.isActive};
            feedTypeUrl = this.state.isActive.top ? 'top' : 'new';
        }
        feedTypeUrl = (feedTypeUrl === "new") ? "search_by_date" : "search";

        axios.get(`https://hn.algolia.com/api/v1/${feedTypeUrl}?tags=front_page${pageNum}`)
        .then(result => {
            if(result.data.hits.length) {

                let hiddenFeed = this.state.hiddenFeed;
                let feed = result.data.hits;

                let newData = feed.filter(item => (hiddenFeed.indexOf(item.objectID) > -1) ? false : true);
                let oldData = this.cloneReferenceData(this.state.newsFeed);
                let finaData = (feedType) ? [...newData] : [...newData, ...oldData];

                let isMore = this.checkForMore(result);

                this.setState({
                    newsFeed: [...finaData], 
                    loading: false, 
                    isMore, 
                    currentPage: result.data.page, 
                    isActive: {...newActive},
                    error: ''
                });
            } else {
                this.setState({
                    newsFeed: [], error: "No data found", loading: false, isMore: false
                });
            }
            
        })
        .catch(error => {
            this.setState({
                newsFeed: [], error: error.message, loading: false
            });
        })
    }

    checkForMore = (result) => {
        return !((result.data.page + 1) === result.data.nbPages);
    }

    cloneReferenceData = (obj) => {
        return JSON.parse(JSON.stringify(obj));
    }

    handleUpvote = id => {

        let newData = this.cloneReferenceData(this.state.newsFeed);

        for(let i=0; i<newData.length; i++) {
            if(newData[i].objectID === id) {
                newData[i].points = (newData[i].points + 1);
                break;
            }
        }
        
        this.setState({
            newsFeed: [...newData]
        });
    }

    handleNewsHide = id => {

        let newHiddenFeed = this.state.hiddenFeed;
        let oldData = this.cloneReferenceData(this.state.newsFeed);
        let newData = [];

        for(let i=0; i<oldData.length; i++) {
            if(oldData[i].objectID === id) {
                newHiddenFeed.push(id);
            } else {
                newData.push(oldData[i]);
            }
        }
        
        setHiddenFeed(newHiddenFeed);
        this.setState({
            hiddenFeed: [...newHiddenFeed],
            newsFeed: [...newData]
        });
    }

    componentDidMount() {
        this.setState({
            hiddenFeed: getHiddenFeed()
        })
        this.fetchNewsFeed();
    }

    render() {
        return (
            <div className="main">
                <Header 
                    isLoading={this.state.loading}
                    isActive={this.state.isActive} 
                    handleClick={this.handleFeedType} />

                <Body
                    isLoading={this.state.loading}
                    newsFeed={this.state.newsFeed}
                    handleUpvote={this.handleUpvote}
                    handleNewsHide={this.handleNewsHide}
                    handleFetchMore={this.handleFetchMore}
                    isMore={this.state.isMore} />
            </div>
        )
    }
}
