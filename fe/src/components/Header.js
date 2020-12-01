import './Header.css'

import logo from '../assets/logo.png'

const Header = () => {
    return (
        <header className="header">
            <a href="/" rel="noreferrer no-openner" className="m-0">
                <img src={logo} alt="spit.sh logo" className="App=logo"/>
            </a>
        </header>
    )
}

export default Header
