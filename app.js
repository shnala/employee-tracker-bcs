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
            message: "Welcome to Employee Tracker! You may generate a neatly organized table of all your employees using this app. To begin, please select one of the options below.",
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
                console.log('ok');
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

const viewRoles = () => {
    db.query("SELECT * FROM role", (err,data) => {
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
    db.query("SELECT * FROM employee", (err,data) => {
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