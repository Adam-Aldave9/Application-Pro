import React from "react";
import {useEffect} from "react"
import {useState} from "react"
import axios from "axios";
import {useParams} from "react-router-dom";
import {Link} from "react-router-dom"
import Navbar from "./Navbar";
import "../Styles/board.css"
/*
Display all user jobs which includes the details of each job
*/
function Board(): JSX.Element{
    interface Document{
        company: string,
        title: string,
        idx: number,
        description: string,
        resume: string
    }

    interface Job{
        company: string,
        title: string,
        status: string,
        description: string,
        resume: string
    }

    const params = useParams<{id: string}>()
    const [doc, setDoc] = useState({
        _id: "",
        username: "",
        password: "",
        jobs: [{
            company: "",
            title: "",
            status: "",
            description: "",
            resume: ""
        }]
    })

    const [rerender, setRerender] = useState("Loading")
    const [isDocLoaded, setIsDocLoaded] = useState(false)
    const [finalLoad, setFinalLoad] = useState(false)

    useEffect(() =>{ //get user document and load jobs to state
        if(isDocLoaded === false) fetchData()
        else if (rerender === "Loading") {
            loadResumeURLs()
        }
    }, [isDocLoaded, rerender])
    
    

    function fetchData(): void{
        const id = params.id
        axios.get(`http://localhost:5000/users/${id}`) //returns a single object in this case. Not wrapped in array
        .then(res => {
            setDoc(res.data)
            setIsDocLoaded(true) 
        })
        .catch(e => console.log("error is"+e))
    }

    function loadResumeURLs(): void{
        const id = params.id
        doc.jobs.map((document: Job, index: number) => {
            console.log("The current document resume is "+document.resume)
            axios.get(`http://localhost:5000/users/getPresignedResumeDownload/${id}/${document.resume}`)
            .then((url) => {
                const downloadURL = url.data.uploadUrl
                doc.jobs[index].resume = downloadURL
                if(index === doc.jobs.length - 1) setFinalLoad(true)
            })
            .catch(error => console.log("load resume url error is "+error))
        })
        setRerender("Loaded") 
    }

    function jobsToDo(): (JSX.Element | undefined)[] {//will return table of jobs
        return doc.jobs.map((document: Job, index: number) => {
            if(document.status === "To Do")
                return <Document company={document.company} title={document.title} description={document.description} resume={document.resume} idx={index}></Document>
        })
    }

    function jobsWaiting(): (JSX.Element | undefined)[] {
        return doc.jobs.map((document: Job, index: number)=> {
            if(document.status === "Waiting")
                return <Document company={document.company} title={document.title} description={document.description} resume={document.resume} idx={index}></Document>
        })
    }

    function jobsInterview(): (JSX.Element | undefined)[] {
        return doc.jobs.map((document: Job, index: number) => {
            if(document.status === "Interview")
                return <Document company={document.company} title={document.title} description={document.description} resume={document.resume} idx={index}></Document>
        })
    }

    function jobsResult(): (JSX.Element | undefined)[] {
        return doc.jobs.map((document: Job, index: number) => {
            if(document.status === "Result"){
                return <Document company={document.company} title={document.title} description={document.description} resume={document.resume} idx={index}></Document>
            }
        })
    }

    function Document(props: Document): JSX.Element{
        return(
            <div className="item">
                <h2>{props.company}</h2>
                <div>Title: {props.title}</div>
                <p>{props.description}</p>
                <a className="download-link" href={props.resume}>View Resume </a>
                <div className="edit-button"><Link className="to-edit" to={`/edit/${params.id}/${props.idx}`}>{"Edit"}</Link></div>
            </div>
            
        )
    }

    return (
        <div className="bg">
            {/*IF ? THEN () : ELSE ()*/}
            {rerender === "Loading" ? (<h1>loading</h1>): (
            <div className="bg2">
                <Navbar link={<Link className="to-create" to={`/create/${params.id}`}>{"Create"}</Link>}></Navbar>
                <section className="board-header">
                    <div>To do</div>
                    <div>Waiting</div>
                    <div>Interview</div>
                    <div>Result</div>
                </section>
                {finalLoad === false ? (<h1></h1>) : (
                <section className="board-primary">
                    <div className="ticket-columns">{jobsToDo()}</div>
                    <div className="ticket-columns">{jobsWaiting()}</div>
                    <div className="ticket-columns">{jobsInterview()}</div>
                    <div className="ticket-columns">{jobsResult()}</div>
                </section>
                )}
            </div>
            )}
        </div>
    )
}

export default Board;