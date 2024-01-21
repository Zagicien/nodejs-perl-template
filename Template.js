_require = function(a){
var b = require(a)
for (var c in b) global[c] = b[c];
}
_require('./Helper.js');

exports.Template = Template = function() {
	function Template(options) {
		_classCallCheck(this, Template);
		this.options = {};
		this.need_names = {
			TMPL_VAR: 1,
			TMPL_LOOP: 1,
			TMPL_IF: 1,
			TMPL_UNLESS: 1,
			TMPL_INCLUDE: 1
		};
		this.template = "";
		this.nodes = [];
		this.names = [];
		this.depth = 0;
		this.paramScope = [];
		this.param = "";
		this.totalPass = [];
		this.output = "";
		this.curPass = [];
		this.version = "0.3.3";
		var newoptions = {};
		if (is_scalar(options)) {
			options = _objectSpread({}, {filename: options})
		} else if (!is_array(options)) {
			return;
		} else if ('_parent' in options) {
			this.nodes = options._parent.nodes;
			this.names = options._parent.names;
			this.depth = options._parent.depth + 1;
		}
		this.SetOptions(options);
		if (!is_readable(this.options.filename)) {
			throw new TypeError("Template.Template() : Template file \"" + this.options.filename + "\" not found");
		}
		this.template = file_get_contents(this.options.filename)
		if (this.options.parse) {
			this.Parse();
			this.param = {};
			this.paramScope.push(this.param);
		}
	}
	_createClass(Template, [{
		key: "SetOptions",
		value: function(options) {
			this.options = {
				"debug": 0,
				"die_on_bad_params": 1,
				"strict": 1,
				"loop_context_vars": 0,
				"max_includes": 10,
				"global_vars": 0,
				"no_includes": 0,
				"case_sensitive": 0,
				"hash_comments": 0,
				"parse": 1,
				"imark": '<',
				"emark": '>',
				"parse_html_comments": 1,
				"vanguard_compatibility_mode": 0
			};
			foreach(options, function(key, value) {
				this.options[strtolower(key)] = value;
			}.bind(this))
			if (this.options.vanguard_compatibility_mode) {
				this.options.die_on_bad_params = 0;
			}
		}
	}, {
		key: "EscapePREGText",
		value: function(text) {
			return strtr(text, {
				'\\': '\\\\',
				'/': '\/',
				'^': '\^',
				'$': '\$',
				'.': '\.',
				'[': '\[',
				']': '\]',
				'|': '\|',
				'(': '\(',
				')': '\)',
				'?': '\?',
				'*': '\*',
				'+': '\+',
				'{': '\{',
				'}': '\}',
				'%': '\%'
			});
		}
	}, {
		key: "Parse",
		value: function() {
			var lineNumber = 1;
			var inLoop = [];
			var inIf = [];
			var inUnless = [];
			var curType = [];
			if (this.options.vanguard_compatibility_mode) {
				this.template = preg_replace("/%([-\w\/\.+]+)%/", this.options.imark + "TMPL_VAR NAME=\\1" + this.options['emark'], this.template);
			}
			if (this.options.hash_comments) {
				this.template = preg_replace("/### .*/", "", this.template);
			}
			var imark = this.EscapePREGText(this.options.imark);
			var emark = this.EscapePREGText(this.options.emark);
			var delim, delim2, emark0 = this.EscapePREGText(this.options.emark[0]);
			if (this.options.parse_html_comments) {
				if (this.options.imark[0] == '<') {
					delim = "<(?:!--\\s*)?" + imark.substring(1);
				} else {
					delim = "(?:<!--\\s*)?" + imark;
				}
				if (this.options.emark[0] == '>') {
					delim2 = emark.substring(0, emark.length - 1) + "(?:\s*--)?>";
				} else {
					delim2 = emark + "(?:\s*-->)?";
				}
			} else {
				delim = imark;
				delim2 = emark;
			}
			var regex = "(" + delim + "?\\\/?[Tt][Mm][Pp][Ll]_\\w+(?:(?:\\s+(?:(?:\"[^\"]*\")|(?:\\'[\\']*\\')|(?:[^=\\s" + emark0 + "]+))(?:=(?:\"[^\"]*\"|\\'[^\\']*\\'|(?:[^\\s" + emark0 + "]*)))?)(?:\\s+[^=\\s]+(?:=(?:\"[^\"]+\"|\\'[^\\']\\'|(?:[^\\s" + emark0 + "]*)))?)*)?" + delim2 + ")";
			var regex2 = delim + "?(\\\/?[Tt][Mm][Pp][Ll]_\\w+)((?:\\s+(?:(?:\"[^\"]*\")|(?:\\'[\\']*\\')|(?:[^=\\s" + emark0 + "]+))(?:=(?:\"[^\"]*\"|\\'[^\\']*\\'|(?:[^\\s" + emark0 + "]*)))?)(?:\\s+[^=\\s]+(?:=(?:\"[^\"]+\"|\\'[^\\']\\'|(?:[^\\s" + emark0 + "]*)))?)*)?" + delim2;
			var chunks = preg_split2(new RegExp(regex), this.template, 3);
			this.template = "";
			var tag, which, var2, token, t, match, name, escape2, global, default2, newOptions;
			foreach(chunks, function(value) {
				if (count(tag = value.match(regex2))) {
					which = tag[1].toUpperCase();
					var2 = {
						"name": "",
						"escape2": "",
						"global": "",
						"default2": ""
					};
					if (2 in tag && tag[2]) {
						token = preg_split2(/((?:[^\s=]+=)?(?:(?:\"[^\"]+\")|(?:\'[^\']+\')|(?:\S*)))/, trim(tag[2]), 3);
						foreach(token, function(tok) {
							if (count(tok.match(/=/))) {
								t = preg_split2(/\s*=\s*/, tok, 3);
								match = t[1].match(/(?:\"([^\"]*)\")|(?:\'([^\']*)\')|(\S*)/);
								var2[t[0].toLowerCase()] = [1 in match && match[1] ? match[1] : 0, 2 in match && match[2] ? match[2] : 0, 3 in match && match[3] ? match[3] : 0].sort().pop();
							} else if (!count(tok.match(/^\s*$/))) {
								match = tok.match(/(?:\"([^\"]*)\")|(?:\'([^\']*)\')|(\S*)/);
								var2.name = [1 in match && match[1] ? match[1] : 0, 2 in match && match[2] ? match[2] : 0, 3 in match && match[3] ? match[3] : 0].sort().pop();
							}
						});
					}
					name = var2.name;
					escape2 = var2.escape2;
					global = var2.global;
					default2 = var2.default2;
					if (escape2 == "1") {
						escape2 = "HTML";
					} else if (empty(escape2) || !strcmp(escape2, "NONE")) {
						escape2 = 0;
					} else {
						escape2 = escape2.toUpperCase();
					}
					global = global ? 1 : 0;
					if (which != 'TMPL_INCLUDE' && !this.options.case_sensitive) {
						name = strtolower(name);
					}
					if (name && !count(name.match(/^[-\w\/+_\.]*$/))) {
						throw new TypeError("Template.Parse() : Invalid character(s) in NAME attribute (" + htmlentities(name) + ") for " + which + " tag, found at " + this.options.filename + ", line " + lineNumber);
					}
					if (empty(name) && which in this.need_names) {
						throw new TypeError("Template.Parse() : No NAME given to a " + which + " tag at " + this.options.filename + " : line " + lineNumber);
					}
					if (escape2 && which != 'TMPL_VAR') {
						throw new TypeError("Template.Parse() : ESCAPE option invalid in a " + which + " tag at " + this.options.filename + " : line " + lineNumber);
					}
					if (default2 && which != 'TMPL_VAR') {
						throw new TypeError("Template.Parse() : DEFAULT option invalid in a " + which + " tag at " + this.options.filename + " : line " + lineNumber);
					}
					switch (which) {
						case 'TMPL_VAR':
							if (in_array(name, ['__pass__', '__passtotal__', '__counter__'])) {
								if (count(inLoop)) {
									this.nodes.push(new Node("ContextVAR", name));
								} else {
									throw new TypeError("Template.Parse() : Found context VAR tag outside of LOOP, at " + this.options.filename + " : line " + lineNumber);
								}
							} else {
								this.nodes.push(new Node("VAR", name, escape2, global, default2));
								this.names[name] = 1;
							}
							break;

						case 'TMPL_LOOP':
							this.nodes.push(new Node("LOOP", name, "", global));
							inLoop.push(_count(this.nodes));
							curType.push("LOOP");
							this.names[name] = 1;
							break;
						case '/TMPL_LOOP':
							if (!strcmp(end(curType), "LOOP")) {
								this.nodes[end(inLoop)].jumpTo = count(this.nodes);
								inLoop.pop();
								curType.pop();
							} else {
								throw new TypeError("Template.Parse() : Nesting error: found end /TMPL_LOOP tag without its corresponding initial tag, at " + this.options.filename + " : line " + lineNumber + " (last opened tag is of type \"" + end(curType) + "\")");
							}
							break;

						case 'TMPL_IF':
							if (in_array(name, ['__first__', '__odd__', '__inner__', '__last__'])) {
								if (count(inLoop)) {
									this.nodes.push(new Node("ContextIF", name));
								} else {
									throw new TypeError("Template.Parse() : Found context IF/UNLESS tag outside of LOOP, at " + this.options.filename + " : line " + lineNumber);
								}
							} else {
								this.nodes.push(new Node("IF", name, "", global));
								this.names[name] = 1;
							}
							inIf.push(_count(this.nodes));
							curType.push("IF");
							break;
						case '/TMPL_IF':
							if (!strcmp(end(curType), "IF")) {
								this.nodes[end(inIf)].jumpTo = count(this.nodes);
								inIf.pop();
								curType.pop();
							} else {
								throw new TypeError("Template.Parse() : Nesting error: found end /TMPL_IF tag without its corresponding initial tag, at " + this.options.filename + " : line " + lineNumber);
							}
							break;
						case 'TMPL_UNLESS':
							if (in_array(name, ['__first__', '__odd__', '__inner__', '__last__'])) {
								this.nodes.push(new Node("ContextUNLESS", name));
							} else {
								this.nodes.push(new Node("UNLESS", name, "", global));
								this.names[name] = 1;
							}
							inUnless.push(_count(this.nodes));
							curType.push("UNLESS");
							break;

						case '/TMPL_UNLESS':
							if (!strcmp(end(curType), "UNLESS")) {
								this.nodes[end(inUnless)].jumpTo = count(this.nodes);
								inUnless.pop();
								curType.pop();
							} else {
								throw new TypeError("Template.Parse() : Nesting error: found end /TMPL_UNLESS tag without its corresponding initial tag, at " + this.options.filename + " : line " + lineNumber);
							}
							break;

						case 'TMPL_ELSE':
							if (!strcmp(end(curType), "IF") || !strcmp(end(curType), "UNLESS")) {
								if (!strcmp(end(curType), "IF")) {
									this.nodes[end(inIf)].else2 = count(this.nodes);
								} else {
									this.nodes[end(inUnless)].else2 = count(this.nodes);
								}
							} else {
								throw new TypeError("Template.Parse() : Nesting error: found end TMPL_ELSE tag without its corresponding initial tag, at " + this.options.filename + " : line " + lineNumber);
							}
							break;
						case 'TMPL_INCLUDE':
							if (!this.options.no_includes) {
								if (this.depth >= this.options.max_includes && this.options.max_includes > 0) {
									throw new TypeError("Template.Parse() : Include error: Too many included templates, found at " + this.options.filename + " : line " + lineNumber);
								} else {
									new Template(_objectSpread(this.options, {
										filename: name,
										_parent: this
									}));
								}
							}
							break;
						default:
							throw new TypeError("Template.Parse() : Unknown or unmatched TMPL construct at " + this.options.filename + " : line " + lineNumber);
							break;
					}
				} else {
					if (this.options.strict && count(value.match("/" + delim + "\/?[Tt][Mm][Pp][Ll]_/"))) {
						throw new TypeError("Template.Parse() : Syntax error in &lt;TMPL_*&gt; tag at " + this.options.filename + " : line " + lineNumber);
					}
					this.nodes.push(new Node("MARKUP", value));
				}
				lineNumber += substr_count(value, "\n");

			}.bind(this));
			if (count(curType)) {
				throw new TypeError("Template.Parse() : Template " + this.options.filename + " incorrectly terminated. Found " + end(curType) + " tag without corresponding end tag");
			}
		}
	}, {
		key: "ListNodes",
		value: function() {
			var out = "";
			out += "<b>Contents of linearized parse tree</b><br>";
			foreach(this.nodes, function(i, value) {
				out += "<b>[" + i + "]</b> - " + value.type + " - <code>" + htmlentities(addcslashes(value.name, "\n\r")) + "</code>" + (value.else2 ? "" : " <code>{ Next } else { " + value.else2 + " }</code>") + (value.jumpTo ? "" : " - Jump to " + value.jumpTo) + "<br>\n";
			})
			out += "<b>Variables used in template</b><br>";
			out += "<pre>" + print_r(this.names) + "</pre>";
			return out
		}
	}, {
		key: "AddParam",
		value: function(arg, value) {
			if (arguments.length == 2) {
				if (is_scalar(value) || empty(value)) {
					if (!this.options.case_sensitive) {
						arg = strtolower(arg);
					}
					if (arg in this.names) {
						this.paramScope[_count(this.paramScope)][arg] = value;
					} else if (this.options.die_on_bad_params) {
						throw new TypeError("Template.AddParam() : Attempt to set value for non existent variable name '" + arg + "' - this variable name doesn't match any declarations in the template file");
					}
				} else if (is_array(value)) {
					if (!this.options.case_sensitive) {
						arg = strtolower(arg);
					}
					if (arg in this.names) {
						this.paramScope[_count(this.paramScope)][arg] = [];
						this.paramScope.push(this.paramScope[_count(this.paramScope)][arg]);
						foreach(value, function(a) {
							if (!is_array(a)) {
								throw new TypeError("Template.AddParam() : Must use arrays of associative arrays for loop parameters");
							} else {
								this.paramScope[_count(this.paramScope)].push([]);
								this.paramScope.push(this.paramScope[_count(this.paramScope)][_count(this.paramScope[_count(this.paramScope)])]);
								foreach(a, function(k, v) {
									if (is_scalar(v)) {
										this.SetValue(k, v);
									} else {
										this.AddParam(k, v);
									}
								}.bind(this));
								this.paramScope.pop();
							}
						}.bind(this));
						this.paramScope.pop();
					} else if (this.options.die_on_bad_params) {
						throw new TypeError("Template.AddParam() : Attempt to set value for non existent variable name '" + arg + "' - this variable name doesn't match any declarations in the template file");
					}
				} else {
					throw new TypeError("Template.AddParam() : Wrong value type");
				}
			} else if (arguments.length == 1) {
				if (is_array(arg)) {
					foreach(arg, function(k, v) {
						this.AddParam(k, v);
					}.bind(this));
				} else {
					throw new TypeError("Template.AddParam() : Only one argument set, but it's not an array");
				}
			} else {
				throw new TypeError("Template.AddParam() : Wrong argument count (" + arguments.length + ") arguments");
			}
		}
	}, {
		key: "SetValue",
		value: function(arg, value) {
			if (is_scalar(value) || empty(value)) {
				if (!this.options.case_sensitive) {
					arg = strtolower(arg);
				}
				if (arg in this.names) {
					this.paramScope[_count(this.paramScope)][arg] = value;
				} else if (this.options.die_on_bad_params) {
					throw new TypeError("Template.SetValue() : Attempt to set value for non existent variable name '" + arg + "' - this variable name doesn't match any declarations in the template file");
				}
			} else {
				throw new TypeError("Template.SetValue() : Value must be a scalar");
			}
		}
	}, {
		key: "Output",
		value: function() {
			if (!this.output) {
				this.paramScope = [];
				this.paramScope.push(this.param);
				this.totalPass = [];
				this.curPass = [];
				var n = 0;
				while (n in this.nodes) {
					n = this.ProcessNode(n);
				};
			}
			return this.output;
		}
	}, {
		key: "ProcessNode",
		value: function(n) {
			var last, cond, else2, lvl, j, i, value, node = this.nodes[n];
			switch (node.type) {
				case "MARKUP":
					this.output += node.name;
					return n + 1;
				case "VAR":
					if (_count(this.paramScope) in this.paramScope && node.name in this.paramScope[_count(this.paramScope)]) {
						if (is_scalar(this.paramScope[_count(this.paramScope)][node.name])) {
							value = this.paramScope[_count(this.paramScope)][node.name];
						} else if (is_array(this.paramScope[_count(this.paramScope)][node.name])) {
							value = count(this.paramScope[_count(this.paramScope)][node.name]);
						}
						if (!strcmp(node.escape, "HTML")) {
							this.output += htmlspecialchars(value);
						} else if (!strcmp(node.escape, "URL")) {
							this.output += htmlentities(urlencode(value));
						} else {
							this.output += value;
						}
					} else if (node.default2) {
						if (!strcmp(node.escape2, "HTML")) {
							this.output += htmlspecialchars(node.default2);
						} else if (!strcmp(node.escape2, "URL")) {
							this.output += htmlentities(urlencode(node.default2));
						} else {
							this.output += node.default2;
						}
					} else if (this.options.global_vars || this.nodes[n].global) {
						for (lvl = count(this.paramScope) - 2;
							(!(lvl in this.paramScope) || !(node.name in this.paramScope[lvl])) && lvl >= 0; lvl--);
						if (lvl >= 0) {
							if (is_scalar(this.paramScope[lvl][node.name])) {
								value = this.paramScope[lvl][node.name];
							} else if (is_array(this.paramScope[lvl][node.name])) {
								value = count(this.paramScope[lvl][node.name]);
							}
							if (!strcmp(node.escape2, "HTML")) {
								this.output += htmlentities(value);
							} else if (!strcmp(node.escape2, "URL")) {
								this.output += htmlentities(urlencode(value));
							} else {
								this.output += value;
							}
						}
					}
					return n + 1;
				case "ContextVAR":
					if (this.options.loop_context_vars && count(this.totalPass)) {
						switch (node.name) {
							case "__pass__":
							case "__counter__":
								this.output += this.curPass[_count(this.curPass)];
								break;
							case "__passtotal__":
								this.output += this.totalPass[_count(this.totalPass)];
								break;
						}
					}
					return n + 1;
				case "LOOP":
					if (_count(this.paramScope) in this.paramScope && node.name in this.paramScope[_count(this.paramScope)]) {
						if (!is_array(this.paramScope[_count(this.paramScope)][node.name])) {
							throw new TypeError("Template.Output() : A scalar value was assigned to a LOOP var (" + node.name + "), but LOOP vars only accept arrays of associative arrays as values,");
						}
						this.paramScope.push(this.paramScope[_count(this.paramScope)][node.name]);
						this.totalPass.push(count(this.paramScope[_count(this.paramScope)]));
						this.curPass.push(0);
						for (i = 0; i < this.totalPass[_count(this.totalPass)]; i++) {
							this.curPass[_count(this.curPass)]++;
							this.paramScope.push(this.paramScope[_count(this.paramScope)][i]);
							for (j = n + 1; j < node.jumpTo;) {
								j = this.ProcessNode(j);
							}
							this.paramScope.pop();
						}
						this.curPass.pop();
						this.totalPass.pop();
						this.paramScope.pop();
						return node.jumpTo;
					} else if (this.options.global_vars || this.nodes[n].global) {
						for (lvl = count(this.paramScope) - 2;
							(!(lvl in this.paramScope) || !(node.name in this.paramScope[lvl])) && lvl >= 0; lvl--);
						if (lvl >= 0) {
							if (!is_array(this.paramScope[lvl][node.name])) {
								throw new TypeError("Template.Output() : A LOOP var (" + node.name + ") was trying to use a scalar value, but LOOP vars only accept arrays of associative arrays as values,");
							}
							this.paramScope.push(this.paramScope[lvl][node.name]);
							this.totalPass.push(count(this.paramScope[_count(this.paramScope)]));
							this.curPass.push(0);
							for (i = 0; i < this.totalPass[_count(this.totalPass)]; i++) {
								this.curPass[_count(this.curPass)]++;
								this.paramScope.push(this.paramScope[_count(this.paramScope)][i]);
								for (j = n + 1; j < node.jumpTo;) {
									j = this.ProcessNode(j);
								}
								this.paramScope.pop();
							}
							this.curPass.pop();
							this.totalPass.pop();
							this.paramScope.pop();
							return node.jumpTo;
						}
					}
				case "IF":
				case "UNLESS":
					cond = 0;
					else2 = node.else2;
					if (_count(this.paramScope) in this.paramScope && node.name in this.paramScope[_count(this.paramScope)]) {
						if (is_scalar(this.paramScope[_count(this.paramScope)][node.name])) {
							cond = this.paramScope[_count(this.paramScope)][node.name];
						} else if (is_array(this.paramScope[_count(this.paramScope)][node.name])) {
							cond = count(this.paramScope[_count(this.paramScope)][node.name]);
						}
					} else if (this.options.global_vars || this.nodes[n].global) {
						for (lvl = count(this.paramScope) - 2;
							(!(lvl in this.paramScope) || !(node.name in this.paramScope[lvl])) && lvl >= 0; lvl--);
						if (lvl >= 0) {
							if (is_scalar(this.paramScope[lvl][node.name])) {
								cond = this.paramScope[lvl][node.name];
							} else if (is_array(this.paramScope[lvl][node.name])) {
								cond = count(this.paramScope[lvl][node.name]);
							} else {
								cond = 0;
							}
						} else {
							cond = 0;
						}
					} else {
						cond = 0;
					}
					if (!strcmp(node.type, "UNLESS")) {
						cond = !cond;
					}
					if (cond) {
						last = else2 ? else2 : node.jumpTo;
						for (j = n + 1; j < last;) {
							j = this.ProcessNode(j);
						}
					} else if (else2) {
						for (j = else2; j < node.jumpTo;) {
							j = this.ProcessNode(j);
						}
					}
					return node.jumpTo;
				case "ContextIF":
				case "ContextUNLESS":
					if (this.options.loop_context_vars) {
						else2 = node.else2;
						cond = 0;
						switch (node.name) {
							case "__first__":
								if (this.curPass[_count(this.curPass)] == 1) {
									cond = 1;
								}
								break;
							case "__odd__":
								if (this.curPass[_count(this.curPass)] % 2) {
									cond = 1;
								}
								break;
							case "__inner__":
								if (this.curPass[_count(this.curPass)] > 1 && this.curPass[_count(this.curPass)] < this.totalPass[_count(this.totalPass)]) {
									cond = 1;
								}
								break;
							case "__last__":
								if (this.curPass[_count(this.curPass)] == this.totalPass[_count(this.totalPass)]) {
									cond = 1;
								}
								break;
						}
						if (!strcmp(node.type, "ContextUNLESS")) {
							cond = !cond;
						}
						if (cond) {
							last = else2 ? else2 : node.jumpTo;
							for (j = n + 1; j < last;) {
								j = this.ProcessNode(j);
							}
						} else if (else2) {
							for (j = else2; j < node.jumpTo;) {
								j = this.ProcessNode(j);
							}
						}
						return node.jumpTo;
					}
			}
		}
	}, {
		key: "EchoOutput",
		value: function() {
			this.Output();
			return this.output;
		}
	}, {
		key: "ResetParams",
		value: function() {
			this.param = {};
			this.paramScope.push(this.param);
		}
	}, {
		key: "ResetOutput",
		value: function() {
			this.output = "";
		}
	}, {
		key: "SaveCompiled",
		value: function(outputdir, overwrite) {
			if (outputdir === null) {
				outputdir = dirname(this.options.filename);
			}
			var output;
			if (!is_writable(outputdir)) {
				throw new TypeError("Template.SaveCompiled() - Output directory not writable");
			} else {
				output = outputdir + "/" + basename(this.options.filename) + "c";
				if (file_exists(output) && !overwrite) {
					throw new TypeError("Template.SaveCompiled() - File " + output + " already exists, cannot write compiled template");
				} else {
					file_put_contents(output, serialize(this))
					return realpath(output);
				}
			}
			return null;
		}
	}]);
	return Template;
}();

var Node = _createClass(function(type, name, escape2, global, default2) {
	_classCallCheck(this, Node);
	this.type = type;
	this.name = name;
	this.escape2 = escape2;
	this.global = global;
	this.default2 = default2;
	this.jumpTo = "";
	this.else2 = "";
});

var LoadCompiledTemplate = function(filename) {
	if (!is_readable(filename)) {
		throw new TypeError("LoadCompiledTemplate() - Cannot read file " + filename);
	} else {
		return unserialize(file_get_contents(filename));
	}
}
