import React from "react";
import {useEffect} from "react"
import {useState} from "react"
import axios from "axios";
import {useParams} from "react-router-dom";
import {Link} from "react-router-dom"
import Navbar from "./Navbar";
import "../Styles/board.css"
/*
Should display all user jobs which includes the details of each job
*/
function Board(){
    /*************************DONT TOUCH THIS**************************** */
    const params = useParams()
    const [doc, setDoc] = useState({
        _id: "",
        username: "",
        password: "",
        jobs: [{
            company: "",
            title: "",
            status: "",
            description: "",
            resume: 0
        }]
    })

    const [rerender, setRerender] = useState("Loading")
    useEffect(() =>{ //get user document and load jobs to state
        fetchData()
    }, [])

    async function fetchData(){
        const id = params.id
        await axios.get(`http://localhost:5000/users/${id}`) //returns a single object in this case. Not wrapped in array
        .then(res => {
            setDoc(res.data)
            setRerender("Loaded")
        })
    }
    /**********************************************/

    function jobsToDo(){//will return table of jobs
        return doc.jobs.map((document, index) => {
            if(document.status === "To Do")
                return <Document company={document.company} title={document.title} description={document.description} resume={document.resume} idx={index}></Document>
        })
    }

    function jobsWaiting(){
        return doc.jobs.map((document, index) => {
            if(document.status === "Waiting")
                return <Document company={document.company} title={document.title} description={document.description} resume={document.resume} idx={index}></Document>
        })
    }

    function jobsInterview(){
        return doc.jobs.map((document, index) => {
            if(document.status === "Interview")
                return <Document company={document.company} title={document.title} description={document.description} resume={document.resume} idx={index}></Document>
        })
    }

    function jobsResult(){
        return doc.jobs.map((document, index) => {
            if(document.status === "Result")
                return <Document company={document.company} title={document.title} description={document.description} resume={document.resume} idx={index}></Document>
        })
    }

    function Document(props:any){
        return(
            <div className="item">
                <h2>{props.company}</h2>
                <div>Title: {props.title}</div>
                <p>{props.description}</p>
                <div>Resume: {props.resume}</div>
                <div><Link className="to-edit" to={`/edit/${params.id}/${props.idx}`}>{"Edit"}</Link></div>
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
                <section className="board-primary">
                    <div className="ticket-columns">{jobsToDo()}</div>
                    <div className="ticket-columns">{jobsWaiting()}</div>
                    <div className="ticket-columns">{jobsInterview()}</div>
                    <div className="ticket-columns">{jobsResult()}</div>
                </section>
            </div>
            )}
        </div>
    )
}

export default Board;