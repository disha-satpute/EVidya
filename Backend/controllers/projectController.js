const pool = require("../config/db");

/* ADD PROJECT */

exports.addProject = async (req,res)=>{

try{

const studentId = req.user.id;

const {
project_title,
description,
technologies,
category,
project_level,
start_date,
end_date,
github_link,
demo_link,
video_link
} = req.body;

const screenshot = req.file ? req.file.path : null;

const result = await pool.query(

`INSERT INTO projects
(student_id,project_title,description,technologies,category,project_level,
start_date,end_date,github_link,demo_link,video_link,screenshot)

VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
RETURNING *`,

[
studentId,
project_title,
description,
technologies,
category,
project_level,
start_date,
end_date,
github_link,
demo_link,
video_link,
screenshot
]

);

res.json(result.rows[0]);

}catch(err){

console.error(err);
res.status(500).json({message:"Server error"});

}

};


/* GET STUDENT PROJECTS */

exports.getStudentProjects = async (req,res)=>{

try{

const studentId = req.user.id;

const result = await pool.query(

`SELECT * FROM projects
WHERE student_id=$1
ORDER BY created_at DESC`,

[studentId]

);

res.json(result.rows);

}catch(err){

console.error(err);
res.status(500).json({message:"Server error"});

}

};


/* DELETE PROJECT */

exports.deleteProject = async (req,res)=>{

try{

const {id} = req.params;

await pool.query(
"DELETE FROM projects WHERE id=$1",
[id]
);

res.json({message:"Project deleted"});

}catch(err){

console.error(err);
res.status(500).json({message:"Server error"});

}

};