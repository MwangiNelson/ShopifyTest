import React from 'react'

const RestFetch = () => {
    const client = new shpoify.clients.Rest({ session });
    const response = client.get({ path: 'shop' });

    return (
        <div>RestFetch</div>
    )
}

export default RestFetch