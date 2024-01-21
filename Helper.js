
exports._typeof = function(e) {
	return (_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
		return typeof e
	} : function(e) {
		return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
	})(e)
}

exports._objectSpread = function(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys(Object(t), !0).forEach(function(r) {
			_defineProperty(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}

exports.ownKeys = function(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}

exports._defineProperty = function(obj, key, value) {
	key = _toPropertyKey(key);
	if (key in obj) {
		Object.defineProperty(obj, key, {
			value: value,
			enumerable: true,
			configurable: true,
			writable: true
		});
	} else {
		obj[key] = value;
	}
	return obj;
}

exports._classCallCheck = function(e, t) {
	if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
}

exports._defineProperties = function(e, t) {
	for (var r = 0; r < t.length; r++) {
		var o = t[r];
		o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o)
	}
}

exports._createClass = function(e, t, r) {
	return t && _defineProperties(e.prototype, t), r && _defineProperties(e, r), Object.defineProperty(e, "prototype", {
		writable: !1
	}), e
}

exports._toPropertyKey = function(e) {
	e = _toPrimitive(e, "string");
	return "symbol" == _typeof(e) ? e : String(e)
}

exports._toPrimitive = function(e, t) {
	if ("object" != _typeof(e) || !e) return e;
	var r = e[Symbol.toPrimitive];
	if (void 0 === r) return ("string" === t ? String : Number)(e);
	t = r.call(e, t || "default");
	if ("object" != _typeof(t)) return t;
	throw new TypeError("@@toPrimitive must return a primitive value.")
}

exports.foreach = function(r, t) {
	var o, e,
		c = 0,
		a = "",
		i = "",
		n = function(r) {
			var n = function(r) {
				return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
			};
			if ("function" == typeof Symbol && "symbol" == typeof Symbol.iterator) {
				n = function(r) {
					return typeof r;
				};
			}
			return n(r);
		};
	if ("function" != n(t)) throw new TypeError("foreach: callBack should be function, " + n(t) + "given.");
	switch (Object.prototype.toString.call(r)) {
		case "[object Array]":
			i = "array";
			break;
		case "[object Object]":
			i = "object";
			break;
		case "[object String]":
			i = "string";
			break;
		default:
			throw (i = Object.prototype.toString.call(r), new TypeError("foreach: collection should be array, object or string, " + i + " given."));
	}
	switch (i) {
		case "array":
		case "string":
			for (c = 0, e = r.length; c < e; c += 1)
				if ((o = t.length == 1 ? t(r[c]) : t(c, r[c]))) return o;
			break;
		case "object":
			for (a in r)
				if (r.hasOwnProperty(a) && (o = t.length == 1 ? t(r[a]) : t(a, r[a]))) break;
			break;
		default:
			throw new Error("Continuity error in forEach, this should not be possible.");
	}
	return null;
};

exports.count = function(r) {
	return r ? Object.keys(r).length : 0;
}

exports.trim = function(r) {
	return r.replace(/^\s+|\s+$/gm, "");
};

exports.in_array = function(r, e) {
	return e.indexOf(r) != -1;
}

exports.is_scalar = function(mixed_var) {
	return /boolean|number|string/.test(_typeof(mixed_var));
}

exports.is_array = function(r) {
	var t = r && "[object Array]" === Object.prototype.toString.call(r);
	return t ? true : typeof r === 'object';
}

exports.is_array2 = function(r) {
	return "[object Array]" === Object.prototype.toString.call(r);
}

exports.file_get_contents = function(url) {
	return require('fs').readFileSync(url, 'utf-8')
}

exports.is_readable = function(a) {
	var fs = require('fs')
	try {
		fs.accessSync(a, fs.constants.R_OK)
		return true
	} catch (err) {
	}
}

exports.is_writable = function(a) {
	var fs = require('fs')
	try {
		fs.accessSync(a, fs.constants.W_OK)
		return true
	} catch (err) {
	}
}

exports.file_exists = function(a) {
	return require('fs').existsSync(a)
}

exports.initCache = function() {
	function e(e) {
		return r.push(e[0]), e
	}
	var r = [];
	return e.get = function(e) {
		if (e >= r.length) throw RangeError("Can't resolve reference ".concat(e + 1));
		return r[e]
	}, e
}

exports.expectType = function(e, r) {
	var t = (/^(?:N(?=;)|[bidsSaOCrR](?=:)|[^:]+(?=:))/g.exec(e) || [])[0];
	if (!t) throw SyntaxError("Invalid input: " + e);
	switch (t) {
		case "N":
			return r([null, 2]);
		case "b":
			return r(expectBool(e));
		case "i":
			return r(expectInt(e));
		case "d":
			return r(expectFloat(e));
		case "s":
			return r(expectString(e));
		case "S":
			return r(expectEscapedString(e));
		case "a":
			return expectArray(e, r);
		case "O":
			return expectObject(e, r);
		case "C":
			return expectClass(e, r);
		case "r":
		case "R":
			return expectReference(e, r);
		default:
			throw SyntaxError("Invalid or unsupported data type: ".concat(t))
	}
}

exports.expectBool = function(e) {
	var r = /^b:([01]);/.exec(e) || [],
		e = _slicedToArray(r, 2),
		r = e[0],
		e = e[1];
	if (!e) throw SyntaxError("Invalid bool value, expected 0 or 1");
	return ["1" === e, r.length]
}

exports.expectInt = function(e) {
	var r = /^i:([+-]?\d+);/.exec(e) || [],
		e = _slicedToArray(r, 2),
		r = e[0],
		e = e[1];
	if (!e) throw SyntaxError("Expected an integer value");
	return [parseInt(e, 10), r.length]
}

exports.expectFloat = function(e) {
	var r, t = /^d:(NAN|-?INF|(?:\d+\.\d*|\d*\.\d+|\d+)(?:[eE][+-]\d+)?);/.exec(e) || [],
		e = _slicedToArray(t, 2),
		t = e[0],
		n = e[1];
	if (!n) throw SyntaxError("Expected a float value");
	switch (n) {
		case "NAN":
			r = Number.NaN;
			break;
		case "-INF":
			r = Number.NEGATIVE_INFINITY;
			break;
		case "INF":
			r = Number.POSITIVE_INFINITY;
			break;
		default:
			r = parseFloat(n)
	}
	return [r, t.length]
}

exports.readBytes = function(e, r) {
	for (var t = 2 < arguments.length && void 0 !== arguments[2] && arguments[2], n = 0, a = "", c = 0, o = e.length, s = !1, i = 0; n < r && c < o;) {
		var u = e.charAt(c),
			x = u.charCodeAt(0),
			p = 55296 <= x && x <= 56319,
			d = 56320 <= x && x <= 57343;
		t && "\\" === u && (u = String.fromCharCode(parseInt(e.substr(c + 1, 2), 16)), i++, c += 2), c++, n += p || d && s ? 2 : 2047 < x ? 3 : 127 < x ? 2 : 1, n += s && !d ? 1 : 0, a += u, s = p
	}
	return [a, n, i]
}

exports.expectString = function(e) {
	var r = /^s:(\d+):"/g.exec(e) || [],
		t = _slicedToArray(r, 2),
		n = t[0],
		a = t[1];
	if (!n) throw SyntaxError("Expected a string value");
	r = parseInt(a, 10), t = readBytes(e = e.substr(n.length), r), a = _slicedToArray(t, 2), t = a[0], a = a[1];
	if (a !== r) throw SyntaxError("Expected string of ".concat(r, " bytes, but got ").concat(a));
	if (!(e = e.substr(t.length)).startsWith('";')) throw SyntaxError('Expected ";');
	return [t, n.length + t.length + 2]
}

exports.expectEscapedString = function(e) {
	var r = /^S:(\d+):"/g.exec(e) || [],
		t = _slicedToArray(r, 2),
		n = t[0],
		a = t[1];
	if (!n) throw SyntaxError("Expected an escaped string value");
	var c = parseInt(a, 10),
		r = readBytes(e = e.substr(n.length), c, !0),
		t = _slicedToArray(r, 3),
		a = t[0],
		r = t[1],
		t = t[2];
	if (r !== c) throw SyntaxError("Expected escaped string of ".concat(c, " bytes, but got ").concat(r));
	if (!(e = e.substr(a.length + 2 * t)).startsWith('";')) throw SyntaxError('Expected ";');
	return [a, n.length + a.length + 2]
}

exports.expectKeyOrIndex = function(e) {
	try {
		return expectString(e)
	} catch (e) {}
	try {
		return expectEscapedString(e)
	} catch (e) {}
	try {
		return expectInt(e)
	} catch (e) {
		throw SyntaxError("Expected key or index")
	}
}

exports.expectObject = function(e, r) {
	var t = /^O:(\d+):"([^"]+)":(\d+):\{/.exec(e) || [],
		n = _slicedToArray(t, 4),
		a = n[0],
		t = n[2],
		n = n[3];
	if (!a) throw SyntaxError("Invalid input");
	if ("stdClass" !== t) throw SyntaxError("Unsupported object type: ".concat(t));
	var c = a.length,
		o = parseInt(n, 10),
		s = {};
	r([s]), e = e.substr(c);
	for (var i = 0; i < o; i++) {
		var u = expectKeyOrIndex(e);
		e = e.substr(u[1]), c += u[1];
		var x = expectType(e, r);
		e = e.substr(x[1]), c += x[1], s[u[0]] = x[0]
	}
	if ("}" !== e.charAt(0)) throw SyntaxError("Expected }");
	return [s, c + 1]
}

