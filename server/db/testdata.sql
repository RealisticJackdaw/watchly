use ebdb;

INSERT INTO incidentTypes (type, iconFilename) 
  VALUES ('Fire', 'road_hazard.png');

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
INSERT INTO incidents (userId, incidentTypeId, description, latitude, longitude, address, fuzzyAddress, occurred_at) 
  VALUES (1, 2, 'I saw someone steal a bike on the corner.  It was a tall young man wearing an orange tshirt', 37.792806, -122.396941, '227 Market St. San Francisco', '200 Block of Market St', '2015-06-26 15:09:00');
INSERT INTO incidents (userId, incidentTypeId, description, latitude, longitude, address, fuzzyAddress, occurred_at) 
  VALUES (3, 9, 'I heard some gunshots', 37.792432, -122.397477, '302 Market St. San Francisco', '300 Block of Market St', '2015-06-26 15:15:00');
INSERT INTO incidents (userId, incidentTypeId, description, latitude, longitude, address, fuzzyAddress, occurred_at) 
  VALUES (2, 6, 'I heard a scream and a smashing sound', 37.791417, -122.398347, '411 Market St. San Francisco', '400 Block of Market St', '2015-06-26 15:27:00');
INSERT INTO incidents (userId, incidentTypeId, description, latitude, longitude, address, fuzzyAddress, occurred_at) 
  VALUES (2, 3, 'Two Hack Reactor students violently debating vim and sublime text', 37.783624, -122.408999, '944 Market St. San Francisco', '900 Block of Market St', '2015-06-26 15:27:00');
INSERT INTO incidents (userId, incidentTypeId, description, latitude, longitude, address, fuzzyAddress, occurred_at) 
  VALUES (2, 11, 'One Hack Reactor student set another student\'s car on fire', 37.782733, -122.410306, '988 Market St. San Francisco', '900 Block of Market St', '2015-06-26 15:27:00');
     
-- -- Sample Data: messages
INSERT INTO messages (description, userId, incidentsId) 
  VALUES ('Hey I think I know that guy...he hangs out at taco bell', 1, 1);
INSERT INTO messages (description, userId, incidentsId) 
  VALUES ('RUNNN!!!!', 3, 2);
INSERT INTO messages (description, userId, incidentsId) 
  VALUES ('Yes, those sounds come from that area regularly', 2, 3);
