import Layout from '../containers/Layout'
import UrlForm from '../components/UrlForm'

import update from '../assets/Update.png'

const Home = () => {
    return (
        <Layout>
            <main className="App-main">
                <section className="top-section">
                    <div className="img-container">
                        <img src={update} alt="Rocket" className="full-width"/>
                    </div>
                    <div className="content">
                        <h1 className="heading">Shorter urls for your pages</h1>
                        <p className="paragraph">
                        Create short quick links with custom slugs
                        </p>
                    </div>
                </section>
                <UrlForm/>
            </main>
        </Layout>
    )
}

export default Home
