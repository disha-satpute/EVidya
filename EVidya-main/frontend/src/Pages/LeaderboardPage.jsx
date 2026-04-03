import React, {useEffect, useState} from "react";
import axios from "axios";
import "../styles/Leaderboard.css";
import confetti from "canvas-confetti";


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

useEffect(() => {
  const duration = 3 * 1000;
  const end = Date.now() + duration;

  const colors = ["#facc15", "#60a5fa", "#f472b6", "#34d399"];

  (function frame() {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 70,
      origin: { x: 0 },
      colors: colors,
    });
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 70,
      origin: { x: 1 },
      colors: colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}, []);

return(

<div className="leaderboard-container">

<h2 className="leaderboard-title">🏆 Student Leaderboard</h2>

{/* TOP 3 */}

<div className="top-three">

  {/* 2nd Rank - LEFT */}
  {topThree[1] && (
    <div className="top-card rank-2">
      <div className="trophy">🥈</div>
      <h3 className="rank-title">2nd Ranker</h3>
      <p className="student-name">{topThree[1].full_name}</p>
      <span className="points">{topThree[1].total_points} Points</span>
    </div>
  )}

  {/* 1st Rank - CENTER */}
  {topThree[0] && (
    <div className="top-card rank-1">
      <div className="trophy big">🏆</div>
      <h3 className="rank-title">1st Ranker</h3>
      <p className="student-name">{topThree[0].full_name}</p>
      <span className="points">{topThree[0].total_points} Points</span>
    </div>
  )}

  {/* 3rd Rank - RIGHT */}
  {topThree[2] && (
    <div className="top-card rank-3">
      <div className="trophy">🥉</div>
      <h3 className="rank-title">3rd Ranker</h3>
      <p className="student-name">{topThree[2].full_name}</p>
      <span className="points">{topThree[2].total_points} Points</span>
    </div>
  )}

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