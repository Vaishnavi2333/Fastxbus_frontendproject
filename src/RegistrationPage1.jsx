import { BrowserRouter } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function RegistrationPage(){

    const[Registerdetails,setRegisterDetails] = useState({
        "username":"",
        "password":""
    })

    const[initialrecords,setallRecords] = useState([])

    const handleChange = (e) =>{
        const name = e.target.name
        const value = e.target.value
        setRegisterDetails({...Registerdetails,[name]:value})

    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        const newrecords = {...Registerdetails,id:new Date.getTime().toString()}
        setallRecords([...initialrecords,newrecords])

        setRegisterDetails({username:"",password:""})
    }

    const navigate = useNavigate();


    const gotologin=()=>{
        return navigate("/")
    }
   


    return(

        <div  className="container mt-5">

            <form onSubmit={handleSubmit} className="text-start">
                <label htmlFor="username">Username:</label>
                <input type="text" className="form-control" name="username" onChange={handleChange} placeholder="Enter username" value={Registerdetails.username}/>
                <label htmlFor="password">Password:</label>
                <input type="password" className="form-control" name="password" onChange={handleChange} placeholder="Enter password" value={Registerdetails.password} />
                <button type="submit" >Register</button>
                <h2>Account exists already?</h2>
                <button type="button" className="btn btn-success" onClick={gotologin}>Login</button>
            </form>

            

        </div>

        
    )
}