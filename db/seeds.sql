INSERT INTO department (name)
VALUES ('Sales'),('Engineering'),('Recreation'),('Executive');

INSERT INTO role (title, salary,department_id)
VALUES ('Sales Guy',60000,1),
('Software Engineer',100000,2),
('Servant',5000,3),
('Head Honcho', 1000000,4),
('Intern', 50000,2);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUES ('Shawn', 'Analla', 1, 4),
('Gucci', 'Senpai', 1, 1),
('Bill', 'Gates', 1, 2),
('Everyone', 'Else', 1, 3);