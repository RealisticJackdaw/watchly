angular.module('watchly.services',[])
.factory('Auth', function ($http, $location) {
  var authenticatedUser;

  var loggedIn = function() {
    $http.post('/api/users/loggedIn', {message: 'hi'}).success(function(res) {
      console.log('success?');
      authenticatedUser = res;
      console.log(authenticatedUser);
      return res.status;
    });
  };

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

  var resetUserDB = function (callback) {
    return $http({
      method: 'DELETE',
      url: '/api/users'
    })
    .then(function (res) {
      if (res.status === 200) {
        console.log(res.data);
        if (callback) {callback();}
      }
      else {
        console.log(res.data.error);
      }
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

  //pass in new values
  var updateUserProfile = function(data, cb) {

    return $http({
      method: 'POST',
      url: '/api/users/update',
      data: data
    }).then(function(res) {
      if (res.status === 200) {
        cb();
      } else {
        console.log(res.data.error);
      }
    });

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

  var getUsernameFromId = function(userId){
    var userUrl = '/api/users/' + userId;
    return $http({
      method: 'GET',
      url: userUrl,
      data: {userId: userId}
    })
    .then(function(res){
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
    forgotpassword: forgotpassword,
    updateUserProfile: updateUserProfile,
    getUsernameFromId: getUsernameFromId,
    loggedIn: loggedIn,
    resetUserDB: resetUserDB
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

  var shareOnFacebook = function() {
    FB.ui({
      method: 'share',
      href: 'http://watchlier.elasticbeanstalk.com/',
    },
    function(response) {
      if (response && !response.error_code) {
        console.log('Posting completed.');
      } else {
        console.log('Error while posting.');
      }
    });
  };

  var upvote = function(currentIncident) {
    var incidentId = {id: currentIncident.id}
    return $http({
      method: 'POST',
      url: '/api/incidents/upvote',
      data: JSON.stringify(incidentId)
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

  var downvote = function(currentIncident) {
    var incidentId = {id: currentIncident.id}
    return $http({
      method: 'POST',
      url: '/api/incidents/downvote',
      data: JSON.stringify(incidentId)
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

  var resetIncidentDB = function (callback) {
    return $http({
      method: 'DELETE',
      url: '/api/incidents'
    })
    .then(function (res) {
      if (res.status === 200) {
        console.log(res.data);
        if (callback) {callback();}
      }
      else {
        console.log(res.data.error);
      }
    });
  };

  return {
    getIncidentById: getIncidentById,
    getIncidentsByLocation: getIncidentsByLocation,
    getAllIncidents: getAllIncidents,
    getIncidentTypes: getIncidentTypes,
    createNewIncident: createNewIncident,
    shareOnFacebook: shareOnFacebook, 
    upvote: upvote,
    downvote: downvote,
    resetIncidentDB:resetIncidentDB
  };
})
.factory('Messages', function($http){
  var getMessageByIncident  = function (incident) {
    var eventUrl = '/api/messages/' + incident;
    return $http({
      method: 'GET',
      url: eventUrl,
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

  var resetMessageDB = function (callback) {
    return $http({
      method: 'DELETE',
      url: '/api/messages'
    })
    .then(function (res) {
      if (res.status === 200) {
        console.log(res.data);
        if (callback) {callback();}
      }
      else {
        console.log(res.data.error);
      }
    });
  };

  return {
    getMessageByIncident: getMessageByIncident,
    createNewMessage: createNewMessage,
    resetMessageDB: resetMessageDB
  };
});
