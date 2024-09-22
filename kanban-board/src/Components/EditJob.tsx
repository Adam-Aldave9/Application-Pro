import React from "react";
import Navbar from "./Navbar";
import {Link} from "react-router-dom"
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/createjob.css";
import "../Styles/editjob.css";

function EditJob(){
    interface Job{
        company: string,
        title: string,
        status: string,
        description: string,
        resume: string
    }
    
    const params = useParams<{id: string, index: string}>()
    const [data, setData] = useState<Job>({company:"",title:"",status:"",description:"", resume:""})
    const [oldResume, setOldResume] = useState("")
  
    useEffect(() => {
        getUser()
    }, [])

    function getUser(){
        axios.get(`http://localhost:5000/users/${params.id}`)
        .then(res => {
            let number = Number(params.index)
            let user = res.data.jobs[number]
            setData(user)
            setOldResume(user.resume)
        })
        .catch((e) => console.log("Error "+e))
    }

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
        if(e.target.files === null) return 
        setData({...data, resume: e.target.files[0].name})
    }

    async function resumeSubmitEdit(target: React.FormEvent<HTMLFormElement> ){
        const formData = new FormData(target.currentTarget)
        const file = formData.get("file_")
        if(file === null) return null
        else await deleteResume("update")
        const filename = data.resume
        try{
            
            const {data} = await axios.get(`http://localhost:5000/users/presignedResume/${params.id}/${filename}`)
            console.log(data)
            const { uploadUrl, key } = data;
    
            await axios.put(uploadUrl, file);
            return key;
        }
        catch(e){console.log("Resume upload error is "+e)}
    }

    // delete resume file
    //when full job deletion or resume is update and need to delete old one
    async function deleteResume(deleteType : string){
        let filename = ""
        if(deleteType === "delete"){
            filename = data.resume
        }
        else if(deleteType === "update") filename = oldResume
        await axios.delete(`http://localhost:5000/users/deleteResume/${params.id}/${filename}`)
    }
    //update append to specified users jobs array
    async function submitApplicationEdit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault()
        await resumeSubmitEdit(e)
        console.log(data)
        axios.put(`http://localhost:5000/users/update/${params.id}/${params.index}`, {data})
        .then(() => {
            console.log("success")
            window.location.assign(`http://localhost:3000/board/${params.id}`)
        })
        .catch(e => console.log("Error "+e))
    }

    async function deleteJob(e: React.MouseEvent<HTMLButtonElement, MouseEvent>){
        e.preventDefault()
        await deleteResume("delete")
        axios.delete(`http://localhost:5000/users/delete/${params.id}/${params.index}`)
        .then(() => {
            console.log("Deletion success")
            window.location.assign(`http://localhost:3000/board/${params.id}`)
        })
        .catch(e => console.log("Error "+e))
    }

    return (
        <div className="background">
            <Navbar link=""></Navbar>
            <form className="form" onSubmit={submitApplicationEdit}>
                <div><Link to={`/board/${params.id}`} className="back">{"< "}Back</Link></div>
                <p className="title">Edit Application</p>
                <label>
                    <span>Company</span>
                    <input value={data.company} required placeholder="" onChange={onChangeCompany}type="text" className="input"/>
                    
                </label>
                  
            
                <label>
                    <span>Position Title</span>
                    <input value={data.title} required placeholder="" onChange={onChangeTitle} type="text" className="input"/>
                    
                </label> 
        
                <label>
                    <span>Status (Waiting/Interview/Result)</span>
                    <input  value={data.status} required placeholder="" onChange={onChangeStatus} type="text" className="input"/>

                </label>
                <label>
                    <span>Description</span>
                    <input  value={data.description} required placeholder="" type="text" onChange={onChangeDescription} className="area"/>
                </label>
                <label>
                    <span>Resume</span>
                    <input type="file" accept="application/pdf" name="file_" onChange={onChangeResume}/>
                </label>
                <button className="submit" type="submit">Edit</button>
                <button className="submit" onClick={deleteJob}>Delete Application</button>
            </form>
        </div>
    )
}

export default EditJob;