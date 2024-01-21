_require = function(a){
var b = require(a)
for (var c in b) global[c] = b[c];
}

_require('./Mysql.js')
Mysql({
	host: 'localhost',
	user: 'user_name',
	password: 'user_pass',
	database: 'database_name'
});

var RES = SELECT('table', 'column', {id: 1})
