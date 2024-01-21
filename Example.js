_require = function(a){
var b = require(a)
for (var c in b) global[c] = b[c];
}
_require('./Helper.js');
_require('./Template.js');

var template = new Template( { filename:"sample.tmpl" } );

template.AddParam("title", "PHP Templates made easy");
template.AddParam("body", "Hello world!");

console.log(template.EchoOutput());
