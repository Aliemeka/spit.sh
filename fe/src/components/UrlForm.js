import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'


import './Form.css'

const UrlForm = () => {
    const [loading, setLoading] = useState(false);
    const [shortLink, setShortLink] = useState('');
    const [errorMessage, setError] = useState('');
    const [isCopied, setCopied] = useState(false);

    const copyUrl = async shortLink =>{
        navigator.clipboard.writeText(shortLink);
        setCopied(true);
        await setTimeout(() => {
            setCopied(false);
        }, 3000);
    }

    const getShortenedLink = urlData =>{
        setLoading(true);
        // axios.defaults.headers = {
        //     'content-type': "application/json"
        // };
        axios.post("https://spit-sh.herokuapp.com/generate", urlData)
        .then(res =>{
            setLoading(false);
            const generatedData = res.data;
            const { shortenUrl } = generatedData;
            setShortLink(shortenUrl);
            setError('')
        })
        .catch(err =>{
            setLoading(false);
            console.log(err.message);
            setError('Slug is already in use.');
            setShortLink('');
        })
    }

    const formik = useFormik({
        initialValues: {
          longUrl: '',
          slug: ''
        },
        validationSchema: Yup.object({
            longUrl: Yup.string().required("You have to enter a URL").url("Please enter a valid URL")
        }),
        onSubmit: values => {
          getShortenedLink({url: values.longUrl, slug: values.slug});
        },
      });
    return (
        <form className="main-form" onSubmit={formik.handleSubmit}> 
            <header className="form-header">
                <h3 className="text-center form-heading">Enter your url</h3>
            </header>
            <hr className="line"/>
            <div className="form-body">
                <div className="form-group">
                    <label className="form-label" htmlFor="longUrl">Long URL<span className="text-needed">*</span></label>
                    <input className="form-text" name="longUrl" id="longUrl" placeholder="https://www.facebook.com" onChange={formik.handleChange} value={formik.values.longUrl}/>
                    {formik.touched.longUrl && formik.errors.longUrl ? (
                            <p className="form-error">{formik.errors.longUrl}</p>
                        ) : null}

                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="slug">Custom slug</label>
                    <input className="form-text" name="slug" id="slug" placeholder="Enter a custom slug (Optional)"
                    onChange={formik.handleChange} value={formik.values.slug}/>
                    {errorMessage ? (
                            <p className="form-error">{errorMessage}</p>
                        ) : null}
                </div>
                <div className="form-group">
                    <button type="submit" className="form-button">Shorten Link</button>
                </div>
            </div>
            {
                loading ? 
                (<div className="loading"/>):
                shortLink && (
                    <div className="form-footer" onClick={()=>copyUrl(shortLink)}>
                        <p className="link-name">{shortLink}</p>
                        <div className="short-link">{isCopied ? 'Copied!' : 'Copy'}</div>
                    </div>
                )
            }
            
            
        </form>
    );
}

export default UrlForm
