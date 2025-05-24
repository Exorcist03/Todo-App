import React, { useState } from 'react'
import './Loginsignup.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Loginsignup = () => {
  const navigate = useNavigate();
  const [signup, setlogin] = useState("signup");
  const [formdata, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
const changeHandler = (e) => {
  console.log("field changed:", e.target.name, "→", e.target.value);
  setFormData({...formdata, [e.target.name] : e.target.value});
}


const login = async () => {
  console.log("login func triggered");
  try {
    let resp = await axios.post("http://localhost:3000/signin", {email: formdata.email, password: formdata.password});
    if(resp.data.success) {
      localStorage.setItem('auth-token', resp.data.token);
      // window.location.replace('/land');
      navigate('/land');
    }
    else alert(resp.data.msg);
  } catch (error) {
    // console.log(error.response.data.msg);
    alert(error.response.data.msg);
  }
}

const signupfun = async () => {
  console.log("signup func triggered");
  try {
      let resp = await axios.post('http://localhost:3000/signup', {username: formdata.username, email: formdata.email, password: formdata.password});
      if(resp.data.success) {
      localStorage.setItem('auth-token', resp.data.token);
      // console.log("auth token stored is ", );
      // window.location.href = '/land';
      navigate('/land');
  }  else alert(resp.msg);
  } 
  catch (error) {
    // console.log(error.response);
    alert(error.response.data.msg);
  }
}
  return (
    <div className='login'>
      {(signup === "signup") ? <div className="box">
        <input name='username' type="text" value={formdata.username} onChange={changeHandler} placeholder='Username' />
        <input name='email' type="text" value={formdata.email} onChange={changeHandler} placeholder='e-mail' />
        <input name='password' type="text" value={formdata.password} onChange={changeHandler} placeholder='Password' />
        <button onClick={signupfun}>Signup</button>
        <div className="choice">Already have an account, <span onClick={() => setlogin("login")}>sign in</span> </div>
      </div> 
      : 
      <div className="box">
        <input  name='email' type="text" value={formdata.email} onChange={changeHandler} placeholder='e-mail' />
        <input name='password' type="text" value={formdata.password} onChange={changeHandler} placeholder='Password' />
        <button onClick={login}>Login</button>
        <div className="choice">Create a new account, <span onClick={() => setlogin("signup")}>signup</span> </div>
      </div>}
    </div>
  )
}

export default Loginsignup
