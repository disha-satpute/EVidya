import React, {useEffect, useState} from "react";
import axios from "axios";
import "../styles/Leaderboard.css";

export default function LeaderboardPage(){

const [students,setStudents] = useState([]);

useEffect(()=>{
fetchLeaderboard();
},[]);

const fetchLeaderboard = async ()=>{

try{

const token = localStorage.getItem("token");

const res = await axios.get(
"http://localhost:5000/api/leaderboard",
{headers:{Authorization:`Bearer ${token}`}}
);

setStudents(res.data);

}catch(err){
console.error(err);
}

};

const topThree = students.slice(0,3);
const others = students.slice(3);

return(

<div className="leaderboard-container">

<h2 className="leaderboard-title">🏆 Student Leaderboard</h2>

{/* TOP 3 */}

<div className="top-three">

{topThree.map((student,index)=>(
<div key={index} className={`top-card rank-${index+1}`}>

<h3>#{index+1}</h3>

<p className="student-name">{student.full_name}</p>

<span>{student.total_points} pts</span>

</div>
))}

</div>

{/* OTHER RANKS */}

<div className="rank-list">

{others.map((student,index)=>(
<div key={index} className="rank-row">

<span>#{index+4}</span>

<p>{student.full_name}</p>

<span>{student.total_points} pts</span>

</div>
))}

</div>

</div>

);

}