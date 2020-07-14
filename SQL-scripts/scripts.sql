--create schema astrology;
set schema 'astrology';
drop table Roles cascade;
drop table ReimbursementStatus cascade;
drop table ReimbursementTypes cascade;
drop table Reimbursements cascade;
drop table Users cascade;

create table Roles (
	role_id serial primary key,
	roles text not null unique
);

create table Users (
	user_id serial primary key,
	username text not null unique,
	"password" text not null,
	first_name text not null,
	last_name text not null,
	email text not null,
	roles int references roles (role_id)
);

create table ReimbursementStatus (
	statusId serial primary key,
	status text not null unique
);

create table ReimbursementTypes (
	type_id serial primary key,
	"type" text not null unique
);

create table Reimbursements(
	reimbursement_id serial primary key,
	author int references users (user_id) not null,
	amount numeric(10, 2) not null,
	--needs to be date
	date_submitted date not null,
	date_resolved date,
	description text not null,
	resolver int references users (user_id),
	status int references ReimbursementStatus (statusId) not null,
	"type" int references ReimbursementTypes (type_id)
);

--populate tables
insert into Roles (role_id, role)
values (1, 'Admin');
insert into Roles (role_id, role)
values (2, 'Financial Manager');
insert into Roles (role_id, role)
values (3, 'User');

insert into Users (user_id, username, password, email, role, first_name, last_name) 
values(1, 'dpeterson', 'password', 'dpeterson@fluffers.com', 1, 'David', 'Peterson');
insert into Users (user_id, username, password, email, role, first_name, last_name) 
values(2, 'lchoi', 'password', 'lchoi@fluffers.com', 2, 'Lenny', 'Choi');
insert into Users (user_id, username, password, email, role, first_name, last_name) 
values(3, 'okay', 'password', 'okay@fluffers.com', 3, 'Orion', 'Kay');

insert into ReimbursementStatus (statusId, status)
values(0, 'pending');
insert into ReimbursementStatus (statusId, status)
values(1, 'approved');
insert into ReimbursementStatus (statusId, status)
values(2, 'denied');

insert into ReimbursementTypes (type_id,type)
values (1, 'construction');
insert into ReimbursementTypes (type_id,type)
values (2, 'payroll');
insert into ReimbursementTypes (type_id,type)
values (3, 'food');
insert into ReimbursementTypes (type_id,type)
values (4, 'inventory');

insert into Reimbursements (reimbursement_id, author, amount, date_submitted, date_resolved, description, resolver, status, type)
values (1, 1, 4126.59, '2020-1-1', '2020-1-2', 'Front gate installation', 1, 1, 1);
insert into Reimbursements (reimbursement_id, author, amount, date_submitted, date_resolved, description, resolver, status, type)
values (2, 1, 754.58, '2020-2-21', '2020-2-22', 'Acquired puppies', 1, 1, 4);
insert into Reimbursements (reimbursement_id, author, amount, date_submitted, date_resolved, description, resolver, status, type)
values (3, 1, 17826.98, '2020-4-12', '2020-4-13', 'Acquired ponies', 1, 1, 4);
insert into Reimbursements (reimbursement_id, author, amount, date_submitted, date_resolved, description, resolver, status, type)
values (4, 1, 64500.59, '2020-5-1', '2020-5-2', 'Hired caretaker for animals', 1, 1, 2);
insert into Reimbursements (reimbursement_id, author, amount, date_submitted, date_resolved, description, resolver, status, type)
values (5, 1, 4586.59, '2020-5-14', '2020-5-15', 'Completed indoor petting zoo', 1, 1, 1);
insert into Reimbursements (reimbursement_id, author, amount, date_submitted, date_resolved, description, resolver, status, type)
values (6, 1, 159.99, '2020-5-20', '2020-5-21', 'Acquired bunnies for indoor petting zoo', 1, 1, 4);
insert into Reimbursements (reimbursement_id, author, amount, date_submitted, date_resolved, description, resolver, status, type)
values (7, 1, 45126.59, '2020-6-1', '2020-6-2', 'Hired Financial Manager', 1, 1, 2);
insert into Reimbursements (reimbursement_id, author, amount, date_submitted, date_resolved, description, resolver, status, type)
values (8, 2, 14986.99, '2020-6-19', '2020-6-20', 'Bought cheap van for mobile petting zoo', 1, 1, 4);
insert into Reimbursements (reimbursement_id, author, amount, date_submitted, date_resolved, description, resolver, status, type)
values (9, 2, 3684.65, '2020-6-21', null, 'Food order for animals', null, 1, 3);
insert into Reimbursements (reimbursement_id, author, amount, date_submitted, date_resolved, description, resolver, status, type)
values (10, 2, 50000.69, '2020-6-24', '2020-6-25', 'Hired caretaker for ponies', 1, 2, 2);


select * from Users;
select * from Roles;
select * from Reimbursements;
select * from ReimbursementStatus;
select * from ReimbursementTypes;
