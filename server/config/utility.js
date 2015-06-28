exports.isLoggedIn = function(req, res) {
  return req.session ? !! req.session.userid : false;
};

exports.checkUser = function(req, res, next) {
  if (!exports.isLoggedIn(req)) {
    res.redirect('#/login');
  } else {
    next();
  }
};

exports.createSession = function(req, res, newUser) {
  return req.session.regenerate(function() {
      req.session.userid = newUser;
      res.redirect('/');
    });
};