exports.expectClass = function(e, r) {
	throw Error("Not yet implemented")
}

exports.expectReference = function(e, r) {
	var t = /^[rR]:([1-9]\d*);/.exec(e) || [],
		e = _slicedToArray(t, 2),
		t = e[0],
		e = e[1];
	if (!t) throw SyntaxError("Expected reference value");
	return [r.get(parseInt(e, 10) - 1), t.length]
}

exports.expectArray = function(e, r) {
	var t = /^a:(\d+):{/.exec(e) || [],
		n = _slicedToArray(t, 2),
		t = n[0],
		n = n[1];
	if (!n) throw SyntaxError("Expected array length annotation");
	r = expectArrayItems(e = e.substr(t.length), parseInt(n, 10), r);
	if ("}" !== e.charAt(r[1])) throw SyntaxError("Expected }");
	return [r[0], t.length + r[1] + 1]
}

exports.expectArrayItems = function(e) {
	var r, t, n = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 0,
		a = 2 < arguments.length ? arguments[2] : void 0,
		c = 0,
		o = !0,
		s = -1,
		i = {};
	a([i]);
	for (var u = 0; u < n; u++) r = expectKeyOrIndex(e), o = o && "number" == typeof r[0] && r[0] === s + 1, s = r[0], e = e.substr(r[1]), c += r[1], t = expectType(e, a), e = e.substr(t[1]), c += t[1], i[r[0]] = t[0];
	return o && (i = Object.values(i)), [i, c]
}

exports.unserialize = function(e) {
	try {
		return "string" != typeof e ? !1 : expectType(e, initCache())[0]
	} catch (e) {
		return console.error(e), !1
	}
};

exports.strtolower = function(r) {
	return ("string" == typeof r || r instanceof String) && (r = r.toLowerCase()), r;
}

exports.strtr = function(n, t) {
	for (const r in t) n = n.split(r).join(t[r]);
	return n
}

exports.print_r = function(r, e) {
	var o = "";
	e = e || 0;
	for (var t = "", f = 0; f < e + 1; f++) t += "";
	if ("object" == typeof r)
		for (var n in r) {
			var a = r[n];
			"object" == typeof a ? (o += t + "'" + n + "' ...\n", o += print_r(a, e + 1)) : o += t + "'" + n + "' => \"" + a + '"\n'
		} else o = "===>" + r + "<===(" + typeof r + ")";
	return o
};

exports.htmlEntities = function(str) {
	return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

exports.addcslashes = function(e, t) {
	let r = "";
	const a = [];
	let h = 0,
		n = 0,
		c = "";
	var s;
	let o = "",
		l = "";
	var i;
	let f = 0,
		d = 0;
	var A, g, u;
	let p = [];
	var C;
	const b = /%([\dA-Fa-f]+)/g;
	function w(e, t) {
		return (e += "").length < t ? new Array(++t - e.length).join("0") + e : e
	}
	for (h = 0; h < t.length; h++)
		if (c = t.charAt(h), s = t.charAt(h + 1), "\\" === c && s && /\d/.test(s)) {
			if (o = t.slice(h + 1).match(/^\d+/)[0], A = o.length, g = h + A + 1, t.charAt(g) + t.charAt(g + 1) === "..") {
				if (f = o.charCodeAt(0), /\\\d/.test(t.charAt(g + 2) + t.charAt(g + 3))) l = t.slice(g + 3).match(/^\d+/)[0], h += 1;
				else {
					if (!t.charAt(g + 2)) throw new Error("Range with no end point");
					l = t.charAt(g + 2)
				}
				if (d = l.charCodeAt(0), d > f)
					for (n = f; n <= d; n++) a.push(String.fromCharCode(n));
				else a.push(".", o, l);
				h += l.length + 2
			} else i = String.fromCharCode(parseInt(o, 8)), a.push(i);
			h += A
		} else if (s + t.charAt(h + 2) === "..") {
		if (o = c, f = o.charCodeAt(0), /\\\d/.test(t.charAt(h + 3) + t.charAt(h + 4))) l = t.slice(h + 4).match(/^\d+/)[0], h += 1;
		else {
			if (!t.charAt(h + 3)) throw new Error("Range with no end point");
			l = t.charAt(h + 3)
		}
		if (d = l.charCodeAt(0), d > f)
			for (n = f; n <= d; n++) a.push(String.fromCharCode(n));
		else a.push(".", o, l);
		h += l.length + 2
	} else a.push(c);
	for (h = 0; h < e.length; h++)
		if (c = e.charAt(h), -1 !== a.indexOf(c))
			if (r += "\\", (u = c.charCodeAt(0)) < 32 || 126 < u) switch (c) {
				case "\n":
					r += "n";
					break;
				case "\t":
					r += "t";
					break;
				case '\u000D':
					r += "r";
					break;
				case '\u0007':
					r += "a";
					break;
				case "\v":
					r += "v";
					break;
				case "\b":
					r += "b";
					break;
				case "\f":
					r += "f";
					break;
				default:
					for (C = encodeURIComponent(c), null !== (p = b.exec(C)) && (r += w(parseInt(p[1], 16).toString(8), 3)); null !== (p = b.exec(C));) r += "\\" + w(parseInt(p[1], 16).toString(8), 3)
			} else r += c;
			else r += c;
	return r
}

exports.empty = function(r) {
	let t, e, n, f;
	var o = [t, null, !1, 0, "", "0"];
	for (n = 0, f = o.length; n < f; n++)
		if (r === o[n]) return !0;
	if ("object" != typeof r) return !1;
	for (e in r)
		if (r.hasOwnProperty(e)) return !1;
	return !0
}

exports.dirname = function(e) {
	return (/(.*)\/+([^/]*)$/.exec(e) || /()(.*)$/.exec(e))[1]
}

exports.serialize = function(e) {
	let r, n, t, a = "", o = 0;
	function i(e) {
		let r, n, t, a, o = typeof e;
		if ("object" === o && !e) return "null";
		if ("object" === o) {
			if (!e.constructor) return "object";
			for (n in t = e.constructor.toString(), r = t.match(/(\w+)\(/), r && (t = r[1].toLowerCase()), a = ["boolean", "number", "string", "array"], a)
				if (t === a[n]) {
					o = a[n];
					break
				}
		}
		return o
	}
	var c = i(e);
	switch (c) {
		case "function":
			r = "";
			break;
		case "boolean":
			r = "b:" + (e ? "1" : "0");
			break;
		case "number":
			r = (Math.round(e) === e ? "i" : "d") + ":" + e;
			break;
		case "string":
			r = "s:" + ~-encodeURI(e).split(/%..|./).length + ':"' + e + '"';
			break;
		case "array":
		case "object":
			for (n in r = "a", e) e.hasOwnProperty(n) && "function" !== i(e[n]) && (t = n.match(/^[0-9]+$/) ? parseInt(n, 10) : n, a += serialize(t) + serialize(e[n]), o++);
			r += ":" + o + ":{" + a + "}";
			break;
		case "undefined":
		default:
			r = "N"
	}
	return "object" !== c && "array" !== c && (r += ";"), r
}

exports.realpath = function(e) {
	if ("undefined" == typeof window) {
		const a = require("path");
		return a.normalize(e)
	}
	let r = 0;
	var n;
	const t = this.window.location.href;
	for (const o in -1 !== (e = (e + "").replace("\\", "/")).indexOf("://") && (r = 1), r || (e = t.substring(0, t.lastIndexOf("/") + 1) + e), n = e.split("/"), e = [], n) "." !== n[o] && (".." === n[o] ? 3 < e.length && e.pop() : (e.length < 2 || "" !== n[o]) && e.push(n[o]));
	return e.join("/")
}

exports.file_put_contents = function(n, e, o) {
	return require("fs").writeFile(n, e, {
		encoding: "utf8",
		flag: 8 == o ? "a" : ""
	});
}

exports.preg_replace = function(e, n, t) {
	let r = e.substr(e.lastIndexOf(e[0]) + 1);
	r = "" !== r ? r : "g";
	e = e.substr(1, e.lastIndexOf(e[0]) - 1), e = new RegExp(e, r);
	return t.replace(e, n)
}

exports.preg_split = function(e, n, t, r) {
	t = t || 0, r = r || "";
	var i, l, _, E, P, g = [],
		f = 0,
		o = 0,
		c = 0,
		T = /^\/(.*)\/\w*$/.exec(e.toString())[1],
		p = /^\/.*\/(\w*)$/.exec(e.toString())[1];
	if (e = e.global && "string" != typeof e ? e : new RegExp(T, p + (-1 !== p.indexOf("g") ? "" : "g")), P = {
			PREG_SPLIT_NO_EMPTY: 1,
			PREG_SPLIT_DELIM_CAPTURE: 2,
			PREG_SPLIT_OFFSET_CAPTURE: 4
		}, "number" != typeof r) {
		for (r = [].concat(r), o = 0; o < r.length; o++) P[r[o]] && (c |= P[r[o]]);
		r = c
	}
	l = r & P.PREG_SPLIT_NO_EMPTY, _ = r & P.PREG_SPLIT_DELIM_CAPTURE, E = r & P.PREG_SPLIT_OFFSET_CAPTURE;

	function s(e, n) {
		l && !e.length || (E && (e = [e, n]), g.push(e))
	}
	if (!T) {
		for (i = n.split(""), o = 0; o < i.length; o++) s(i[o], o);
		return g
	}
	for (;
		(i = e.exec(n)) && 1 !== t;) {
		if (s(n.slice(f, i.index), f), f = i.index + i[0].length, _)
			for (var x = Array.prototype.slice.call(i), o = 1; o < x.length; o++) void 0 !== i[o] && s(i[o], i.index + i[0].indexOf(i[o]));
		t--
	}
	return s(n.slice(f, n.length), f), g
}

exports.preg_split2 = function(n, e, t) {
 	var a = [];
 	foreach(e.split(n), function(b) {
 		if (!t || t && b) a.push(b)
 	});
 	return a;
 }

exports.end = function(e) {
	const t = "undefined" != typeof window ? window : global;
	t.$locutus = t.$locutus || {};
	const n = t.$locutus;
	n.php = n.php || {}, n.php.pointers = n.php.pointers || [];
	const o = n.php.pointers;
	o.indexOf || (o.indexOf = function(e) {
		for (let t = 0, n = this.length; t < n; t++)
			if (this[t] === e) return t;
		return -1
	}), -1 === o.indexOf(e) && o.push(e, 0);
	var i = o.indexOf(e);
	if ("[object Array]" === Object.prototype.toString.call(e)) return 0 !== e.length && (o[i + 1] = e.length - 1, e[o[i + 1]]);
	{
		let t = 0,
			n;
		for (const r in e) t++, n = e[r];
		return 0 === t ? !1 : (o[i + 1] = t - 1, n)
	}
}

exports.strcmp = function(n, r) {
	return n == r ? 0 : r < n ? 1 : -1
}

exports.max = function(e = []) {
	return e.reduce((e, n) => e < n ? n : e, -1 / 0)
}

exports.substr_count = function(a, b) {
	return a.split(b).length - 1;
}

exports._count = function(a) {
	return count(a) - 1;
}

exports.urlencode = function(e) {
	return e += "", encodeURIComponent(e).replace(/!/g, "%21").replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A").replace(/~/g, "%7E").replace(/%20/g, "+")
}

exports._preg_quote = function(r, e) {
    return (r + "").replace(new RegExp("[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\" + (e || "") + "-]", "g"), "\\$&");
};

exports.array_merge = function() {
    var r = Array.prototype.slice.call(arguments),
        t = r.length;
    let e;
    const o = {};
    let a = "";
    var l;
    let n = 0,
        c = 0,
        f = 0;
    const i = Object.prototype.toString;
    let y = !0;
    for (c = 0; c < t; c++)
        if ("[object Array]" !== i.call(r[c])) {
            y = !1;
            break
        } if (y) {
        for (y = [], c = 0; c < t; c++) y = y.concat(r[c]);
        return y
    }
    for (c = 0, f = 0; c < t; c++)
        if (e = r[c], "[object Array]" === i.call(e))
            for (n = 0, l = e.length; n < l; n++) o[f++] = e[n];
        else
            for (a in e) e.hasOwnProperty(a) && (parseInt(a, 10) + "" === a ? o[f++] = e[a] : o[a] = e[a]);
    return o
};

exports._file_get_contents = function(r, e) {
	r = file_exists(r) ? file_get_contents(r) : e;
	return is_array(e) ? JSON.parse(r) : r;
};
