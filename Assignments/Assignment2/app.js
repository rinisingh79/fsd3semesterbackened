const express = require("express");

const app = express();
const PORT = 3000;

// Middleware to read JSON data
app.use(express.json());

// Student data
let students = [
    {
        id: 1,
        name: "Rini",
        age: 20,
        course: "CSE"
    },
    {
        id: 2,
        name: "Aman",
        age: 21,
        course: "CSE"
    }
];

// Home route
app.get("/", (req, res) => {
    res.send("Student REST API is running");
});


// 1. POST - Add a new student
app.post("/students", (req, res) => {

    const newStudent = {
        id: students.length + 1,
        name: req.body.name,
        age: req.body.age,
        course: req.body.course
    };

    students.push(newStudent);

    res.status(201).json({
        message: "Student added successfully",
        student: newStudent
    });
});


// 2. GET - Retrieve all students
app.get("/students", (req, res) => {

    res.json(students);

});


// 3. PUT - Update a student by ID
app.put("/students/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const index = students.findIndex(student => student.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    students[index] = {
        id: id,
        name: req.body.name,
        age: req.body.age,
        course: req.body.course
    };

    res.json({
        message: "Student updated successfully",
        student: students[index]
    });

});


// 4. DELETE - Delete a student by ID
app.delete("/students/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const index = students.findIndex(student => student.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    const deletedStudent = students.splice(index, 1)[0];

    res.json({
        message: "Student deleted successfully",
        student: deletedStudent
    });

});


// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});