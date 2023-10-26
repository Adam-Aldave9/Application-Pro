import React from "react";
import {Link} from "react-router-dom";
import "../Styles/navbar.css";

function Navbar(prop: any){
    
    return (
        <div className="wrapper">
            <nav>Job Tracker</nav>
            {prop.link}
            <Link className="out" to="/"> {"< Sign out"}</Link>
        </div>
    )
}

export default Navbar;