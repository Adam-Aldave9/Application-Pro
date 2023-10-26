import React from "react";
import {useEffect} from "react"
import {useState} from "react"
import axios from "axios";
import {Link} from "react-router-dom"
import "../Styles/login.css"

function Login(){
    const [user, setUser] = useState({
        username: "",
        password: ""
    })
    const [success, setSuccess] = useState("")

    function onChangeUsername(e: React.ChangeEvent<HTMLInputElement>){
        setUser({
            ...user,
            username: e.target.value
        })
    }

    function onChangePassword(e: React.ChangeEvent<HTMLInputElement>){
        setUser({
            ...user,
            password: e.target.value
        })
    }

    function onSignIn(){
        const params = {
            username: user.username,
            password: user.password
        }

        axios.get("http://localhost:5000/users/checkuser", {params} )
        .then(res => {
            if(res.data.length !== 0){
                const id = res.data[0]._id
                setUser({
                    username: "",
                    password: ""
                })
                window.location.assign(`http://localhost:3000/board/${id}`)
            }
            else{
                setSuccess("Incorrect Login")
            }
        })
        .catch(err => console.log("Error: "+err))
    }

    return(
        <div className="background">
            <div className="login">
                <h1 className="components">Job Tracker</h1>
                <h4>Log in to continue</h4>
                <div className="components"><input value={user.username} onChange={onChangeUsername} type="text"></input><br></br></div>
                <div className="components bottom"><input value={user.password} onChange={onChangePassword} type="text"></input><br></br></div>
                <div className="button-format">
                    <button onClick={onSignIn} >Sign in
                    <div className="arrow-wrapper"><div className="arrow"></div>
                    </div>
                    </button>
                </div>
                <div className="components bottom">{success}</div>
                <div className="link"><Link to="/signup" className="link">Create an account</Link></div>

            </div>
        </div>
    )
}

export default Login;