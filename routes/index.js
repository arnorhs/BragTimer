/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Brag Timer' })
};

exports.login = function(req, res){
  res.render('login', { title: 'Login', layout: 'static-layout' })
};
