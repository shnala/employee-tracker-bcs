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

// The 'start' function will initialize the app by first readying a series of arrays that will be used later during the inquirer prompts.
const start = async () => {
    //Pushes all currently listed employees into employees array.
    db.query('SELECT employee.first_name, employee.last_name, employee.id FROM employee', (err,data) => {
        if(err){
            throw err;
          }
          employees.push(data);
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

// Core loop function.
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
    db.query("SELECT employee.id AS employee_id, CONCAT(employee.first_name, ' ', employee.last_name) AS Employee, role.title AS job_title, role.salary, employee.manager_id, department.name AS department_name FROM employee JOIN role ON employee.role_id = role.department_id JOIN department ON role.department_id = department.id", (err,data) => {
        if(err){
            throw err;
          }
          console.log('\n');
          console.table(data);
    })
    menu();
};

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

const addRole = () => {
    const departmentArr = departments[0].map(function (department) {
        return { name: department.name, value: department.id };
    });

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
            type: 'list',
            message: "Please select the department that this role belongs in.",
            choices: departmentArr,
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
    const rolesArr = roles[0].map(function (role) {
        return { name: role.title, value: role.id };
    });
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
            type: 'list',
            message: "Please select the role for this employee.",
            choices: rolesArr,
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
        db.query("INSERT INTO employee SET ?", newEmployee, (err, data) => {
            if (err) throw err;
            console.log(`${response.first_name} ${response.last_name} has been added as an employee.`)
            menu();
        })
    })
};

//This function will feed an id value into the following function, which will select the appropriate employee so that their role can be updated.
const updateEmployee = () => {
    const employeesArr = employees[0].map(function (employee) {
        return { name: employee.last_name, value: employee.id };
    });

    inquirer
    .prompt([
        {
            type: 'list',
            message: "Please select an employee to update.",
            choices: employeesArr, 
            name: 'choice'
        }
    ]).then((response) => updateInput(response.choice))
};

const updateInput = (id) => {
    const rolesArr = roles[0].map(function (role) {
        return { name: role.title, value: role.id };
    });

    inquirer
    .prompt([
        {
            type: 'list',
            message: "Please select the new role id for this employee.",
            choices: rolesArr,
            name: 'role_id'
        }
    ])
    .then((response) => {
        const sql = `UPDATE employee SET role_id = ? WHERE id = ${id}`;
        db.query(sql, [response.role_id], (err, data) => {
            if (err) {
            throw err;
            } else {      
            console.log('Employee updated. Select "View Employees" to view your changes.');
            }
            menu();
        })
    })
}

//Initialize the app.
start();