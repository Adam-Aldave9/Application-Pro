import React from 'react';
import "./Styles/main.css"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Board from './Components/Board';
import CreateJob from './Components/CreateJob';
import EditJob from './Components/EditJob';
import Login from './Components/Login';
import SignUp from './Components/SignUp';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
            <Route path="/" element={<Login></Login>}></Route> {/**Root route/home */}
            <Route path="/signup" element={<SignUp></SignUp>}></Route>
            <Route path="/board/:id" element={<Board></Board>}></Route>
            <Route path="/create/:id" element={<CreateJob></CreateJob>}></Route> 
            <Route path="/edit/:id/:index" element={<EditJob></EditJob>}></Route>   
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
