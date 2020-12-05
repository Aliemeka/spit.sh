import { useEffect, useState } from 'react'
import { Redirect, useLocation } from 'react-router-dom'
import axios from 'axios'

const Redirects = () => {
    const { pathname } = useLocation();
    const [pathNotFound, isNotFound] = useState(false);

    console.log(pathname);

    const redirectToSite = siteURL =>{
        window.location.replace(siteURL);
    }

    const getRedirectSite = pathname =>{
        axios.defaults.headers = {
            'content-type': "application/json"
        };
        axios.get(`http://localhost:8000/get-redirect-url${pathname}`)
        .then(res =>{
            const redirectURL = res.data.redirectsTo;
            console.log(res.data)
            redirectToSite(redirectURL)
        })
        .catch(err =>{
            console.log(err.message);
            isNotFound(true)
        })
    }

    useEffect(() => {
        getRedirectSite(pathname)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return(
        pathNotFound && <Redirect to="/not-found"/>
    )
}

export default Redirects
