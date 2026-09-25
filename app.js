const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const PORT = 3000;

// Location of students.json
const filePath = path.join(__dirname, "students.json");

// Create server
const server = http.createServer((req, res) => {

    const url = new URL(req.url, `http://localhost:${PORT}`);

    // ==========================================
    // HOME PAGE - STUDENT FORM
    // ==========================================

    if (url.pathname === "/" && req.method === "GET") {

        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end(`
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Student Management System</title>

    <style>

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: Arial, sans-serif;

            min-height: 100vh;

            display: flex;
            justify-content: center;
            align-items: center;

            background: linear-gradient(
                135deg,
                #667eea,
                #764ba2
            );

            padding: 20px;
        }

        .container {
            width: 100%;
            max-width: 550px;

            background: white;

            padding: 40px;

            border-radius: 20px;

            box-shadow:
                0 20px 50px rgba(0, 0, 0, 0.25);
        }

        h1 {
            text-align: center;
            color: #333;

            margin-bottom: 10px;
        }

        .subtitle {
            text-align: center;
            color: #777;

            margin-bottom: 30px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;

            margin-bottom: 8px;

            font-weight: bold;

            color: #444;
        }

        input {
            width: 100%;

            padding: 13px;

            border: 1px solid #ddd;

            border-radius: 8px;

            font-size: 15px;

            outline: none;
        }

        input:focus {
            border-color: #667eea;

            box-shadow:
                0 0 0 3px rgba(102, 126, 234, 0.15);
        }

        button {
            width: 100%;

            padding: 14px;

            border: none;

            border-radius: 8px;

            background: #667eea;

            color: white;

            font-size: 16px;

            font-weight: bold;

            cursor: pointer;

            transition: 0.2s;
        }

        button:hover {
            background: #5568d9;

            transform: translateY(-2px);
        }

        .records {
            display: block;

            text-align: center;

            margin-top: 20px;

            color: #667eea;

            font-weight: bold;

            text-decoration: none;
        }

        .records:hover {
            text-decoration: underline;
        }

    </style>

</head>

<body>

    <div class="container">

        <h1>🎓 Student Management</h1>

        <p class="subtitle">
            Add a new student record
        </p>

        <form action="/add-student" method="GET">

            <div class="form-group">

                <label for="name">
                    Student Name
                </label>

                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter student name"
                    required
                >

            </div>


            <div class="form-group">

                <label for="roll">
                    Roll Number
                </label>

                <input
                    type="text"
                    id="roll"
                    name="roll"
                    placeholder="Enter roll number"
                    required
                >

            </div>


            <div class="form-group">

                <label for="course">
                    Course
                </label>

                <input
                    type="text"
                    id="course"
                    name="course"
                    placeholder="Enter course"
                    required
                >

            </div>


            <div class="form-group">

                <label for="email">
                    Email
                </label>

                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter email address"
                    required
                >

            </div>


            <button type="submit">
                Add Student
            </button>

        </form>


        <a
            href="/students"
            class="records"
        >
            📋 View Student Records
        </a>

    </div>

</body>

</html>
        `);

        return;
    }


    // ==========================================
    // ADD STUDENT
    // ==========================================

    if (url.pathname === "/add-student" && req.method === "GET") {

        const params = url.searchParams;

        const student = {

            name: params.get("name"),

            roll: params.get("roll"),

            course: params.get("course"),

            email: params.get("email")

        };


        // Read existing students
        fs.readFile(
            filePath,
            "utf8",
            (err, data) => {

                let students = [];


                // If file exists and has data
                if (!err && data.trim() !== "") {

                    try {

                        students = JSON.parse(data);

                    } catch (error) {

                        students = [];

                    }

                }


                // Add new student
                students.push(student);


                // Save updated data
                fs.writeFile(
                    filePath,

                    JSON.stringify(
                        students,
                        null,
                        2
                    ),

                    "utf8",

                    (writeErr) => {

                        if (writeErr) {

                            res.writeHead(500, {
                                "Content-Type": "text/html"
                            });

                            res.end(`
                                <h1>Error saving student record.</h1>
                            `);

                            return;
                        }


                        // Redirect to student records
                        res.writeHead(302, {
                            Location: "/students"
                        });

                        res.end();

                    }
                );

            }
        );

        return;
    }


    // ==========================================
    // STUDENT RECORDS
    // ==========================================

    if (
        url.pathname === "/students" &&
        req.method === "GET"
    ) {

        fs.readFile(
            filePath,
            "utf8",
            (err, data) => {

                if (err) {

                    res.writeHead(500, {
                        "Content-Type": "text/html"
                    });

                    res.end(`
<!DOCTYPE html>
<html>

<head>

    <title>Error</title>

</head>

<body>

    <h1>Error reading student records.</h1>

    <p>
        Make sure students.json exists inside
        the assignment1.1 folder.
    </p>

</body>

</html>
                    `);

                    return;
                }


                let students = [];


                try {

                    students = JSON.parse(data);

                } catch (error) {

                    res.writeHead(500, {
                        "Content-Type": "text/html"
                    });

                    res.end(`
                        <h1>Invalid students.json file.</h1>
                    `);

                    return;
                }


                // Create table rows
                let rows = "";


                students.forEach(
                    (student) => {

                        rows += `

                        <tr>

                            <td class="name">
                                ${student.name}
                            </td>

                            <td>
                                ${student.roll}
                            </td>

                            <td>
                                <span class="course">
                                    ${student.course}
                                </span>
                            </td>

                            <td class="email">
                                ${student.email}
                            </td>

                        </tr>

                        `;

                    }
                );


                // HTML page
                const html = `

<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>Student Records</title>


    <style>

        * {
            box-sizing: border-box;

            margin: 0;

            padding: 0;
        }


        body {

            font-family:
                Arial,
                Helvetica,
                sans-serif;

            min-height: 100vh;

            background:
                linear-gradient(
                    135deg,
                    #667eea,
                    #764ba2
                );

            padding: 50px 20px;

        }


        .container {

            max-width: 1000px;

            margin: auto;

            background: white;

            padding: 40px;

            border-radius: 20px;

            box-shadow:
                0 20px 50px
                rgba(0, 0, 0, 0.25);

        }


        .header {

            text-align: center;

            margin-bottom: 30px;

        }


        .header h1 {

            font-size: 36px;

            color: #333;

            margin-bottom: 10px;

        }


        .header p {

            color: #777;

            font-size: 16px;

        }


        .table-container {

            width: 100%;

            overflow-x: auto;

        }


        table {

            width: 100%;

            border-collapse: collapse;

            margin-top: 20px;

            overflow: hidden;

            border-radius: 12px;

        }


        th {

            background: #667eea;

            color: white;

            padding: 17px;

            text-align: left;

            font-size: 15px;

        }


        td {

            padding: 17px;

            border-bottom:
                1px solid #eeeeee;

            color: #444;

        }


        tr:nth-child(even) {

            background:
                #f7f8ff;

        }


        tr:hover {

            background:
                #eef0ff;

            transition: 0.2s;

        }


        .name {

            font-weight: bold;

            color: #667eea;

        }


        .email {

            color: #555;

        }


        .course {

            display: inline-block;

            background: #eeeefe;

            color: #667eea;

            padding: 6px 12px;

            border-radius: 20px;

            font-size: 13px;

            font-weight: bold;

        }


        .back-button {

            display: inline-block;

            margin-top: 30px;

            padding: 13px 22px;

            background: #667eea;

            color: white;

            text-decoration: none;

            border-radius: 8px;

            font-weight: bold;

            transition: 0.2s;

        }


        .back-button:hover {

            background: #5568d9;

            transform:
                translateY(-2px);

        }


        .footer {

            text-align: center;

            margin-top: 30px;

            color: #999;

            font-size: 14px;

        }


        @media (max-width: 600px) {

            body {

                padding: 20px 10px;

            }


            .container {

                padding: 20px;

            }


            .header h1 {

                font-size: 28px;

            }


            th,
            td {

                padding: 12px;

                font-size: 14px;

            }

        }

    </style>

</head>


<body>


    <div class="container">


        <div class="header">

            <h1>
                🎓 Student Records
            </h1>

            <p>
                View all registered student information
            </p>

        </div>


        <div class="table-container">

            <table>

                <thead>

                    <tr>

                        <th>
                            Student Name
                        </th>

                        <th>
                            Roll Number
                        </th>

                        <th>
                            Course
                        </th>

                        <th>
                            Email
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${rows}

                </tbody>

            </table>

        </div>


        <a
            href="/"
            class="back-button"
        >
            ← Back to Form
        </a>


        <div class="footer">

            Student Management System
            © 2026

        </div>


    </div>


</body>

</html>

                `;


                res.writeHead(
                    200,
                    {
                        "Content-Type":
                            "text/html"
                    }
                );


                res.end(html);

            }
        );

        return;
    }


    // ==========================================
    // 404 PAGE
    // ==========================================

    res.writeHead(404, {
        "Content-Type": "text/html"
    });

    res.end(`

        <h1>
            404 - Page Not Found
        </h1>

        <p>
            The page you are looking for
            does not exist.
        </p>

    `);

});


// ==========================================
// START SERVER
// ==========================================

server.listen(
    PORT,
    () => {

        console.log(
            `Server running at http://localhost:${PORT}`
        );

    }
);