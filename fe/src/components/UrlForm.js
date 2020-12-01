import './Form.css'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const UrlForm = () => {

    const formik = useFormik({
        initialValues: {
          longUrl: '',
          slug: ''
        },
        validationSchema: Yup.object({
            longUrl: Yup.string().required("You have to enter a URL").url("Please enter a valid URL")
        }),
        onSubmit: values => {
          alert(JSON.stringify(values, null, 2));
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
                    <input className="form-text" name="longUrl" id="longUrl" placeholder="https://www.facebook.com" onChange={formik.handleChange} value={formik.values.firstName}/>
                    {formik.touched.longUrl && formik.errors.longUrl ? (
                            <p className="form-error">{formik.errors.longUrl}</p>
                        ) : null}

                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="slug">Custom slug</label>
                    <input className="form-text" name="slug" id="slug" placeholder="Enter a custom slug (Optional)"/>
                </div>
                <div className="form-group">
                    <button type="submit" className="form-button">Generate URL</button>
                </div>
            </div>
        </form>
    )
}

export default UrlForm
