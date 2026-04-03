const pool = require("../config/db");

exports.getLeaderboard = async (req, res) => {

try{

const result = await pool.query(

`SELECT 
full_name,
branch,
total_points
FROM students
ORDER BY total_points DESC`

);

res.json(result.rows);

}catch(err){

console.error(err);
res.status(500).json({message:"Server error"});

}

};