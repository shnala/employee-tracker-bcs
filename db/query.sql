-- SELECT role.title, role.id AS role_id, department.name AS department_name, role.salary
-- FROM role JOIN department ON role.department_id = department.id; 


-- WHEN I choose to view all roles
-- THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role (SORTA DONE)

-- THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to (SORTA DONE)
-- Old
SELECT employee.id AS employee_id, employee.first_name, employee.last_name, role.title AS job_title, role.salary, employee.manager_id, department.name AS department_name
FROM employee JOIN role ON employee.role_id = role.department_id 
JOIN department ON role.department_id = department.id;

-- Test
SELECT employee.id AS employee_id, employee.first_name, employee.last_name, role.title AS job_title, role.salary, employee.manager_id, department.name AS department_name 
FROM employee JOIN role ON employee.role_id = role.department_id 
JOIN department ON role.department_id = department.id;

SELECT employee.first_name, employee.last_name, employee.manager_id AS manager_name FROM employee JOIN employee ON employee.manager_id = employee.id;

-- SELECT employee.id AS employee_id, employee.first_name, employee.last_name, role.title AS job_title, role.salary, employee.manager_id 
-- FROM employee JOIN department ON employee.role_id = role.department_id;