CREATE DATABASE IF NOT EXISTS watchly;

USE watchly;

CREATE TABLE IF NOT EXISTS users (
  id int(11) NOT NULL AUTO_INCREMENT,
  firstName varchar(30),
  lastName varchar(30),
  username varchar(40) UNIQUE,
  email varchar(40) UNIQUE,
  phone bigint(11),
  salt varchar(20),
  password varchar(100),
  createdTime datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)

) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS incidentTypes (
  id int(11) NOT NULL AUTO_INCREMENT,
  type varchar(20) UNIQUE NOT NULL,
  iconFilename varchar(50),
  PRIMARY KEY (id)
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS incidents (
  id int(11) NOT NULL AUTO_INCREMENT,
  userId int(11),
  incidentTypeId int(11),
  description varchar(255),
  latitude float(10,6) NOT NULL,
  longitude float(10,6) NOT NULL,
  -- latitude decimal(9,8) NOT NULL,
  -- longitude decimal(9,8) NOT NULL,
  address varchar(100),
  fuzzyAddress varchar(100),
  occurredTime datetime NOT NULL,
  submittedTime datetime DEFAULT CURRENT_TIMESTAMP,
  modificationTime datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY fk_uid(userId) REFERENCES users(id),
  FOREIGN KEY fk_itid(incidentTypeId) REFERENCES incidentTypes(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS messages (
  id int(11) NOT NULL AUTO_INCREMENT,
  description varchar(255),
  userId int(11) ,
  incidentsId int(11),
  submittedTime datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY fk_uid(userId) REFERENCES users(id),
  FOREIGN KEY fk_iid(incidentsId) REFERENCES incidents(id)
) ENGINE=InnoDB;

-- ALTER TABLE incidents add messagesId int(11);
-- ALTER TABLE incidents add FOREIGN KEY fk_mid(messagesId) REFERENCES messages(id);


-- Set incident type data
INSERT INTO incidentTypes (type, iconFilename) 
  VALUES ('Vandalism', 'vandalism.png');
INSERT INTO incidentTypes (type, iconFilename) 
  VALUES ('Theft', 'theft.png');
INSERT INTO incidentTypes (type, iconFilename) 
  VALUES ('Fight', 'fight.png');
INSERT INTO incidentTypes (type, iconFilename) 
  VALUES ('Drug Use', 'drug_use.png');
INSERT INTO incidentTypes (type, iconFilename) 
  VALUES ('Pedestrian Hazard', 'ped_hazard.png');
INSERT INTO incidentTypes (type, iconFilename) 
  VALUES ('Break In', 'break_in.png');
INSERT INTO incidentTypes (type, iconFilename) 
  VALUES ('Aggressive Person', 'aggro_per.png');
INSERT INTO incidentTypes (type, iconFilename) 
  VALUES ('Mugging', 'mugging.png');
INSERT INTO incidentTypes (type, iconFilename) 
  VALUES ('Gun Use', 'gunshot.png');
INSERT INTO incidentTypes (type, iconFilename) 
  VALUES ('Other Danger', 'other.png');

-- 
-- Sample Data Below
-- 

-- Sample Data: users
INSERT INTO users (firstName, lastName, username, email, phone, salt, password) 
  VALUES ('brian', 'loughnane', 'mrmusic', 'block@gmail.com', 2029348209, '23kjl4', '9q283475070');
INSERT INTO users (firstName, lastName, username, email, phone, salt, password) 
  VALUES ('john', 'mai', 'jmai00', 'jman5@gmail.com', 2359526209, '244jl4', '9q2834asf0ddd');
INSERT INTO users (firstName, lastName, username, email, phone, salt, password) 
  VALUES ('zach', 'lester', 'zlust', 'zalibi@gmail.com', 8763098945, 'sdfs35', 'sft344asfasafdd');

-- Sample Data: incidents:
INSERT INTO incidents (userId, incidentTypeId, description, latitude, longitude, address, fuzzyAddress, occurredTime) 
  VALUES (1, 2, 'I saw someone steal a bike on the corner.  It was a tall young man wearing an orange tshirt', 37.792806, -122.396941, '227 Market St. San Francisco', '200 Block of Market St', '2015-06-26 15:09:00');
INSERT INTO incidents (userId, incidentTypeId, description, latitude, longitude, address, fuzzyAddress, occurredTime) 
  VALUES (3, 9, 'I heard some gunshots', 37.792432, -122.397477, '302 Market St. San Francisco', '300 Block of Market St', '2015-06-26 15:15:00');
INSERT INTO incidents (userId, incidentTypeId, description, latitude, longitude, address, fuzzyAddress, occurredTime) 
  VALUES (2, 6, 'I heard a scream and a smashing sound', 37.791417, -122.398347, '411 Market St. San Francisco', '400 Block of Market St', '2015-06-26 15:27:00');

-- -- Sample Data: messages
INSERT INTO messages (description, userId, incidentsId) 
  VALUES ('Hey I think I know that guy...he hangs out at taco bell', 1, 1);
INSERT INTO messages (description, userId, incidentsId) 
  VALUES ('RUNNN!!!!', 3, 2);
INSERT INTO messages (description, userId, incidentsId) 
  VALUES ('Yes, those sounds come from that area regularly', 2, 3);
