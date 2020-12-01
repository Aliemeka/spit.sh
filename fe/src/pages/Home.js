import UrlForm from '../components/UrlForm'

const Home = () => {
    return (
        <main className="App-main">
            <h1 className="text-center heading">Shorter urls for your pages</h1>
            <p className="text-center paragraph">
            Create short quick links with custom slugs
            </p>
            <UrlForm/>
      </main>
    )
}

export default Home
