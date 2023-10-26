import React from "react";
import Navbar from "./Navbar";
import {Link, useParams} from "react-router-dom"
import { useState } from "react";
import axios from "axios";
import "../Styles/createjob.css";

function CreateJob(){
    interface Job{
        company: string,
        title: string,
        status: string,
        description: string,
        resume: number
    }
    
    const params = useParams()
    const [data, setData] = useState<Job>({company:"",title:"",status:"",description:"", resume:0})
    
    function onChangeCompany(e: React.ChangeEvent<HTMLInputElement>){
        setData({...data, company: e.target.value})
    }

    function onChangeTitle(e: React.ChangeEvent<HTMLInputElement>){
        setData({...data, title: e.target.value})
    }

    function onChangeStatus(e: React.ChangeEvent<HTMLInputElement>){
        setData({...data, status: e.target.value})
    }

    function onChangeDescription(e: React.ChangeEvent<HTMLInputElement>){
        setData({...data, description: e.target.value})
    }

    function onChangeResume(e: React.ChangeEvent<HTMLInputElement>){
        setData({...data, resume: Number(e.target.value)})
    }

    //update append to specified users jobs array
    function submitApplication(e: React.MouseEvent<HTMLButtonElement, MouseEvent>){
        e.preventDefault()
        axios.put(`http://localhost:5000/users/add/${params.id}`, {data})
        .then(() => {
            console.log("success")
            window.location.assign(`http://localhost:3000/board/${params.id}`)
        })
        .catch(e => console.log("Error "+e))
    }

    return (
        <div className="background">
            <Navbar></Navbar>
            <form className="form">
                <div><Link to={`/board/${params.id}`} className="back">{"< "}Back</Link></div>
                <p className="title">Create Application</p>
                <label>
                    <span>Company</span>
                    <input required placeholder="" onChange={onChangeCompany}type="text" className="input"/>
                    
                </label>
                  
            
                <label>
                    <span>Position Title</span>
                    <input required placeholder="" onChange={onChangeTitle} type="text" className="input"/>
                    
                </label> 
        
                <label>
                    <span>Status (Backlog/Waiting/Interview/Result)</span>
                    <input required placeholder="" onChange={onChangeStatus} type="text" className="input"/>

                </label>
                <label>
                    <span>Description</span>
                    <input required placeholder="" type="text" onChange={onChangeDescription} className="area"/>
                </label>
                <label>
                    <span>Resume</span>
                    <input type="file"/>
                </label>
                <button className="submit" onClick={submitApplication}>Create</button>
            </form>
        </div>
    )
}

export default CreateJob;