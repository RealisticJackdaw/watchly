drop database watchly;

create database watchly;

use watchly;

create table users (
  id int(11) not null auto_increment primary key,
  firstName varchar(15),
  lastName varchar(20),
  username varchar(20),
  email varchar(40),
  phone int(11),
  salt varchar(20),
  hashedPassword varchar(100)

) ENGINE=InnoDB;

create table messages (
  id int(11) not null auto_increment primary key,
  description varchar(255),
  userId int(11),
  incidentTypeId int(11)

  -- -- -- foreign key
  -- FOREIGN KEY userId (userId)
  -- REFERENCES users(id)
  
  -- -- foreign key
  -- FOREIGN KEY incidentTypeId (incidentTypeId)
  -- REFERENCES incidents(id)

) ENGINE=InnoDB;

create table incidents (
  id int(11) not null auto_increment primary key,
  userId int(11),
  incidentTypeId int(11),
  descriptionId int(11),

  latitude decimal(9,7),
  longitude decimal(9,7),
  address varchar(100),
  fuzziedAddress varchar(100),
  iconSrc varchar(50),
  submittedAt getdate(),
  occurredAt datetime null

  -- foreign key -- formerly called "sumbittedBy"
  -- FOREIGN KEY userId (userId)
  -- REFERENCES users(id)
  
  -- foreign key
  -- FOREIGN KEY incidentTypeId (incidentTypeId)
  -- REFERENCES incidentTypes(id),
  
  --foreign key
  -- FOREIGN KEY descriptionId (descriptionId)
  -- REFERENCES messages(id)

) ENGINE=InnoDB;


create table incidentTypes (
  id int(11) not null auto_increment primary key,
  type varchar(20)

) ENGINE=InnoDB;



-- Foreign key syntax --

-- CONSTRAINT constraint_name
-- FOREIGN KEY foreign_key_name (columns)
-- REFERENCES parent_table(columns)
-- ON DELETE action
-- ON UPDATE action

-- FOREIGN KEY userId (userId)
-- REFERENCES users(id)
