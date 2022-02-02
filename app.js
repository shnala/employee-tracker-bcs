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

const start = async () => {
    //Pushes all currently listed employees into employees array.
    db.query('SELECT employee.first_name, employee.last_name, employee.id FROM employee', (err,data) => {
        if(err){
            throw err;
          }
          employees.push(data);
        //   The console.log below will grab the second employee out of the employees array. For some reason, the array is nested inside of another array. Maybe do a map method so that this doesn't occur?
        // Use this information to add create functionality for the 'update employee' option.
          console.log(employees[0][1]);
    });

    //Pushes all currently listed roles into roles array.
    db.query('SELECT role.title, role.salary, role.id FROM role', (err,data) => {
        if(err){
            throw err;
          }
          roles.push(data);
    });

    //Pushes all currently listed departments into departments array.
    db.query('SELECT department.name, department.id FROM department', (err,data) => {
        if(err){
            throw err;
          }
          departments.push(data);
    });

    const response = await inquirer
    .prompt([
        {
            type: 'list',
            message: "Welcome to Employee Tracker! You can create and manage dataset tables for all of your employees' information using this app. To begin, press 'Enter.'",
            choices: ["Enter"],
            name: 'choice'
        }
    ])
    await menu(response);
}

const menu = () => {
    inquirer
    .prompt([
        {
            type: 'list',
            message: "Use the arrow keys to select an option below and then hit 'enter.' When you are finished viewing a table, pressing the arrow keys will re-open this menu. When you are finished using the app, select 'Finish.'",
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
                db.end();
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
    menu();
};


const viewRoles = () => {
    db.query('SELECT role.title, role.id AS role_id, department.name AS department_name, role.salary FROM role JOIN department ON role.department_id = department.id', (err,data) => {
        if(err){
            throw err;
          }
          console.log('\n');
          console.table(data);
    })
    menu();
};

const viewEmployees = () => {
    db.query("SELECT employee.id AS employee_id, employee.first_name, employee.last_name, role.title AS job_title, role.salary, employee.manager_id, department.name AS department_name FROM employee JOIN role ON employee.role_id = role.department_id JOIN department ON role.department_id = department.id", (err,data) => {
        if(err){
            throw err;
          }
          console.log('\n');
          console.table(data);
    })
    menu();
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
            menu();
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
            menu();
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
            menu();
        })
    })
};

//TODO: This function is incomplete. The choices for the prompt come back as 'undefined'
const updateEmployee = () => {
    inquirer
    .prompt([
        {
            type: 'list',
            message: "Please select an employee to update.",
            choices: employees[0], 
            name: 'choice'
        }
    ]).then((response) => {
        console.log(response);
        console.log(`Updating ${response}`);
        updateInput(response);
    })
};

//TODO: this function is incomplete. First figure out the employees array so that an employee can be selected.
const updateInput = (id) => {
    console.log(id);
    inquirer
    .prompt([
        {
            type: 'input',
            message: "Please enter the new role id for this employee.",
            name: 'role_id'
        }
    ]).then((response) => {
        console.log(`Updating ${response}`);
        updateInput();
    })

}

//Initialize the app.
start();