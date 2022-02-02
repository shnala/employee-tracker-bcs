const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: '1234',
    database: 'employees_db'
  })

const employees = [];
const roles = [];
const departments = [];

const start = () => {  
    inquirer
    .prompt([
        {
            type: 'list',
            message: "Welcome to Employee Tracker! Use the arrow keys to select one of the options below and then hit 'enter.'",
            choices: ["View All Departments", "View All Roles", "View All Employees", "Add a Department", "Add a Role", "Add an Employee", "Update an Employee Role", "Finish"],
            name: 'choice'
        }
    ])
    .then((response)=> {
        switch (response.choice) {
            case 'View All Departments':
                viewDepartments();
                break;
            case 'View All Roles':
                viewRoles();
                break;
            case 'View All Employees':
                viewEmployees();
                break;
            case 'Add a Department':
                addDepartment();
                break;
            case 'Add a Role':
                addRole();
                break;
            case 'Add an Employee':
                addEmployee();
                break;
            case 'Update an Employee Role':
                updateEmployee();
                break;
            default:
                // generate(employees);
                return;
        }
    })
};

const viewDepartments = () => {
    db.query("SELECT * FROM department", (err,data) => {
        if(err){
            throw err;
          }
          console.log('\n');
          console.table(data);
    })
    // db.end();
    start();
};

// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role (SORTA DONE)

const viewRoles = () => {
    db.query('SELECT role.title, role.id AS role_id, department.name AS department_name, role.salary FROM role JOIN department ON role.department_id = department.id', (err,data) => {
        if(err){
            throw err;
          }
          console.log('\n');
          console.table(data);
    })
    // db.end();
    start();
};

const viewEmployees = () => {
    db.query("SELECT employee.id AS employee_id, employee.first_name, employee.last_name, role.title AS job_title, role.salary, employee.manager_id, department.name AS department_name FROM employee JOIN role ON employee.role_id = role.department_id JOIN department ON role.department_id = department.id", (err,data) => {
        if(err){
            throw err;
          }
          console.log('\n');
          console.table(data);
    })
    // db.end();
    start();
};


//Must use SET for db.query for some reason, (names) VALUES doesn't work.
const addDepartment = () => {
    inquirer
    .prompt([
        {
            type: 'input',
            message: "Please enter the name of the department.",
            name: 'name'
        }
    ]).then((response) => {
        db.query("INSERT INTO department SET ?", {name: response.name}, (err, data) => {
            if (err) throw err;
            console.log(`Department ${response.name} has been added.`)
            start();
        })

    })

};

//TODO: On the third input, make a list of departments for the user to select from, and then use the corresponding integer id in the db.query.
const addRole = () => {
    inquirer
    .prompt([
        {
            type: 'input',
            message: "Please enter the name of the role.",
            name: 'title'
        },
        {
            type: 'input',
            message: "Please enter the salary for the role (integer, no commas, can contain decimal values).",
            name: 'salary'
        },
        {
            type: 'input',
            message: "Please enter the department id for this role (1: Sales, 2: Engineering)",
            name: 'department_id'
        }
    ]).then((response) => {
        db.query("INSERT INTO role SET ?", 
        {
            title: response.title,
            salary: response.salary,
            department_id: response.department_id
        }, (err, data) => {
            if (err) throw err;
            console.log(`A role for ${response.title} has been added.`)
            start();
        })
    })
};

const addEmployee = () => {
    inquirer
    .prompt([
        {
            type: 'input',
            message: "Please enter the first name of the employee.",
            name: 'first_name'
        },
        {
            type: 'input',
            message: "Please enter the last name of the employee.",
            name: 'last_name'
        },
        {
            type: 'input',
            message: "Please enter this employee's manager id (integer).",
            name: 'manager_id'
        },
        {
            type: 'input',
            message: "Please enter the role id for this employee (1: Sales Guy, 2: Software Engineer)",
            name: 'role_id'
        }
    ]).then((response) => {
        const newEmployee = {
            first_name: response.first_name,
            last_name: response.last_name,
            manager_id: response.manager_id,
            role_id: response.role_id
        };
        employees.push(newEmployee);
        console.log(employees);
        db.query("INSERT INTO employee SET ?", newEmployee, (err, data) => {
            if (err) throw err;
            console.log(`${response.first_name} ${response.last_name} has been added as an employee.`)
            start();
        })
    })
};

const updateEmployee = () => {
    inquirer
    .prompt([
        {
            type: 'list',
            message: "Please select an employee to update.",
            choices: employees, 
            name: 'choice'
        }
    ]).then((response) => {
        console.log(response);
    })
};

start();