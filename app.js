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
            // case 'Add a Department':
            //     addDepartment();
            //     break;
            // case 'Add a Role':
            //     addRole();
            //     break;
            // case 'Add an Employee':
            //     addEmployee();
            //     break;
            // case 'Update an Employee Role':
            //     updateEmployee();
            //     break;
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

start();