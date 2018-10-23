import React from 'react';

export default ({ isLoading, error }) => {
    if (isLoading) {
        return <div id='loader'></div>;
    } else if (error) {
        return <div>Sorry, there was a problem loading the page.</div>;
    }
    return null;
};