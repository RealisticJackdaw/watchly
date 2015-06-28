# Watchly

> Social Virtual Town Watch

## Team

  - __Product Owner__: Zachary Lester
  - __Scrum Master__: Brian Loughnane
  - __Development Team Members__: John Mai, Zachary Lester, Brian Loughnane

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Setting up the database environemnt](#setting-up-the-database-environment)
    1. [Emulating in the browser](#emulating-in-the-brower)
    1. [Emulating for iOS](#emulating-for-ios)
    1. [Emulating for Android](#emulating-for-android)
1. [Contributing](#contributing)
1. [API Documentation](#api-documentation)

## Usage
Use watchly to protect yourself from dangers in your vicinity.  Watchly maps user-sourced
crime, hazard, and danger reports, providing vital safety information.  Each submitted report
provides a message thread where other watchly members can respond with helpful information
and engage in fruitful discussions.

## Requirements

- Node 0.12.x
- Express 4.x
- MySQL 5.6.x
- Ionic 1.0.x
- Angular 1.4.x

## Development

### Installing Dependencies

From within the root directory:
```sh
* npm install
* bower install
* gulp
```

### Setting up the database environment
1. In server/db/knex-config.js, set your mysql username and password in the configuration object
1. Start mysql and sign in from root directory:
```sh
mysql.server start
mysql -u [your username] -p
Enter Password:  [your password]
```
1. Create and use database "watchly"
```sh
create database watchly;
use watchly;
```

### Emulating in the browser
1. Start server
From root directory:
```sh
node index.js
```
1. Open browser and navigate to http://localhost:3000

### Emulating for iOS:
```sh
* npm install -g cordova ionic ios-sim
* ionic platform add ios
* ionic build ios
* ionic emulate ios
```

### Emulating for Android:
```sh
* download the android sdk from google
* install the android sdk
* download jre from oracle
* install jre
* add into your .bash_profile ANDROID_HOME and JAVA_HOME
* rerun your .bash_profile
* npm install -g cordova ionic
* ionic platform add android
* ionic build android
* ionic emulate android
```

### Roadmap

View the project roadmap [here](https://github.com/RealisticJackdaw/watchly/issues)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.


## API Documentation

### Incidents

* Get all incidents
```
$http.get('api/incidents/');
```

* Post a new incident by passing an incident object in your request:
```
var data = { 
   description: description,
   latitude: latitude, 
   longitude: longitude,
   address: address,
   fuzzyAddress: fuzzyAddress,
   occurred_at: occurred_at
 }

$http.post('api/incidents/', data);
```

* Post the top and bottom of a map as min and max latitudes(x) and longitudes(y) to get incidents within map
```
var data = {xMin: 0, xMax: 100, yMin: -200, yMax: 100} 
$http.post('api/incidents/nearby', data);
```
* get all incident types
```
$http.get('api/incidents/incidentType');
```
### Messages

* Post a new message by passing an incidentId and a description
```
var data = { incidentsId: 1, description: 'There are lots of bikes stolen in that area, be careful' };
$http.post('api/messages/', data);
```

* Get thread of messages about an incident by posting an incidentId to thread endpoint
```
var data = { incidentsId: 1 };
$http.post('api/messages/thread', data);
```
   






