
/**
 * Module dependencies.
 */

var express = require('express')
  , stylus = require('stylus')
  , routes = require('./routes')
  , passport = require('passport')
  , LocalAuthStrategy = require('passport-local').Strategy
  , Sequelize = require('sequelize')
  , sequelize = null
  , configs = { development: require('./config.development.js'), production: require('./config.production.js') }
  // database objects
  , User

console.log(configs);


var app = module.exports = express.createServer();

// Passport auth
passport.use(new LocalAuthStrategy(
    function(username, password, done) {
        console.log('checking user');
        done(null,{username: username, password:password, id:2343});
        /*
        User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!user.validPassword(password)) { return done(null, false); }
            return done(null, user);
        });
        */
    }
));
passport.serializeUser(function(user, done) {
    console.log('serialize user',user);
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    console.log('deserialize user');
    User.findOne(id, function (err, user) {
        done(err, user);
    });
});

// Configuration
app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'your secret here' }));
    // passport config
    app.use(passport.initialize());
    app.use(passport.session());
    // stylus my baby
    app.use(stylus.middleware({ src: __dirname + '/public' }));
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  console.log('connecting to development db');
  connect_sequelize(configs.development);
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
  console.log('connecting to production db');
  connect_sequelize(configs.production);
});


// Sequelize
function connect_sequelize (config) {
  console.log(config);
  sequelize = new Sequelize(config.mysql_database,config.mysql_user, config.mysql_password,{
    host: config.mysql_host
  });

  User = sequelize.define('User', {
    username: Sequelize.STRING,
    password: Sequelize.STRING
  });

  User.sync().on('success',function(){
    console.log('success creating table User');
  }).on('failure',function(error){
    console.log(error);
    console.log('failure creating table User');
  });;

}


// Routes
app.get('/', routes.index);
app.get('/login', routes.login);
app.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }));

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
