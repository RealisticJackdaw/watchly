CREATE DATABASE IF NOT EXISTS watchly;

USE watchly;

CREATE TABLE IF NOT EXISTS users (
  id int(11) NOT NULL AUTO_INCREMENT,
  firstName varchar(30),
  lastName varchar(30),
  username varchar(20) UNIQUE,
  email varchar(40) UNIQUE,
  phone int(11),
  salt varchar(20),
  password varchar(100),
  PRIMARY KEY (id)

) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS messages (
  id int(11) NOT NULL AUTO_INCREMENT,
  description varchar(255),
  userId int(11) ,
  incidentTypeId int(11),
  PRIMARY KEY (id),
  FOREIGN KEY userId REFERENCES users(id),
  FOREIGN KEY incidentTypeId REFERENCES incidents(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS incidents (
  id int(11) NOT NULL AUTO_INCREMENT,
  userId int(11),
  incidentTypeId int(11),
  description varchar(255),
  latitude decimal(9,7) NOT NULL,
  longitude decimal(9,7) NOT NULL,
  address varchar(100),
  fuzzyAddress varchar(100),
  occurredTime DATETIME NOT NULL,
  submittedTime DATETIME DEFAULT CURRENT_TIMESTAMP,
  modificationTime DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY userId REFERENCES users(id),
  FOREIGN KEY incidentTypeId REFERENCES incidents(id)
) ENGINE=InnoDB;

-- Foreign key syntax --

-- ON DELETE action
-- ON UPDATE action

CREATE TABLE IF NOT EXISTS incidentTypes (
  id int(11) NOT NULL AUTO_INCREMENT,
  type varchar(20) UNIQUE NOT NULL,
  iconSrc varchar(50),
  PRIMARY KEY (id)
) ENGINE=InnoDB;
