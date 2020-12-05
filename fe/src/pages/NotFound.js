import Layout from '../containers/Layout'
import pageNotFound from '../assets/Page_not_found.png'

const NotFound = () => {
    return (
        <Layout>
            <main className="App-main">
                <div className="img-container">
                    <img src={pageNotFound} alt="Rocket" className="full-width"/>
                </div>
                <h1 className="heading text-center">Page Not Found</h1>
                <p className="paragraph text-center">
                    We couldn't find the page you were looking for. Please recheck the link and try again. 
                </p>
            </main>
        </Layout>
    )
}

export default NotFound
