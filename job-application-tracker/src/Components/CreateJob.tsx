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
        resume: string
    }
    
    const params = useParams()
    const [payload, setpayload] = useState<Job>({company:"",title:"",status:"",description:"", resume:""})
    
    function onChangeCompany(e: React.ChangeEvent<HTMLInputElement>){
        setpayload({...payload, company: e.target.value})
    }

    function onChangeTitle(e: React.ChangeEvent<HTMLInputElement>){
        setpayload({...payload, title: e.target.value})
    }

    function onChangeStatus(e: React.ChangeEvent<HTMLInputElement>){
        setpayload({...payload, status: e.target.value})
    }

    function onChangeDescription(e: React.ChangeEvent<HTMLInputElement>){
        setpayload({...payload, description: e.target.value})
    }

    function onChangeResume(e: React.ChangeEvent<HTMLInputElement>){
        if(e.target.files === null) return
        setpayload({...payload, resume: e.target.files[0].name})
    }

    async function resumeSubmit(target: React.FormEvent<HTMLFormElement> ){
        const formData = new FormData(target.currentTarget)
        const file = formData.get("file")
        const filename = target.currentTarget.file.files[0].name
        try{
            
            const {data} = await axios.get(`http://localhost:5000/users/presignedResume/${params.id}/${filename}`)
            const { uploadUrl, key } = data;
    
            await axios.put(uploadUrl, file);
            return key;
        }
        catch(e){console.log("Resume upload error is "+e)}
    }
    //update append to specified users jobs array
    async function submitApplication(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault()
        await resumeSubmit(e)
        axios.put(`http://localhost:5000/users/add/${params.id}`, {payload})
        .then(() => {
            console.log("success")
            window.location.assign(`http://localhost:3000/board/${params.id}`)
        })
        .catch(e => console.log("Error "+e))
    }

    return (
        <div className="background">
            <Navbar></Navbar>
            <form className="form" onSubmit={submitApplication}>
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
                    <span>Status (Waiting/Interview/Result)</span>
                    <input required placeholder="" onChange={onChangeStatus} type="text" className="input"/>

                </label>
                <label>
                    <span>Description</span>
                    <input required placeholder="" type="text" onChange={onChangeDescription} className="area"/>
                </label>
                <label>
                    <span>Resume</span>
                    <input type="file" accept="application/pdf" name="file" onChange={onChangeResume}/>
                </label>
                <button className="submit" type="submit">Create</button>
            </form>
        </div>
    )
}

export default CreateJob;