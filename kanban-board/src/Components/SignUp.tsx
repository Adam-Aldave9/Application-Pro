import React from "react";
import {useState} from "react"
import axios from "axios";
import {Link} from "react-router-dom"
import "../Styles/login.css"

function SignUp(): JSX.Element{
    const [newUser, setNewUser] = useState({
        username: "",
        password: ""
    })

    const [exists, setExists] = useState("")

    function onChangeUsername(e: React.ChangeEvent<HTMLInputElement>): void{
        setNewUser({
            ...newUser,
            username: e.target.value
        })
    }

    function onChangePassword(e: React.ChangeEvent<HTMLInputElement>): void{
        setNewUser({
            ...newUser,
            password: e.target.value
        })
    }

    function signUp(): void{
        axios.post("http://localhost:5000/users/createuser", newUser)
        .then(res => {
            console.log(res.data); 
            window.location.assign("http://localhost:3000/");
        })
        .catch(err => {
            let userExists = `Error: MongoServerError: E11000 duplicate key error collection: Database1.users index: username_1 dup key: { username: "${newUser.username}" }`;
            if(err.response.data === userExists){
                console.log("user exists")
                setExists("User exists")
            }
            console.log(err)
        })
    }

    return (
        <div className="background">
            <div className="login">
                <h1 className="components">Job Tracker</h1>
                <h4>Sign up to continue</h4>
                <div className="components"><input onChange={onChangeUsername} type="text"></input><br></br></div>
                <div className="components bottom"><input onChange={onChangePassword} type="text"></input><br></br></div>
                <div className="button-format">
                    <button onClick={signUp}>Sign up
                    <div className="arrow-wrapper"><div className="arrow"></div>
                    </div>
                </button>
                </div>
                <div className="link"><Link to="/" className="link">Back</Link></div>
                <div className="components bottom">{exists}</div>
            </div>
        </div>
    )
}

export default SignUp;