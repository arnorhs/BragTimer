
var mysql = require('mysql');
var client = mysql.createClient({
    user: 'root',
    password: 'skinka'
});

exports.db = {

    getUserById: function (id) {
        console.log('client: ',client);
    }

};
