import React, { useEffect, useState } from 'react'
import './Landingpage.css'
import axios from 'axios';


const Landingpage =  () => {
  const [todo, settodos] = useState([]);
  const [title, settitle] = useState("");
  const [desc, setdesc] = useState("");
  const [refresh, setrefresh] = useState(true);
  useEffect( ()=> {
   const updatetodo =  async () => {
      try{
        const resp = await axios.get("http://localhost:3000/gettodo", {headers:{"auth-token" : localStorage.getItem('auth-token')}});
        // console.log(resp.data);
        settodos(resp.data);
      }  
      catch(error) {
      alert(error);
      }
      setrefresh(false);
    }
    if(refresh) updatetodo();
  }, [refresh]);

const addTodo = async () => {
  console.log(title, desc);
  // add this to this users todo arry and then fetch it and display it on screen
  try{
    await axios.post("http://localhost:3000/addtodo", {title: title, description: desc}, {
      headers: {
        "auth-token": localStorage.getItem("auth-token")
      }
    });
    // console.log("resp ", resp);
  }catch(error) {
    alert(error);
  }
  // when adding then also update the todo vector
  setrefresh(true);
};

const markdone = async (idx) => {
  try {
      await axios.post("http://localhost:3000/update", {idx}, {headers : {
      "auth-token": localStorage.getItem('auth-token')
    }});
  } 
  catch (error) {
      alert(error);
  }
  setrefresh(true);
};

  return (
    <div className='landing-page'>
      <div className="left">
        <h1> Please enter your today's todo </h1>
        <div className="left-box">
          <input type="text" onChange={(e) => {settitle(e.target.value)}} placeholder='Title' />
          <input type="text" onChange={(e) => {setdesc(e.target.value)}} placeholder='Description' />
          <button onClick={addTodo}> Add Todo </button>
        </div>
      </div>
      <div className="right">
        <h1> Your list of Todos </h1>
        <div className="right-box">
          {/* here i will fetch the todos for the signed in user */}
          {todo.map((t, index) => {
            return <Showtodo key = {index} idx = {index} title = {t.title} description = {t.description} done = {t.completed} markdone = {markdone}/>
          })}
        </div>
      </div>
    </div>
  )
}
const Showtodo = ({idx, title, description, done, markdone}) => {
  return <div className='todo'  style={{backgroundColor: (done === 'true' ? 'green' : 'red') }}>
    <h2> {title} </h2>
    <h2>{description} </h2>
    <button onClick={() => {markdone(idx)}}> {done === 'true' ? 'Completed!' : 'Done'} </button>
  </div>
}

export default Landingpage
