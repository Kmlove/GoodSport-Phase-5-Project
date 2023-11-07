import sportsBalls from "../IMAGES/photo-sports-balls.jpg"


function Header(){
    return(
        <header className="header">
            <img className="logo" src={sportsBalls} alt="Sports Balls Array" />
            <h1 className="app-title"><span className="good">Good</span><span className="sport">Sport</span></h1>
            <img className="logo" src={sportsBalls} alt="Sports Balls Array" />
      </header>
    )
}

export default Header;