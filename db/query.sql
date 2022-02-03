-- This query is for viewing the role table.
-- SELECT role.title, role.id AS role_id, department.name AS department_name, role.salary
-- FROM role JOIN department ON role.department_id = department.id; 

-- This query is for viewing the employee table.
-- SELECT employee.id AS employee_id, CONCAT(employee.first_name, ' ', employee.last_name) AS Employee, role.title AS job_title, role.salary, employee.manager_id, department.name AS department_name 
-- FROM employee JOIN role ON employee.role_id = role.department_id 
-- JOIN department ON role.department_id = department.id;

-- Queries below are for self-joining employee table so that the manager name appears instead of the manager id. Doesn't work
-- SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS Employee, employee.manager_id AS manager_name 
-- FROM employee JOIN manager_id WHERE employee.manager_id = employee.id;

-- SELECT employee.id AS employee_id, employee.first_name, employee.last_name, role.title AS job_title, role.salary, employee.manager_id 
-- FROM employee JOIN department ON employee.role_id = role.department_id;