angular.module('watchly.services',[])
.factory('Auth', function ($http, $location) {
  var authenticatedUser;
  var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signin',
      data: user
    })
    .then(function (res) {
      if (res.status === 200) {
        authenticatedUser = res.data;
      }
      else {
        console.log(res.data.error);
      }
      return authenticatedUser;
    });
  };

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signup',
      data: user
    })
    .then(function (res) {
      if (res.status === 200) {
        authenticatedUser = res.data;
      }
      else {
        console.log(res.data.error);
      }
      return authenticatedUser;
    });
  };

  var signout = function () {
    return $http({
      method: 'GET',
      url: '/api/users/signout',
    })
    .then(function (res) {
      authenticatedUser = undefined;
      $location.path('#/');
    });
  };

  var isAuthenticated = function() {
    return authenticatedUser ? true : false;
  };

  var getUser = function() {
    return authenticatedUser;
  };

  var forgotpassword = function(email) {
    return $http({
      method: 'POST',
      url: '/api/users/forgotpassword',
      data: {email: email}
    })
    .then(function (res) {
      if (res.status === 200) {
      }
      else {
        console.log(res.data.error);
      }
      return res.data;
    });
  };

  return {
    signin: signin,
    signup: signup,
    signout: signout,
    isAuthenticated: isAuthenticated,
    getUser: getUser,
    forgotpassword: forgotpassword
  };
})
.factory('Incidents', function($http){
  var getIncidentById = function (incidentId) {
    return $http({
      method: 'GET',
      url: '/api/incidents/' + incidentId,
    })
    .then(function (res) {
      if (res.status === 200) {
      }
      else {
        console.log(res.data.error);
      }
      return res.data;
    });
  };

  var getIncidentsByLocation = function (location) {
    return $http({
      method: 'GET',
      url: '/api/incidents',
      data: location
    })
    .then(function (res) {
      if (res.status === 200) {
      }
      else {
        console.log(res.data.error);
      }
      return res.data;
    });
  };

  var getAllIncidents = function () {
    return $http({
      method: 'GET',
      url: '/api/incidents',
    })
    .then(function (res) {
      if (res.status === 200) {
      }
      else {
        console.log(res.data.error);
      }
      return res.data;
    });
  };

  var getIncidentTypes  = function (location) {
    return $http({
      method: 'GET',
      url: '/api/incidents/incidentType',
    })
    .then(function (res) {
      if (res.status === 200) {
      }
      else {
        console.log(res.data.error);
      }
      return res.data;
    });
  };

  var createNewIncident  = function (incident) {
    return $http({
      method: 'POST',
      url: '/api/incidents',
      data: incident
    })
    .then(function (res) {
      if (res.status === 200) {
      }
      else {
        console.log(res.data.error);
      }
      return res.data;
    });
  };

  return {
    getIncidentById: getIncidentById,
    getIncidentsByLocation: getIncidentsByLocation,
    getAllIncidents: getAllIncidents,
    getIncidentTypes: getIncidentTypes,
    createNewIncident: createNewIncident 
  };
})
.factory('Messages', function($http){
  var getMessageByIncident  = function (incident) {
    console.log(incident)
    return $http({
      method: 'GET',
      url: '/api/messages',
      data: incident
    })
    .then(function (res) {
      if (res.status === 200) {
        console.log('got messages: ', res.data)
      }
      else {
        console.log(res.data.error);
      }
      return res.data;
    });
  };

  var createNewMessage  = function (message) {
    console.log('in services, uploading message: ', message)
    return $http({
      method: 'POST',
      url: '/api/messages',
      data: message
    })
    .then(function (res) {
      if (res.status === 200) {
        console.log('message saved')
      }
      else {
        console.log(res.data.error);
      }
      return res.data;
    });
  };

  return {
    getMessageByIncident: getMessageByIncident,
    createNewMessage: createNewMessage
  };
});
