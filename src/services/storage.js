
export const getHiddenFeed = () => {

    const storage = window.localStorage || window.sessionStorage;

    let feed = storage.getItem("hiddenFeed");
    if(feed) {
        feed = JSON.parse(feed);
    } else {
        feed = [];
    }

    return feed;
}

export const setHiddenFeed = (feed) => {
    
    const storage = window.localStorage || window.sessionStorage;

    storage.setItem("hiddenFeed", JSON.stringify(feed));
    return;
}