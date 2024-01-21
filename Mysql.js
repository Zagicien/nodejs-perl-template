
var a = './Helper.js';
var b = require(a);
for (var c in b) global[c] = b[c];
b = null;

var con = null;
exports.Mysql = function(a) {
	if (con) con.end();
	con = require('mysql').createConnection(a);
	con.connect();
}

exports.SELECT = function(a, b, c = [], d = "", e = 0, f = "") {
    a = {a: "SELECT " + b + " FROM " + a + (count(c) ? " WHERE " : "")}
    var g = condition(a, c);
    try {
        return con.query(a.a + (d ? " ORDER BY " + d + (e ? " DESC" : "") : "") + (f ? " LIMIT " + f : ""), g);
    } catch (C) {
    }
};

exports.UPDATE = function(a, b, c) {
    a = "UPDATE " + a + " SET ";
    var S, d = [];
    foreach(b, function(b, e) {
        S = b.split(' ');
        a += (d ? ', ' : '') + (1 in S && in_array(S[1], ["+", "-"]) ? S[0] + " = " + S[0] + " " + S[1] + " ?" : b + " = ?");
        d.push(e)
    });
    if (count(c)) {
        a = {a: a + " WHERE "};
        d = array_merge(d, condition(a, c));
        a = a.a;
    }
    try {
        return con.query(a, d);
    } catch (C) {
    }
};

exports.DELETE = function(a, b) {
    a = {a: "DELETE FROM " + a + (count(b) ? " WHERE " : ""), b: []};
    condition(a, b);
    try {
        return con.query(a.a, a.b)
    } catch (d) {
    }
};

exports.INSERT = function(table, param) {
    var a = [],
        b = [];
    foreach(param, function(key, v) {
        a.push(':' + key);
        b.push("`" + key + "`");
    });
    try {
        return con.query("INSERT INTO " + table + "(" + b.join(',') + ") VALUES(" + a.join(',') + ")", param)
    } catch (C) {
    }
};

exports._JOIN = function(table1, table2, b, c, d = "", e = 0, f = "") {
    var g = "";
    foreach(table2, function(h, i) {
        g += "JOIN " + h + " on " + i + " ";
    });
    g = g.substr(0, -1);
    var a = {a: "SELECT " + b + " FROM " + table1 + " " + g + (count(c) ? " WHERE " : ""), b: []};
    condition(a, c);
    try {
        return con.query(a.a + (d ? " ORDER BY " + d + (e ? " DESC" : "") : "") + (f ? " LIMIT " + f : ""), a.b);
    } catch (C) {
    }
};

var condition = function(a, b) {
    var e, S, like, is;
    if (0 in b && b[0]) {
        foreach(b, function(b) {
            a.a += count(a.b) ? "OR " : "";
            e = 0;
            foreach(b, function(b, d) {
                S = b.split(' ');
                like = 1 in S && S[1] == "LIKE";
                is = 1 in S && S[1] == "IN";
                b = b.replace('.', '`.`');
                b = b.split(' ');
                z = b[0].substr(0, 6);
                b[0] = (z == "LOWER(" || z == "UPPER(") ? z + "`" + b[0].substr(6, -1) + "`)" : "`" + b[0] + "`";
                b = b.join(' ');
                if (!is && !like && (!(1 in S) || !in_array(S[1], ["<=", ">=", "<", ">"]))) b += " =";
                a.a += (e++ ? 'AND ' : '') + (is ? b + " (" + d.join(',') + ") " : b + " ? ");
                if (!is) a.b.push(like ? '%' + _preg_quote(d, '%') + '%' : d);
            });
        });
    } else {
        e = 0;
        foreach(b, function(b, d) {
            S = b.split(' ');
            like = 1 in S && S[1] == "LIKE";
            is = 1 in S && S[1] == "IN";
            b = b.replace('.', '`.`');
            b = b.split(' ');
            z = b[0].substr(0, 6);
            b[0] = (z == "LOWER(" || z == "UPPER(") ? z + "`" + b[0].substr(6, -1) + "`)" : "`" + b[0] + "`";
            b = b.join(' ');
            if (!is && !like && (!(1 in S) || !in_array(S[1], ["<=", ">=", "<", ">"]))) b += " =";
            a.a += (e++ ? 'AND ' : '') + (is ? b + " (" + d.join(',') + ") " : b + " ? ");
            if (!is) a.b.push(like ? '%' + _preg_quote(d, '%') + '%' : d);
        });
    }
    a.a = trim(a.a);
};
