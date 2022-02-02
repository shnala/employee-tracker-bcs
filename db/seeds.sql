INSERT INTO department (name)
VALUES ('Sales'),('Engineering');

INSERT INTO role (title, salary,department_id)
VALUES ('Sales Guy',60000,1),('Software Engineer',100000,2);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUES ('Shawn', 'Analla', 500, 2),
('Gucci', 'Senpai', 501, 1);