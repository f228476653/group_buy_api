IF (!EXISTS (SELECT * 
                 FROM INFORMATION_SCHEMA.TABLES 
                 WHERE TABLE_SCHEMA = 'public' 
                 AND  TABLE_NAME = 'login'))
BEGIN
    BEGIN TRANSACTION;

create table login
(
	id serial not null,
	user_id int not null,
	login_datetime timestamp not null
);

create unique index login_id_uindex
	on login (id);

alter table login
	add constraint login_pk
		primary key (id);


COMMIT; 
END