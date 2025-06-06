(() => {
  var __defProp = Object.defineProperty;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

  // node_modules/js-yaml/dist/js-yaml.mjs
  function isNothing(subject) {
    return typeof subject === "undefined" || subject === null;
  }
  __name(isNothing, "isNothing");
  function isObject(subject) {
    return typeof subject === "object" && subject !== null;
  }
  __name(isObject, "isObject");
  function toArray(sequence) {
    if (Array.isArray(sequence)) return sequence;
    else if (isNothing(sequence)) return [];
    return [sequence];
  }
  __name(toArray, "toArray");
  function extend(target, source) {
    var index, length, key, sourceKeys;
    if (source) {
      sourceKeys = Object.keys(source);
      for (index = 0, length = sourceKeys.length; index < length; index += 1) {
        key = sourceKeys[index];
        target[key] = source[key];
      }
    }
    return target;
  }
  __name(extend, "extend");
  function repeat(string, count) {
    var result = "", cycle;
    for (cycle = 0; cycle < count; cycle += 1) {
      result += string;
    }
    return result;
  }
  __name(repeat, "repeat");
  function isNegativeZero(number) {
    return number === 0 && Number.NEGATIVE_INFINITY === 1 / number;
  }
  __name(isNegativeZero, "isNegativeZero");
  var isNothing_1 = isNothing;
  var isObject_1 = isObject;
  var toArray_1 = toArray;
  var repeat_1 = repeat;
  var isNegativeZero_1 = isNegativeZero;
  var extend_1 = extend;
  var common = {
    isNothing: isNothing_1,
    isObject: isObject_1,
    toArray: toArray_1,
    repeat: repeat_1,
    isNegativeZero: isNegativeZero_1,
    extend: extend_1
  };
  function formatError(exception2, compact) {
    var where = "", message = exception2.reason || "(unknown reason)";
    if (!exception2.mark) return message;
    if (exception2.mark.name) {
      where += 'in "' + exception2.mark.name + '" ';
    }
    where += "(" + (exception2.mark.line + 1) + ":" + (exception2.mark.column + 1) + ")";
    if (!compact && exception2.mark.snippet) {
      where += "\n\n" + exception2.mark.snippet;
    }
    return message + " " + where;
  }
  __name(formatError, "formatError");
  function YAMLException$1(reason, mark) {
    Error.call(this);
    this.name = "YAMLException";
    this.reason = reason;
    this.mark = mark;
    this.message = formatError(this, false);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error().stack || "";
    }
  }
  __name(YAMLException$1, "YAMLException$1");
  YAMLException$1.prototype = Object.create(Error.prototype);
  YAMLException$1.prototype.constructor = YAMLException$1;
  YAMLException$1.prototype.toString = /* @__PURE__ */ __name(function toString(compact) {
    return this.name + ": " + formatError(this, compact);
  }, "toString");
  var exception = YAMLException$1;
  function getLine(buffer, lineStart, lineEnd, position, maxLineLength) {
    var head = "";
    var tail = "";
    var maxHalfLength = Math.floor(maxLineLength / 2) - 1;
    if (position - lineStart > maxHalfLength) {
      head = " ... ";
      lineStart = position - maxHalfLength + head.length;
    }
    if (lineEnd - position > maxHalfLength) {
      tail = " ...";
      lineEnd = position + maxHalfLength - tail.length;
    }
    return {
      str: head + buffer.slice(lineStart, lineEnd).replace(/\t/g, "\u2192") + tail,
      pos: position - lineStart + head.length
      // relative position
    };
  }
  __name(getLine, "getLine");
  function padStart(string, max) {
    return common.repeat(" ", max - string.length) + string;
  }
  __name(padStart, "padStart");
  function makeSnippet(mark, options) {
    options = Object.create(options || null);
    if (!mark.buffer) return null;
    if (!options.maxLength) options.maxLength = 79;
    if (typeof options.indent !== "number") options.indent = 1;
    if (typeof options.linesBefore !== "number") options.linesBefore = 3;
    if (typeof options.linesAfter !== "number") options.linesAfter = 2;
    var re = /\r?\n|\r|\0/g;
    var lineStarts = [0];
    var lineEnds = [];
    var match;
    var foundLineNo = -1;
    while (match = re.exec(mark.buffer)) {
      lineEnds.push(match.index);
      lineStarts.push(match.index + match[0].length);
      if (mark.position <= match.index && foundLineNo < 0) {
        foundLineNo = lineStarts.length - 2;
      }
    }
    if (foundLineNo < 0) foundLineNo = lineStarts.length - 1;
    var result = "", i, line;
    var lineNoLength = Math.min(mark.line + options.linesAfter, lineEnds.length).toString().length;
    var maxLineLength = options.maxLength - (options.indent + lineNoLength + 3);
    for (i = 1; i <= options.linesBefore; i++) {
      if (foundLineNo - i < 0) break;
      line = getLine(
          mark.buffer,
          lineStarts[foundLineNo - i],
          lineEnds[foundLineNo - i],
          mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo - i]),
          maxLineLength
      );
      result = common.repeat(" ", options.indent) + padStart((mark.line - i + 1).toString(), lineNoLength) + " | " + line.str + "\n" + result;
    }
    line = getLine(mark.buffer, lineStarts[foundLineNo], lineEnds[foundLineNo], mark.position, maxLineLength);
    result += common.repeat(" ", options.indent) + padStart((mark.line + 1).toString(), lineNoLength) + " | " + line.str + "\n";
    result += common.repeat("-", options.indent + lineNoLength + 3 + line.pos) + "^\n";
    for (i = 1; i <= options.linesAfter; i++) {
      if (foundLineNo + i >= lineEnds.length) break;
      line = getLine(
          mark.buffer,
          lineStarts[foundLineNo + i],
          lineEnds[foundLineNo + i],
          mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo + i]),
          maxLineLength
      );
      result += common.repeat(" ", options.indent) + padStart((mark.line + i + 1).toString(), lineNoLength) + " | " + line.str + "\n";
    }
    return result.replace(/\n$/, "");
  }
  __name(makeSnippet, "makeSnippet");
  var snippet = makeSnippet;
  var TYPE_CONSTRUCTOR_OPTIONS = [
    "kind",
    "multi",
    "resolve",
    "construct",
    "instanceOf",
    "predicate",
    "represent",
    "representName",
    "defaultStyle",
    "styleAliases"
  ];
  var YAML_NODE_KINDS = [
    "scalar",
    "sequence",
    "mapping"
  ];
  function compileStyleAliases(map2) {
    var result = {};
    if (map2 !== null) {
      Object.keys(map2).forEach(function(style) {
        map2[style].forEach(function(alias) {
          result[String(alias)] = style;
        });
      });
    }
    return result;
  }
  __name(compileStyleAliases, "compileStyleAliases");
  function Type$1(tag, options) {
    options = options || {};
    Object.keys(options).forEach(function(name) {
      if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
        throw new exception('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
      }
    });
    this.options = options;
    this.tag = tag;
    this.kind = options["kind"] || null;
    this.resolve = options["resolve"] || function() {
      return true;
    };
    this.construct = options["construct"] || function(data) {
      return data;
    };
    this.instanceOf = options["instanceOf"] || null;
    this.predicate = options["predicate"] || null;
    this.represent = options["represent"] || null;
    this.representName = options["representName"] || null;
    this.defaultStyle = options["defaultStyle"] || null;
    this.multi = options["multi"] || false;
    this.styleAliases = compileStyleAliases(options["styleAliases"] || null);
    if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
      throw new exception('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
    }
  }
  __name(Type$1, "Type$1");
  var type = Type$1;
  function compileList(schema2, name) {
    var result = [];
    schema2[name].forEach(function(currentType) {
      var newIndex = result.length;
      result.forEach(function(previousType, previousIndex) {
        if (previousType.tag === currentType.tag && previousType.kind === currentType.kind && previousType.multi === currentType.multi) {
          newIndex = previousIndex;
        }
      });
      result[newIndex] = currentType;
    });
    return result;
  }
  __name(compileList, "compileList");
  function compileMap() {
    var result = {
      scalar: {},
      sequence: {},
      mapping: {},
      fallback: {},
      multi: {
        scalar: [],
        sequence: [],
        mapping: [],
        fallback: []
      }
    }, index, length;
    function collectType(type2) {
      if (type2.multi) {
        result.multi[type2.kind].push(type2);
        result.multi["fallback"].push(type2);
      } else {
        result[type2.kind][type2.tag] = result["fallback"][type2.tag] = type2;
      }
    }
    __name(collectType, "collectType");
    for (index = 0, length = arguments.length; index < length; index += 1) {
      arguments[index].forEach(collectType);
    }
    return result;
  }
  __name(compileMap, "compileMap");
  function Schema$1(definition) {
    return this.extend(definition);
  }
  __name(Schema$1, "Schema$1");
  Schema$1.prototype.extend = /* @__PURE__ */ __name(function extend2(definition) {
    var implicit = [];
    var explicit = [];
    if (definition instanceof type) {
      explicit.push(definition);
    } else if (Array.isArray(definition)) {
      explicit = explicit.concat(definition);
    } else if (definition && (Array.isArray(definition.implicit) || Array.isArray(definition.explicit))) {
      if (definition.implicit) implicit = implicit.concat(definition.implicit);
      if (definition.explicit) explicit = explicit.concat(definition.explicit);
    } else {
      throw new exception("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
    }
    implicit.forEach(function(type$1) {
      if (!(type$1 instanceof type)) {
        throw new exception("Specified list of YAML types (or a single Type object) contains a non-Type object.");
      }
      if (type$1.loadKind && type$1.loadKind !== "scalar") {
        throw new exception("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
      }
      if (type$1.multi) {
        throw new exception("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
      }
    });
    explicit.forEach(function(type$1) {
      if (!(type$1 instanceof type)) {
        throw new exception("Specified list of YAML types (or a single Type object) contains a non-Type object.");
      }
    });
    var result = Object.create(Schema$1.prototype);
    result.implicit = (this.implicit || []).concat(implicit);
    result.explicit = (this.explicit || []).concat(explicit);
    result.compiledImplicit = compileList(result, "implicit");
    result.compiledExplicit = compileList(result, "explicit");
    result.compiledTypeMap = compileMap(result.compiledImplicit, result.compiledExplicit);
    return result;
  }, "extend");
  var schema = Schema$1;
  var str = new type("tag:yaml.org,2002:str", {
    kind: "scalar",
    construct: /* @__PURE__ */ __name(function(data) {
      return data !== null ? data : "";
    }, "construct")
  });
  var seq = new type("tag:yaml.org,2002:seq", {
    kind: "sequence",
    construct: /* @__PURE__ */ __name(function(data) {
      return data !== null ? data : [];
    }, "construct")
  });
  var map = new type("tag:yaml.org,2002:map", {
    kind: "mapping",
    construct: /* @__PURE__ */ __name(function(data) {
      return data !== null ? data : {};
    }, "construct")
  });
  var failsafe = new schema({
    explicit: [
      str,
      seq,
      map
    ]
  });
  function resolveYamlNull(data) {
    if (data === null) return true;
    var max = data.length;
    return max === 1 && data === "~" || max === 4 && (data === "null" || data === "Null" || data === "NULL");
  }
  __name(resolveYamlNull, "resolveYamlNull");
  function constructYamlNull() {
    return null;
  }
  __name(constructYamlNull, "constructYamlNull");
  function isNull(object) {
    return object === null;
  }
  __name(isNull, "isNull");
  var _null = new type("tag:yaml.org,2002:null", {
    kind: "scalar",
    resolve: resolveYamlNull,
    construct: constructYamlNull,
    predicate: isNull,
    represent: {
      canonical: /* @__PURE__ */ __name(function() {
        return "~";
      }, "canonical"),
      lowercase: /* @__PURE__ */ __name(function() {
        return "null";
      }, "lowercase"),
      uppercase: /* @__PURE__ */ __name(function() {
        return "NULL";
      }, "uppercase"),
      camelcase: /* @__PURE__ */ __name(function() {
        return "Null";
      }, "camelcase"),
      empty: /* @__PURE__ */ __name(function() {
        return "";
      }, "empty")
    },
    defaultStyle: "lowercase"
  });
  function resolveYamlBoolean(data) {
    if (data === null) return false;
    var max = data.length;
    return max === 4 && (data === "true" || data === "True" || data === "TRUE") || max === 5 && (data === "false" || data === "False" || data === "FALSE");
  }
  __name(resolveYamlBoolean, "resolveYamlBoolean");
  function constructYamlBoolean(data) {
    return data === "true" || data === "True" || data === "TRUE";
  }
  __name(constructYamlBoolean, "constructYamlBoolean");
  function isBoolean(object) {
    return Object.prototype.toString.call(object) === "[object Boolean]";
  }
  __name(isBoolean, "isBoolean");
  var bool = new type("tag:yaml.org,2002:bool", {
    kind: "scalar",
    resolve: resolveYamlBoolean,
    construct: constructYamlBoolean,
    predicate: isBoolean,
    represent: {
      lowercase: /* @__PURE__ */ __name(function(object) {
        return object ? "true" : "false";
      }, "lowercase"),
      uppercase: /* @__PURE__ */ __name(function(object) {
        return object ? "TRUE" : "FALSE";
      }, "uppercase"),
      camelcase: /* @__PURE__ */ __name(function(object) {
        return object ? "True" : "False";
      }, "camelcase")
    },
    defaultStyle: "lowercase"
  });
  function isHexCode(c) {
    return 48 <= c && c <= 57 || 65 <= c && c <= 70 || 97 <= c && c <= 102;
  }
  __name(isHexCode, "isHexCode");
  function isOctCode(c) {
    return 48 <= c && c <= 55;
  }
  __name(isOctCode, "isOctCode");
  function isDecCode(c) {
    return 48 <= c && c <= 57;
  }
  __name(isDecCode, "isDecCode");
  function resolveYamlInteger(data) {
    if (data === null) return false;
    var max = data.length, index = 0, hasDigits = false, ch;
    if (!max) return false;
    ch = data[index];
    if (ch === "-" || ch === "+") {
      ch = data[++index];
    }
    if (ch === "0") {
      if (index + 1 === max) return true;
      ch = data[++index];
      if (ch === "b") {
        index++;
        for (; index < max; index++) {
          ch = data[index];
          if (ch === "_") continue;
          if (ch !== "0" && ch !== "1") return false;
          hasDigits = true;
        }
        return hasDigits && ch !== "_";
      }
      if (ch === "x") {
        index++;
        for (; index < max; index++) {
          ch = data[index];
          if (ch === "_") continue;
          if (!isHexCode(data.charCodeAt(index))) return false;
          hasDigits = true;
        }
        return hasDigits && ch !== "_";
      }
      if (ch === "o") {
        index++;
        for (; index < max; index++) {
          ch = data[index];
          if (ch === "_") continue;
          if (!isOctCode(data.charCodeAt(index))) return false;
          hasDigits = true;
        }
        return hasDigits && ch !== "_";
      }
    }
    if (ch === "_") return false;
    for (; index < max; index++) {
      ch = data[index];
      if (ch === "_") continue;
      if (!isDecCode(data.charCodeAt(index))) {
        return false;
      }
      hasDigits = true;
    }
    if (!hasDigits || ch === "_") return false;
    return true;
  }
  __name(resolveYamlInteger, "resolveYamlInteger");
  function constructYamlInteger(data) {
    var value = data, sign = 1, ch;
    if (value.indexOf("_") !== -1) {
      value = value.replace(/_/g, "");
    }
    ch = value[0];
    if (ch === "-" || ch === "+") {
      if (ch === "-") sign = -1;
      value = value.slice(1);
      ch = value[0];
    }
    if (value === "0") return 0;
    if (ch === "0") {
      if (value[1] === "b") return sign * parseInt(value.slice(2), 2);
      if (value[1] === "x") return sign * parseInt(value.slice(2), 16);
      if (value[1] === "o") return sign * parseInt(value.slice(2), 8);
    }
    return sign * parseInt(value, 10);
  }
  __name(constructYamlInteger, "constructYamlInteger");
  function isInteger(object) {
    return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 === 0 && !common.isNegativeZero(object));
  }
  __name(isInteger, "isInteger");
  var int = new type("tag:yaml.org,2002:int", {
    kind: "scalar",
    resolve: resolveYamlInteger,
    construct: constructYamlInteger,
    predicate: isInteger,
    represent: {
      binary: /* @__PURE__ */ __name(function(obj) {
        return obj >= 0 ? "0b" + obj.toString(2) : "-0b" + obj.toString(2).slice(1);
      }, "binary"),
      octal: /* @__PURE__ */ __name(function(obj) {
        return obj >= 0 ? "0o" + obj.toString(8) : "-0o" + obj.toString(8).slice(1);
      }, "octal"),
      decimal: /* @__PURE__ */ __name(function(obj) {
        return obj.toString(10);
      }, "decimal"),
      /* eslint-disable max-len */
      hexadecimal: /* @__PURE__ */ __name(function(obj) {
        return obj >= 0 ? "0x" + obj.toString(16).toUpperCase() : "-0x" + obj.toString(16).toUpperCase().slice(1);
      }, "hexadecimal")
    },
    defaultStyle: "decimal",
    styleAliases: {
      binary: [2, "bin"],
      octal: [8, "oct"],
      decimal: [10, "dec"],
      hexadecimal: [16, "hex"]
    }
  });
  var YAML_FLOAT_PATTERN = new RegExp(
      // 2.5e4, 2.5 and integers
      "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
  );
  function resolveYamlFloat(data) {
    if (data === null) return false;
    if (!YAML_FLOAT_PATTERN.test(data) || // Quick hack to not allow integers end with `_`
        // Probably should update regexp & check speed
        data[data.length - 1] === "_") {
      return false;
    }
    return true;
  }
  __name(resolveYamlFloat, "resolveYamlFloat");
  function constructYamlFloat(data) {
    var value, sign;
    value = data.replace(/_/g, "").toLowerCase();
    sign = value[0] === "-" ? -1 : 1;
    if ("+-".indexOf(value[0]) >= 0) {
      value = value.slice(1);
    }
    if (value === ".inf") {
      return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
    } else if (value === ".nan") {
      return NaN;
    }
    return sign * parseFloat(value, 10);
  }
  __name(constructYamlFloat, "constructYamlFloat");
  var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;
  function representYamlFloat(object, style) {
    var res;
    if (isNaN(object)) {
      switch (style) {
        case "lowercase":
          return ".nan";
        case "uppercase":
          return ".NAN";
        case "camelcase":
          return ".NaN";
      }
    } else if (Number.POSITIVE_INFINITY === object) {
      switch (style) {
        case "lowercase":
          return ".inf";
        case "uppercase":
          return ".INF";
        case "camelcase":
          return ".Inf";
      }
    } else if (Number.NEGATIVE_INFINITY === object) {
      switch (style) {
        case "lowercase":
          return "-.inf";
        case "uppercase":
          return "-.INF";
        case "camelcase":
          return "-.Inf";
      }
    } else if (common.isNegativeZero(object)) {
      return "-0.0";
    }
    res = object.toString(10);
    return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace("e", ".e") : res;
  }
  __name(representYamlFloat, "representYamlFloat");
  function isFloat(object) {
    return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 !== 0 || common.isNegativeZero(object));
  }
  __name(isFloat, "isFloat");
  var float = new type("tag:yaml.org,2002:float", {
    kind: "scalar",
    resolve: resolveYamlFloat,
    construct: constructYamlFloat,
    predicate: isFloat,
    represent: representYamlFloat,
    defaultStyle: "lowercase"
  });
  var json = failsafe.extend({
    implicit: [
      _null,
      bool,
      int,
      float
    ]
  });
  var core = json;
  var YAML_DATE_REGEXP = new RegExp(
      "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
  );
  var YAML_TIMESTAMP_REGEXP = new RegExp(
      "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
  );
  function resolveYamlTimestamp(data) {
    if (data === null) return false;
    if (YAML_DATE_REGEXP.exec(data) !== null) return true;
    if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) return true;
    return false;
  }
  __name(resolveYamlTimestamp, "resolveYamlTimestamp");
  function constructYamlTimestamp(data) {
    var match, year, month, day, hour, minute, second, fraction = 0, delta = null, tz_hour, tz_minute, date;
    match = YAML_DATE_REGEXP.exec(data);
    if (match === null) match = YAML_TIMESTAMP_REGEXP.exec(data);
    if (match === null) throw new Error("Date resolve error");
    year = +match[1];
    month = +match[2] - 1;
    day = +match[3];
    if (!match[4]) {
      return new Date(Date.UTC(year, month, day));
    }
    hour = +match[4];
    minute = +match[5];
    second = +match[6];
    if (match[7]) {
      fraction = match[7].slice(0, 3);
      while (fraction.length < 3) {
        fraction += "0";
      }
      fraction = +fraction;
    }
    if (match[9]) {
      tz_hour = +match[10];
      tz_minute = +(match[11] || 0);
      delta = (tz_hour * 60 + tz_minute) * 6e4;
      if (match[9] === "-") delta = -delta;
    }
    date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));
    if (delta) date.setTime(date.getTime() - delta);
    return date;
  }
  __name(constructYamlTimestamp, "constructYamlTimestamp");
  function representYamlTimestamp(object) {
    return object.toISOString();
  }
  __name(representYamlTimestamp, "representYamlTimestamp");
  var timestamp = new type("tag:yaml.org,2002:timestamp", {
    kind: "scalar",
    resolve: resolveYamlTimestamp,
    construct: constructYamlTimestamp,
    instanceOf: Date,
    represent: representYamlTimestamp
  });
  function resolveYamlMerge(data) {
    return data === "<<" || data === null;
  }
  __name(resolveYamlMerge, "resolveYamlMerge");
  var merge = new type("tag:yaml.org,2002:merge", {
    kind: "scalar",
    resolve: resolveYamlMerge
  });
  var BASE64_MAP = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
  function resolveYamlBinary(data) {
    if (data === null) return false;
    var code, idx, bitlen = 0, max = data.length, map2 = BASE64_MAP;
    for (idx = 0; idx < max; idx++) {
      code = map2.indexOf(data.charAt(idx));
      if (code > 64) continue;
      if (code < 0) return false;
      bitlen += 6;
    }
    return bitlen % 8 === 0;
  }
  __name(resolveYamlBinary, "resolveYamlBinary");
  function constructYamlBinary(data) {
    var idx, tailbits, input = data.replace(/[\r\n=]/g, ""), max = input.length, map2 = BASE64_MAP, bits = 0, result = [];
    for (idx = 0; idx < max; idx++) {
      if (idx % 4 === 0 && idx) {
        result.push(bits >> 16 & 255);
        result.push(bits >> 8 & 255);
        result.push(bits & 255);
      }
      bits = bits << 6 | map2.indexOf(input.charAt(idx));
    }
    tailbits = max % 4 * 6;
    if (tailbits === 0) {
      result.push(bits >> 16 & 255);
      result.push(bits >> 8 & 255);
      result.push(bits & 255);
    } else if (tailbits === 18) {
      result.push(bits >> 10 & 255);
      result.push(bits >> 2 & 255);
    } else if (tailbits === 12) {
      result.push(bits >> 4 & 255);
    }
    return new Uint8Array(result);
  }
  __name(constructYamlBinary, "constructYamlBinary");
  function representYamlBinary(object) {
    var result = "", bits = 0, idx, tail, max = object.length, map2 = BASE64_MAP;
    for (idx = 0; idx < max; idx++) {
      if (idx % 3 === 0 && idx) {
        result += map2[bits >> 18 & 63];
        result += map2[bits >> 12 & 63];
        result += map2[bits >> 6 & 63];
        result += map2[bits & 63];
      }
      bits = (bits << 8) + object[idx];
    }
    tail = max % 3;
    if (tail === 0) {
      result += map2[bits >> 18 & 63];
      result += map2[bits >> 12 & 63];
      result += map2[bits >> 6 & 63];
      result += map2[bits & 63];
    } else if (tail === 2) {
      result += map2[bits >> 10 & 63];
      result += map2[bits >> 4 & 63];
      result += map2[bits << 2 & 63];
      result += map2[64];
    } else if (tail === 1) {
      result += map2[bits >> 2 & 63];
      result += map2[bits << 4 & 63];
      result += map2[64];
      result += map2[64];
    }
    return result;
  }
  __name(representYamlBinary, "representYamlBinary");
  function isBinary(obj) {
    return Object.prototype.toString.call(obj) === "[object Uint8Array]";
  }
  __name(isBinary, "isBinary");
  var binary = new type("tag:yaml.org,2002:binary", {
    kind: "scalar",
    resolve: resolveYamlBinary,
    construct: constructYamlBinary,
    predicate: isBinary,
    represent: representYamlBinary
  });
  var _hasOwnProperty$3 = Object.prototype.hasOwnProperty;
  var _toString$2 = Object.prototype.toString;
  function resolveYamlOmap(data) {
    if (data === null) return true;
    var objectKeys = [], index, length, pair, pairKey, pairHasKey, object = data;
    for (index = 0, length = object.length; index < length; index += 1) {
      pair = object[index];
      pairHasKey = false;
      if (_toString$2.call(pair) !== "[object Object]") return false;
      for (pairKey in pair) {
        if (_hasOwnProperty$3.call(pair, pairKey)) {
          if (!pairHasKey) pairHasKey = true;
          else return false;
        }
      }
      if (!pairHasKey) return false;
      if (objectKeys.indexOf(pairKey) === -1) objectKeys.push(pairKey);
      else return false;
    }
    return true;
  }
  __name(resolveYamlOmap, "resolveYamlOmap");
  function constructYamlOmap(data) {
    return data !== null ? data : [];
  }
  __name(constructYamlOmap, "constructYamlOmap");
  var omap = new type("tag:yaml.org,2002:omap", {
    kind: "sequence",
    resolve: resolveYamlOmap,
    construct: constructYamlOmap
  });
  var _toString$1 = Object.prototype.toString;
  function resolveYamlPairs(data) {
    if (data === null) return true;
    var index, length, pair, keys, result, object = data;
    result = new Array(object.length);
    for (index = 0, length = object.length; index < length; index += 1) {
      pair = object[index];
      if (_toString$1.call(pair) !== "[object Object]") return false;
      keys = Object.keys(pair);
      if (keys.length !== 1) return false;
      result[index] = [keys[0], pair[keys[0]]];
    }
    return true;
  }
  __name(resolveYamlPairs, "resolveYamlPairs");
  function constructYamlPairs(data) {
    if (data === null) return [];
    var index, length, pair, keys, result, object = data;
    result = new Array(object.length);
    for (index = 0, length = object.length; index < length; index += 1) {
      pair = object[index];
      keys = Object.keys(pair);
      result[index] = [keys[0], pair[keys[0]]];
    }
    return result;
  }
  __name(constructYamlPairs, "constructYamlPairs");
  var pairs = new type("tag:yaml.org,2002:pairs", {
    kind: "sequence",
    resolve: resolveYamlPairs,
    construct: constructYamlPairs
  });
  var _hasOwnProperty$2 = Object.prototype.hasOwnProperty;
  function resolveYamlSet(data) {
    if (data === null) return true;
    var key, object = data;
    for (key in object) {
      if (_hasOwnProperty$2.call(object, key)) {
        if (object[key] !== null) return false;
      }
    }
    return true;
  }
  __name(resolveYamlSet, "resolveYamlSet");
  function constructYamlSet(data) {
    return data !== null ? data : {};
  }
  __name(constructYamlSet, "constructYamlSet");
  var set = new type("tag:yaml.org,2002:set", {
    kind: "mapping",
    resolve: resolveYamlSet,
    construct: constructYamlSet
  });
  var _default = core.extend({
    implicit: [
      timestamp,
      merge
    ],
    explicit: [
      binary,
      omap,
      pairs,
      set
    ]
  });
  var _hasOwnProperty$1 = Object.prototype.hasOwnProperty;
  var CONTEXT_FLOW_IN = 1;
  var CONTEXT_FLOW_OUT = 2;
  var CONTEXT_BLOCK_IN = 3;
  var CONTEXT_BLOCK_OUT = 4;
  var CHOMPING_CLIP = 1;
  var CHOMPING_STRIP = 2;
  var CHOMPING_KEEP = 3;
  var PATTERN_NON_PRINTABLE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
  var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
  var PATTERN_FLOW_INDICATORS = /[,\[\]\{\}]/;
  var PATTERN_TAG_HANDLE = /^(?:!|!!|![a-z\-]+!)$/i;
  var PATTERN_TAG_URI = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
  function _class(obj) {
    return Object.prototype.toString.call(obj);
  }
  __name(_class, "_class");
  function is_EOL(c) {
    return c === 10 || c === 13;
  }
  __name(is_EOL, "is_EOL");
  function is_WHITE_SPACE(c) {
    return c === 9 || c === 32;
  }
  __name(is_WHITE_SPACE, "is_WHITE_SPACE");
  function is_WS_OR_EOL(c) {
    return c === 9 || c === 32 || c === 10 || c === 13;
  }
  __name(is_WS_OR_EOL, "is_WS_OR_EOL");
  function is_FLOW_INDICATOR(c) {
    return c === 44 || c === 91 || c === 93 || c === 123 || c === 125;
  }
  __name(is_FLOW_INDICATOR, "is_FLOW_INDICATOR");
  function fromHexCode(c) {
    var lc;
    if (48 <= c && c <= 57) {
      return c - 48;
    }
    lc = c | 32;
    if (97 <= lc && lc <= 102) {
      return lc - 97 + 10;
    }
    return -1;
  }
  __name(fromHexCode, "fromHexCode");
  function escapedHexLen(c) {
    if (c === 120) {
      return 2;
    }
    if (c === 117) {
      return 4;
    }
    if (c === 85) {
      return 8;
    }
    return 0;
  }
  __name(escapedHexLen, "escapedHexLen");
  function fromDecimalCode(c) {
    if (48 <= c && c <= 57) {
      return c - 48;
    }
    return -1;
  }
  __name(fromDecimalCode, "fromDecimalCode");
  function simpleEscapeSequence(c) {
    return c === 48 ? "\0" : c === 97 ? "\x07" : c === 98 ? "\b" : c === 116 ? "	" : c === 9 ? "	" : c === 110 ? "\n" : c === 118 ? "\v" : c === 102 ? "\f" : c === 114 ? "\r" : c === 101 ? "\x1B" : c === 32 ? " " : c === 34 ? '"' : c === 47 ? "/" : c === 92 ? "\\" : c === 78 ? "\x85" : c === 95 ? "\xA0" : c === 76 ? "\u2028" : c === 80 ? "\u2029" : "";
  }
  __name(simpleEscapeSequence, "simpleEscapeSequence");
  function charFromCodepoint(c) {
    if (c <= 65535) {
      return String.fromCharCode(c);
    }
    return String.fromCharCode(
        (c - 65536 >> 10) + 55296,
        (c - 65536 & 1023) + 56320
    );
  }
  __name(charFromCodepoint, "charFromCodepoint");
  var simpleEscapeCheck = new Array(256);
  var simpleEscapeMap = new Array(256);
  for (i = 0; i < 256; i++) {
    simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
    simpleEscapeMap[i] = simpleEscapeSequence(i);
  }
  var i;
  function State$1(input, options) {
    this.input = input;
    this.filename = options["filename"] || null;
    this.schema = options["schema"] || _default;
    this.onWarning = options["onWarning"] || null;
    this.legacy = options["legacy"] || false;
    this.json = options["json"] || false;
    this.listener = options["listener"] || null;
    this.implicitTypes = this.schema.compiledImplicit;
    this.typeMap = this.schema.compiledTypeMap;
    this.length = input.length;
    this.position = 0;
    this.line = 0;
    this.lineStart = 0;
    this.lineIndent = 0;
    this.firstTabInLine = -1;
    this.documents = [];
  }
  __name(State$1, "State$1");
  function generateError(state, message) {
    var mark = {
      name: state.filename,
      buffer: state.input.slice(0, -1),
      // omit trailing \0
      position: state.position,
      line: state.line,
      column: state.position - state.lineStart
    };
    mark.snippet = snippet(mark);
    return new exception(message, mark);
  }
  __name(generateError, "generateError");
  function throwError(state, message) {
    throw generateError(state, message);
  }
  __name(throwError, "throwError");
  function throwWarning(state, message) {
    if (state.onWarning) {
      state.onWarning.call(null, generateError(state, message));
    }
  }
  __name(throwWarning, "throwWarning");
  var directiveHandlers = {
    YAML: /* @__PURE__ */ __name(function handleYamlDirective(state, name, args) {
      var match, major, minor;
      if (state.version !== null) {
        throwError(state, "duplication of %YAML directive");
      }
      if (args.length !== 1) {
        throwError(state, "YAML directive accepts exactly one argument");
      }
      match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);
      if (match === null) {
        throwError(state, "ill-formed argument of the YAML directive");
      }
      major = parseInt(match[1], 10);
      minor = parseInt(match[2], 10);
      if (major !== 1) {
        throwError(state, "unacceptable YAML version of the document");
      }
      state.version = args[0];
      state.checkLineBreaks = minor < 2;
      if (minor !== 1 && minor !== 2) {
        throwWarning(state, "unsupported YAML version of the document");
      }
    }, "handleYamlDirective"),
    TAG: /* @__PURE__ */ __name(function handleTagDirective(state, name, args) {
      var handle, prefix;
      if (args.length !== 2) {
        throwError(state, "TAG directive accepts exactly two arguments");
      }
      handle = args[0];
      prefix = args[1];
      if (!PATTERN_TAG_HANDLE.test(handle)) {
        throwError(state, "ill-formed tag handle (first argument) of the TAG directive");
      }
      if (_hasOwnProperty$1.call(state.tagMap, handle)) {
        throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
      }
      if (!PATTERN_TAG_URI.test(prefix)) {
        throwError(state, "ill-formed tag prefix (second argument) of the TAG directive");
      }
      try {
        prefix = decodeURIComponent(prefix);
      } catch (err) {
        throwError(state, "tag prefix is malformed: " + prefix);
      }
      state.tagMap[handle] = prefix;
    }, "handleTagDirective")
  };
  function captureSegment(state, start, end, checkJson) {
    var _position, _length, _character, _result;
    if (start < end) {
      _result = state.input.slice(start, end);
      if (checkJson) {
        for (_position = 0, _length = _result.length; _position < _length; _position += 1) {
          _character = _result.charCodeAt(_position);
          if (!(_character === 9 || 32 <= _character && _character <= 1114111)) {
            throwError(state, "expected valid JSON character");
          }
        }
      } else if (PATTERN_NON_PRINTABLE.test(_result)) {
        throwError(state, "the stream contains non-printable characters");
      }
      state.result += _result;
    }
  }
  __name(captureSegment, "captureSegment");
  function mergeMappings(state, destination, source, overridableKeys) {
    var sourceKeys, key, index, quantity;
    if (!common.isObject(source)) {
      throwError(state, "cannot merge mappings; the provided source object is unacceptable");
    }
    sourceKeys = Object.keys(source);
    for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
      key = sourceKeys[index];
      if (!_hasOwnProperty$1.call(destination, key)) {
        destination[key] = source[key];
        overridableKeys[key] = true;
      }
    }
  }
  __name(mergeMappings, "mergeMappings");
  function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, startLine, startLineStart, startPos) {
    var index, quantity;
    if (Array.isArray(keyNode)) {
      keyNode = Array.prototype.slice.call(keyNode);
      for (index = 0, quantity = keyNode.length; index < quantity; index += 1) {
        if (Array.isArray(keyNode[index])) {
          throwError(state, "nested arrays are not supported inside keys");
        }
        if (typeof keyNode === "object" && _class(keyNode[index]) === "[object Object]") {
          keyNode[index] = "[object Object]";
        }
      }
    }
    if (typeof keyNode === "object" && _class(keyNode) === "[object Object]") {
      keyNode = "[object Object]";
    }
    keyNode = String(keyNode);
    if (_result === null) {
      _result = {};
    }
    if (keyTag === "tag:yaml.org,2002:merge") {
      if (Array.isArray(valueNode)) {
        for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
          mergeMappings(state, _result, valueNode[index], overridableKeys);
        }
      } else {
        mergeMappings(state, _result, valueNode, overridableKeys);
      }
    } else {
      if (!state.json && !_hasOwnProperty$1.call(overridableKeys, keyNode) && _hasOwnProperty$1.call(_result, keyNode)) {
        state.line = startLine || state.line;
        state.lineStart = startLineStart || state.lineStart;
        state.position = startPos || state.position;
        throwError(state, "duplicated mapping key");
      }
      if (keyNode === "__proto__") {
        Object.defineProperty(_result, keyNode, {
          configurable: true,
          enumerable: true,
          writable: true,
          value: valueNode
        });
      } else {
        _result[keyNode] = valueNode;
      }
      delete overridableKeys[keyNode];
    }
    return _result;
  }
  __name(storeMappingPair, "storeMappingPair");
  function readLineBreak(state) {
    var ch;
    ch = state.input.charCodeAt(state.position);
    if (ch === 10) {
      state.position++;
    } else if (ch === 13) {
      state.position++;
      if (state.input.charCodeAt(state.position) === 10) {
        state.position++;
      }
    } else {
      throwError(state, "a line break is expected");
    }
    state.line += 1;
    state.lineStart = state.position;
    state.firstTabInLine = -1;
  }
  __name(readLineBreak, "readLineBreak");
  function skipSeparationSpace(state, allowComments, checkIndent) {
    var lineBreaks = 0, ch = state.input.charCodeAt(state.position);
    while (ch !== 0) {
      while (is_WHITE_SPACE(ch)) {
        if (ch === 9 && state.firstTabInLine === -1) {
          state.firstTabInLine = state.position;
        }
        ch = state.input.charCodeAt(++state.position);
      }
      if (allowComments && ch === 35) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (ch !== 10 && ch !== 13 && ch !== 0);
      }
      if (is_EOL(ch)) {
        readLineBreak(state);
        ch = state.input.charCodeAt(state.position);
        lineBreaks++;
        state.lineIndent = 0;
        while (ch === 32) {
          state.lineIndent++;
          ch = state.input.charCodeAt(++state.position);
        }
      } else {
        break;
      }
    }
    if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
      throwWarning(state, "deficient indentation");
    }
    return lineBreaks;
  }
  __name(skipSeparationSpace, "skipSeparationSpace");
  function testDocumentSeparator(state) {
    var _position = state.position, ch;
    ch = state.input.charCodeAt(_position);
    if ((ch === 45 || ch === 46) && ch === state.input.charCodeAt(_position + 1) && ch === state.input.charCodeAt(_position + 2)) {
      _position += 3;
      ch = state.input.charCodeAt(_position);
      if (ch === 0 || is_WS_OR_EOL(ch)) {
        return true;
      }
    }
    return false;
  }
  __name(testDocumentSeparator, "testDocumentSeparator");
  function writeFoldedLines(state, count) {
    if (count === 1) {
      state.result += " ";
    } else if (count > 1) {
      state.result += common.repeat("\n", count - 1);
    }
  }
  __name(writeFoldedLines, "writeFoldedLines");
  function readPlainScalar(state, nodeIndent, withinFlowCollection) {
    var preceding, following, captureStart, captureEnd, hasPendingContent, _line, _lineStart, _lineIndent, _kind = state.kind, _result = state.result, ch;
    ch = state.input.charCodeAt(state.position);
    if (is_WS_OR_EOL(ch) || is_FLOW_INDICATOR(ch) || ch === 35 || ch === 38 || ch === 42 || ch === 33 || ch === 124 || ch === 62 || ch === 39 || ch === 34 || ch === 37 || ch === 64 || ch === 96) {
      return false;
    }
    if (ch === 63 || ch === 45) {
      following = state.input.charCodeAt(state.position + 1);
      if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
        return false;
      }
    }
    state.kind = "scalar";
    state.result = "";
    captureStart = captureEnd = state.position;
    hasPendingContent = false;
    while (ch !== 0) {
      if (ch === 58) {
        following = state.input.charCodeAt(state.position + 1);
        if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
          break;
        }
      } else if (ch === 35) {
        preceding = state.input.charCodeAt(state.position - 1);
        if (is_WS_OR_EOL(preceding)) {
          break;
        }
      } else if (state.position === state.lineStart && testDocumentSeparator(state) || withinFlowCollection && is_FLOW_INDICATOR(ch)) {
        break;
      } else if (is_EOL(ch)) {
        _line = state.line;
        _lineStart = state.lineStart;
        _lineIndent = state.lineIndent;
        skipSeparationSpace(state, false, -1);
        if (state.lineIndent >= nodeIndent) {
          hasPendingContent = true;
          ch = state.input.charCodeAt(state.position);
          continue;
        } else {
          state.position = captureEnd;
          state.line = _line;
          state.lineStart = _lineStart;
          state.lineIndent = _lineIndent;
          break;
        }
      }
      if (hasPendingContent) {
        captureSegment(state, captureStart, captureEnd, false);
        writeFoldedLines(state, state.line - _line);
        captureStart = captureEnd = state.position;
        hasPendingContent = false;
      }
      if (!is_WHITE_SPACE(ch)) {
        captureEnd = state.position + 1;
      }
      ch = state.input.charCodeAt(++state.position);
    }
    captureSegment(state, captureStart, captureEnd, false);
    if (state.result) {
      return true;
    }
    state.kind = _kind;
    state.result = _result;
    return false;
  }
  __name(readPlainScalar, "readPlainScalar");
  function readSingleQuotedScalar(state, nodeIndent) {
    var ch, captureStart, captureEnd;
    ch = state.input.charCodeAt(state.position);
    if (ch !== 39) {
      return false;
    }
    state.kind = "scalar";
    state.result = "";
    state.position++;
    captureStart = captureEnd = state.position;
    while ((ch = state.input.charCodeAt(state.position)) !== 0) {
      if (ch === 39) {
        captureSegment(state, captureStart, state.position, true);
        ch = state.input.charCodeAt(++state.position);
        if (ch === 39) {
          captureStart = state.position;
          state.position++;
          captureEnd = state.position;
        } else {
          return true;
        }
      } else if (is_EOL(ch)) {
        captureSegment(state, captureStart, captureEnd, true);
        writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
        captureStart = captureEnd = state.position;
      } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
        throwError(state, "unexpected end of the document within a single quoted scalar");
      } else {
        state.position++;
        captureEnd = state.position;
      }
    }
    throwError(state, "unexpected end of the stream within a single quoted scalar");
  }
  __name(readSingleQuotedScalar, "readSingleQuotedScalar");
  function readDoubleQuotedScalar(state, nodeIndent) {
    var captureStart, captureEnd, hexLength, hexResult, tmp, ch;
    ch = state.input.charCodeAt(state.position);
    if (ch !== 34) {
      return false;
    }
    state.kind = "scalar";
    state.result = "";
    state.position++;
    captureStart = captureEnd = state.position;
    while ((ch = state.input.charCodeAt(state.position)) !== 0) {
      if (ch === 34) {
        captureSegment(state, captureStart, state.position, true);
        state.position++;
        return true;
      } else if (ch === 92) {
        captureSegment(state, captureStart, state.position, true);
        ch = state.input.charCodeAt(++state.position);
        if (is_EOL(ch)) {
          skipSeparationSpace(state, false, nodeIndent);
        } else if (ch < 256 && simpleEscapeCheck[ch]) {
          state.result += simpleEscapeMap[ch];
          state.position++;
        } else if ((tmp = escapedHexLen(ch)) > 0) {
          hexLength = tmp;
          hexResult = 0;
          for (; hexLength > 0; hexLength--) {
            ch = state.input.charCodeAt(++state.position);
            if ((tmp = fromHexCode(ch)) >= 0) {
              hexResult = (hexResult << 4) + tmp;
            } else {
              throwError(state, "expected hexadecimal character");
            }
          }
          state.result += charFromCodepoint(hexResult);
          state.position++;
        } else {
          throwError(state, "unknown escape sequence");
        }
        captureStart = captureEnd = state.position;
      } else if (is_EOL(ch)) {
        captureSegment(state, captureStart, captureEnd, true);
        writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
        captureStart = captureEnd = state.position;
      } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
        throwError(state, "unexpected end of the document within a double quoted scalar");
      } else {
        state.position++;
        captureEnd = state.position;
      }
    }
    throwError(state, "unexpected end of the stream within a double quoted scalar");
  }
  __name(readDoubleQuotedScalar, "readDoubleQuotedScalar");
  function readFlowCollection(state, nodeIndent) {
    var readNext = true, _line, _lineStart, _pos, _tag = state.tag, _result, _anchor = state.anchor, following, terminator, isPair, isExplicitPair, isMapping, overridableKeys = /* @__PURE__ */ Object.create(null), keyNode, keyTag, valueNode, ch;
    ch = state.input.charCodeAt(state.position);
    if (ch === 91) {
      terminator = 93;
      isMapping = false;
      _result = [];
    } else if (ch === 123) {
      terminator = 125;
      isMapping = true;
      _result = {};
    } else {
      return false;
    }
    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = _result;
    }
    ch = state.input.charCodeAt(++state.position);
    while (ch !== 0) {
      skipSeparationSpace(state, true, nodeIndent);
      ch = state.input.charCodeAt(state.position);
      if (ch === terminator) {
        state.position++;
        state.tag = _tag;
        state.anchor = _anchor;
        state.kind = isMapping ? "mapping" : "sequence";
        state.result = _result;
        return true;
      } else if (!readNext) {
        throwError(state, "missed comma between flow collection entries");
      } else if (ch === 44) {
        throwError(state, "expected the node content, but found ','");
      }
      keyTag = keyNode = valueNode = null;
      isPair = isExplicitPair = false;
      if (ch === 63) {
        following = state.input.charCodeAt(state.position + 1);
        if (is_WS_OR_EOL(following)) {
          isPair = isExplicitPair = true;
          state.position++;
          skipSeparationSpace(state, true, nodeIndent);
        }
      }
      _line = state.line;
      _lineStart = state.lineStart;
      _pos = state.position;
      composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
      keyTag = state.tag;
      keyNode = state.result;
      skipSeparationSpace(state, true, nodeIndent);
      ch = state.input.charCodeAt(state.position);
      if ((isExplicitPair || state.line === _line) && ch === 58) {
        isPair = true;
        ch = state.input.charCodeAt(++state.position);
        skipSeparationSpace(state, true, nodeIndent);
        composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
        valueNode = state.result;
      }
      if (isMapping) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos);
      } else if (isPair) {
        _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos));
      } else {
        _result.push(keyNode);
      }
      skipSeparationSpace(state, true, nodeIndent);
      ch = state.input.charCodeAt(state.position);
      if (ch === 44) {
        readNext = true;
        ch = state.input.charCodeAt(++state.position);
      } else {
        readNext = false;
      }
    }
    throwError(state, "unexpected end of the stream within a flow collection");
  }
  __name(readFlowCollection, "readFlowCollection");
  function readBlockScalar(state, nodeIndent) {
    var captureStart, folding, chomping = CHOMPING_CLIP, didReadContent = false, detectedIndent = false, textIndent = nodeIndent, emptyLines = 0, atMoreIndented = false, tmp, ch;
    ch = state.input.charCodeAt(state.position);
    if (ch === 124) {
      folding = false;
    } else if (ch === 62) {
      folding = true;
    } else {
      return false;
    }
    state.kind = "scalar";
    state.result = "";
    while (ch !== 0) {
      ch = state.input.charCodeAt(++state.position);
      if (ch === 43 || ch === 45) {
        if (CHOMPING_CLIP === chomping) {
          chomping = ch === 43 ? CHOMPING_KEEP : CHOMPING_STRIP;
        } else {
          throwError(state, "repeat of a chomping mode identifier");
        }
      } else if ((tmp = fromDecimalCode(ch)) >= 0) {
        if (tmp === 0) {
          throwError(state, "bad explicit indentation width of a block scalar; it cannot be less than one");
        } else if (!detectedIndent) {
          textIndent = nodeIndent + tmp - 1;
          detectedIndent = true;
        } else {
          throwError(state, "repeat of an indentation width identifier");
        }
      } else {
        break;
      }
    }
    if (is_WHITE_SPACE(ch)) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (is_WHITE_SPACE(ch));
      if (ch === 35) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (!is_EOL(ch) && ch !== 0);
      }
    }
    while (ch !== 0) {
      readLineBreak(state);
      state.lineIndent = 0;
      ch = state.input.charCodeAt(state.position);
      while ((!detectedIndent || state.lineIndent < textIndent) && ch === 32) {
        state.lineIndent++;
        ch = state.input.charCodeAt(++state.position);
      }
      if (!detectedIndent && state.lineIndent > textIndent) {
        textIndent = state.lineIndent;
      }
      if (is_EOL(ch)) {
        emptyLines++;
        continue;
      }
      if (state.lineIndent < textIndent) {
        if (chomping === CHOMPING_KEEP) {
          state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
        } else if (chomping === CHOMPING_CLIP) {
          if (didReadContent) {
            state.result += "\n";
          }
        }
        break;
      }
      if (folding) {
        if (is_WHITE_SPACE(ch)) {
          atMoreIndented = true;
          state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
        } else if (atMoreIndented) {
          atMoreIndented = false;
          state.result += common.repeat("\n", emptyLines + 1);
        } else if (emptyLines === 0) {
          if (didReadContent) {
            state.result += " ";
          }
        } else {
          state.result += common.repeat("\n", emptyLines);
        }
      } else {
        state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
      }
      didReadContent = true;
      detectedIndent = true;
      emptyLines = 0;
      captureStart = state.position;
      while (!is_EOL(ch) && ch !== 0) {
        ch = state.input.charCodeAt(++state.position);
      }
      captureSegment(state, captureStart, state.position, false);
    }
    return true;
  }
  __name(readBlockScalar, "readBlockScalar");
  function readBlockSequence(state, nodeIndent) {
    var _line, _tag = state.tag, _anchor = state.anchor, _result = [], following, detected = false, ch;
    if (state.firstTabInLine !== -1) return false;
    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = _result;
    }
    ch = state.input.charCodeAt(state.position);
    while (ch !== 0) {
      if (state.firstTabInLine !== -1) {
        state.position = state.firstTabInLine;
        throwError(state, "tab characters must not be used in indentation");
      }
      if (ch !== 45) {
        break;
      }
      following = state.input.charCodeAt(state.position + 1);
      if (!is_WS_OR_EOL(following)) {
        break;
      }
      detected = true;
      state.position++;
      if (skipSeparationSpace(state, true, -1)) {
        if (state.lineIndent <= nodeIndent) {
          _result.push(null);
          ch = state.input.charCodeAt(state.position);
          continue;
        }
      }
      _line = state.line;
      composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
      _result.push(state.result);
      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
      if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
        throwError(state, "bad indentation of a sequence entry");
      } else if (state.lineIndent < nodeIndent) {
        break;
      }
    }
    if (detected) {
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = "sequence";
      state.result = _result;
      return true;
    }
    return false;
  }
  __name(readBlockSequence, "readBlockSequence");
  function readBlockMapping(state, nodeIndent, flowIndent) {
    var following, allowCompact, _line, _keyLine, _keyLineStart, _keyPos, _tag = state.tag, _anchor = state.anchor, _result = {}, overridableKeys = /* @__PURE__ */ Object.create(null), keyTag = null, keyNode = null, valueNode = null, atExplicitKey = false, detected = false, ch;
    if (state.firstTabInLine !== -1) return false;
    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = _result;
    }
    ch = state.input.charCodeAt(state.position);
    while (ch !== 0) {
      if (!atExplicitKey && state.firstTabInLine !== -1) {
        state.position = state.firstTabInLine;
        throwError(state, "tab characters must not be used in indentation");
      }
      following = state.input.charCodeAt(state.position + 1);
      _line = state.line;
      if ((ch === 63 || ch === 58) && is_WS_OR_EOL(following)) {
        if (ch === 63) {
          if (atExplicitKey) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
            keyTag = keyNode = valueNode = null;
          }
          detected = true;
          atExplicitKey = true;
          allowCompact = true;
        } else if (atExplicitKey) {
          atExplicitKey = false;
          allowCompact = true;
        } else {
          throwError(state, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line");
        }
        state.position += 1;
        ch = following;
      } else {
        _keyLine = state.line;
        _keyLineStart = state.lineStart;
        _keyPos = state.position;
        if (!composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {
          break;
        }
        if (state.line === _line) {
          ch = state.input.charCodeAt(state.position);
          while (is_WHITE_SPACE(ch)) {
            ch = state.input.charCodeAt(++state.position);
          }
          if (ch === 58) {
            ch = state.input.charCodeAt(++state.position);
            if (!is_WS_OR_EOL(ch)) {
              throwError(state, "a whitespace character is expected after the key-value separator within a block mapping");
            }
            if (atExplicitKey) {
              storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
              keyTag = keyNode = valueNode = null;
            }
            detected = true;
            atExplicitKey = false;
            allowCompact = false;
            keyTag = state.tag;
            keyNode = state.result;
          } else if (detected) {
            throwError(state, "can not read an implicit mapping pair; a colon is missed");
          } else {
            state.tag = _tag;
            state.anchor = _anchor;
            return true;
          }
        } else if (detected) {
          throwError(state, "can not read a block mapping entry; a multiline key may not be an implicit key");
        } else {
          state.tag = _tag;
          state.anchor = _anchor;
          return true;
        }
      }
      if (state.line === _line || state.lineIndent > nodeIndent) {
        if (atExplicitKey) {
          _keyLine = state.line;
          _keyLineStart = state.lineStart;
          _keyPos = state.position;
        }
        if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
          if (atExplicitKey) {
            keyNode = state.result;
          } else {
            valueNode = state.result;
          }
        }
        if (!atExplicitKey) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _keyLine, _keyLineStart, _keyPos);
          keyTag = keyNode = valueNode = null;
        }
        skipSeparationSpace(state, true, -1);
        ch = state.input.charCodeAt(state.position);
      }
      if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
        throwError(state, "bad indentation of a mapping entry");
      } else if (state.lineIndent < nodeIndent) {
        break;
      }
    }
    if (atExplicitKey) {
      storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
    }
    if (detected) {
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = "mapping";
      state.result = _result;
    }
    return detected;
  }
  __name(readBlockMapping, "readBlockMapping");
  function readTagProperty(state) {
    var _position, isVerbatim = false, isNamed = false, tagHandle, tagName, ch;
    ch = state.input.charCodeAt(state.position);
    if (ch !== 33) return false;
    if (state.tag !== null) {
      throwError(state, "duplication of a tag property");
    }
    ch = state.input.charCodeAt(++state.position);
    if (ch === 60) {
      isVerbatim = true;
      ch = state.input.charCodeAt(++state.position);
    } else if (ch === 33) {
      isNamed = true;
      tagHandle = "!!";
      ch = state.input.charCodeAt(++state.position);
    } else {
      tagHandle = "!";
    }
    _position = state.position;
    if (isVerbatim) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (ch !== 0 && ch !== 62);
      if (state.position < state.length) {
        tagName = state.input.slice(_position, state.position);
        ch = state.input.charCodeAt(++state.position);
      } else {
        throwError(state, "unexpected end of the stream within a verbatim tag");
      }
    } else {
      while (ch !== 0 && !is_WS_OR_EOL(ch)) {
        if (ch === 33) {
          if (!isNamed) {
            tagHandle = state.input.slice(_position - 1, state.position + 1);
            if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
              throwError(state, "named tag handle cannot contain such characters");
            }
            isNamed = true;
            _position = state.position + 1;
          } else {
            throwError(state, "tag suffix cannot contain exclamation marks");
          }
        }
        ch = state.input.charCodeAt(++state.position);
      }
      tagName = state.input.slice(_position, state.position);
      if (PATTERN_FLOW_INDICATORS.test(tagName)) {
        throwError(state, "tag suffix cannot contain flow indicator characters");
      }
    }
    if (tagName && !PATTERN_TAG_URI.test(tagName)) {
      throwError(state, "tag name cannot contain such characters: " + tagName);
    }
    try {
      tagName = decodeURIComponent(tagName);
    } catch (err) {
      throwError(state, "tag name is malformed: " + tagName);
    }
    if (isVerbatim) {
      state.tag = tagName;
    } else if (_hasOwnProperty$1.call(state.tagMap, tagHandle)) {
      state.tag = state.tagMap[tagHandle] + tagName;
    } else if (tagHandle === "!") {
      state.tag = "!" + tagName;
    } else if (tagHandle === "!!") {
      state.tag = "tag:yaml.org,2002:" + tagName;
    } else {
      throwError(state, 'undeclared tag handle "' + tagHandle + '"');
    }
    return true;
  }
  __name(readTagProperty, "readTagProperty");
  function readAnchorProperty(state) {
    var _position, ch;
    ch = state.input.charCodeAt(state.position);
    if (ch !== 38) return false;
    if (state.anchor !== null) {
      throwError(state, "duplication of an anchor property");
    }
    ch = state.input.charCodeAt(++state.position);
    _position = state.position;
    while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }
    if (state.position === _position) {
      throwError(state, "name of an anchor node must contain at least one character");
    }
    state.anchor = state.input.slice(_position, state.position);
    return true;
  }
  __name(readAnchorProperty, "readAnchorProperty");
  function readAlias(state) {
    var _position, alias, ch;
    ch = state.input.charCodeAt(state.position);
    if (ch !== 42) return false;
    ch = state.input.charCodeAt(++state.position);
    _position = state.position;
    while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }
    if (state.position === _position) {
      throwError(state, "name of an alias node must contain at least one character");
    }
    alias = state.input.slice(_position, state.position);
    if (!_hasOwnProperty$1.call(state.anchorMap, alias)) {
      throwError(state, 'unidentified alias "' + alias + '"');
    }
    state.result = state.anchorMap[alias];
    skipSeparationSpace(state, true, -1);
    return true;
  }
  __name(readAlias, "readAlias");
  function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
    var allowBlockStyles, allowBlockScalars, allowBlockCollections, indentStatus = 1, atNewLine = false, hasContent = false, typeIndex, typeQuantity, typeList, type2, flowIndent, blockIndent;
    if (state.listener !== null) {
      state.listener("open", state);
    }
    state.tag = null;
    state.anchor = null;
    state.kind = null;
    state.result = null;
    allowBlockStyles = allowBlockScalars = allowBlockCollections = CONTEXT_BLOCK_OUT === nodeContext || CONTEXT_BLOCK_IN === nodeContext;
    if (allowToSeek) {
      if (skipSeparationSpace(state, true, -1)) {
        atNewLine = true;
        if (state.lineIndent > parentIndent) {
          indentStatus = 1;
        } else if (state.lineIndent === parentIndent) {
          indentStatus = 0;
        } else if (state.lineIndent < parentIndent) {
          indentStatus = -1;
        }
      }
    }
    if (indentStatus === 1) {
      while (readTagProperty(state) || readAnchorProperty(state)) {
        if (skipSeparationSpace(state, true, -1)) {
          atNewLine = true;
          allowBlockCollections = allowBlockStyles;
          if (state.lineIndent > parentIndent) {
            indentStatus = 1;
          } else if (state.lineIndent === parentIndent) {
            indentStatus = 0;
          } else if (state.lineIndent < parentIndent) {
            indentStatus = -1;
          }
        } else {
          allowBlockCollections = false;
        }
      }
    }
    if (allowBlockCollections) {
      allowBlockCollections = atNewLine || allowCompact;
    }
    if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
      if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
        flowIndent = parentIndent;
      } else {
        flowIndent = parentIndent + 1;
      }
      blockIndent = state.position - state.lineStart;
      if (indentStatus === 1) {
        if (allowBlockCollections && (readBlockSequence(state, blockIndent) || readBlockMapping(state, blockIndent, flowIndent)) || readFlowCollection(state, flowIndent)) {
          hasContent = true;
        } else {
          if (allowBlockScalars && readBlockScalar(state, flowIndent) || readSingleQuotedScalar(state, flowIndent) || readDoubleQuotedScalar(state, flowIndent)) {
            hasContent = true;
          } else if (readAlias(state)) {
            hasContent = true;
            if (state.tag !== null || state.anchor !== null) {
              throwError(state, "alias node should not have any properties");
            }
          } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
            hasContent = true;
            if (state.tag === null) {
              state.tag = "?";
            }
          }
          if (state.anchor !== null) {
            state.anchorMap[state.anchor] = state.result;
          }
        }
      } else if (indentStatus === 0) {
        hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
      }
    }
    if (state.tag === null) {
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = state.result;
      }
    } else if (state.tag === "?") {
      if (state.result !== null && state.kind !== "scalar") {
        throwError(state, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + state.kind + '"');
      }
      for (typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex += 1) {
        type2 = state.implicitTypes[typeIndex];
        if (type2.resolve(state.result)) {
          state.result = type2.construct(state.result);
          state.tag = type2.tag;
          if (state.anchor !== null) {
            state.anchorMap[state.anchor] = state.result;
          }
          break;
        }
      }
    } else if (state.tag !== "!") {
      if (_hasOwnProperty$1.call(state.typeMap[state.kind || "fallback"], state.tag)) {
        type2 = state.typeMap[state.kind || "fallback"][state.tag];
      } else {
        type2 = null;
        typeList = state.typeMap.multi[state.kind || "fallback"];
        for (typeIndex = 0, typeQuantity = typeList.length; typeIndex < typeQuantity; typeIndex += 1) {
          if (state.tag.slice(0, typeList[typeIndex].tag.length) === typeList[typeIndex].tag) {
            type2 = typeList[typeIndex];
            break;
          }
        }
      }
      if (!type2) {
        throwError(state, "unknown tag !<" + state.tag + ">");
      }
      if (state.result !== null && type2.kind !== state.kind) {
        throwError(state, "unacceptable node kind for !<" + state.tag + '> tag; it should be "' + type2.kind + '", not "' + state.kind + '"');
      }
      if (!type2.resolve(state.result, state.tag)) {
        throwError(state, "cannot resolve a node with !<" + state.tag + "> explicit tag");
      } else {
        state.result = type2.construct(state.result, state.tag);
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
      }
    }
    if (state.listener !== null) {
      state.listener("close", state);
    }
    return state.tag !== null || state.anchor !== null || hasContent;
  }
  __name(composeNode, "composeNode");
  function readDocument(state) {
    var documentStart = state.position, _position, directiveName, directiveArgs, hasDirectives = false, ch;
    state.version = null;
    state.checkLineBreaks = state.legacy;
    state.tagMap = /* @__PURE__ */ Object.create(null);
    state.anchorMap = /* @__PURE__ */ Object.create(null);
    while ((ch = state.input.charCodeAt(state.position)) !== 0) {
      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
      if (state.lineIndent > 0 || ch !== 37) {
        break;
      }
      hasDirectives = true;
      ch = state.input.charCodeAt(++state.position);
      _position = state.position;
      while (ch !== 0 && !is_WS_OR_EOL(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      directiveName = state.input.slice(_position, state.position);
      directiveArgs = [];
      if (directiveName.length < 1) {
        throwError(state, "directive name must not be less than one character in length");
      }
      while (ch !== 0) {
        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        if (ch === 35) {
          do {
            ch = state.input.charCodeAt(++state.position);
          } while (ch !== 0 && !is_EOL(ch));
          break;
        }
        if (is_EOL(ch)) break;
        _position = state.position;
        while (ch !== 0 && !is_WS_OR_EOL(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        directiveArgs.push(state.input.slice(_position, state.position));
      }
      if (ch !== 0) readLineBreak(state);
      if (_hasOwnProperty$1.call(directiveHandlers, directiveName)) {
        directiveHandlers[directiveName](state, directiveName, directiveArgs);
      } else {
        throwWarning(state, 'unknown document directive "' + directiveName + '"');
      }
    }
    skipSeparationSpace(state, true, -1);
    if (state.lineIndent === 0 && state.input.charCodeAt(state.position) === 45 && state.input.charCodeAt(state.position + 1) === 45 && state.input.charCodeAt(state.position + 2) === 45) {
      state.position += 3;
      skipSeparationSpace(state, true, -1);
    } else if (hasDirectives) {
      throwError(state, "directives end mark is expected");
    }
    composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
    skipSeparationSpace(state, true, -1);
    if (state.checkLineBreaks && PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
      throwWarning(state, "non-ASCII line breaks are interpreted as content");
    }
    state.documents.push(state.result);
    if (state.position === state.lineStart && testDocumentSeparator(state)) {
      if (state.input.charCodeAt(state.position) === 46) {
        state.position += 3;
        skipSeparationSpace(state, true, -1);
      }
      return;
    }
    if (state.position < state.length - 1) {
      throwError(state, "end of the stream or a document separator is expected");
    } else {
      return;
    }
  }
  __name(readDocument, "readDocument");
  function loadDocuments(input, options) {
    input = String(input);
    options = options || {};
    if (input.length !== 0) {
      if (input.charCodeAt(input.length - 1) !== 10 && input.charCodeAt(input.length - 1) !== 13) {
        input += "\n";
      }
      if (input.charCodeAt(0) === 65279) {
        input = input.slice(1);
      }
    }
    var state = new State$1(input, options);
    var nullpos = input.indexOf("\0");
    if (nullpos !== -1) {
      state.position = nullpos;
      throwError(state, "null byte is not allowed in input");
    }
    state.input += "\0";
    while (state.input.charCodeAt(state.position) === 32) {
      state.lineIndent += 1;
      state.position += 1;
    }
    while (state.position < state.length - 1) {
      readDocument(state);
    }
    return state.documents;
  }
  __name(loadDocuments, "loadDocuments");
  function loadAll$1(input, iterator, options) {
    if (iterator !== null && typeof iterator === "object" && typeof options === "undefined") {
      options = iterator;
      iterator = null;
    }
    var documents = loadDocuments(input, options);
    if (typeof iterator !== "function") {
      return documents;
    }
    for (var index = 0, length = documents.length; index < length; index += 1) {
      iterator(documents[index]);
    }
  }
  __name(loadAll$1, "loadAll$1");
  function load$1(input, options) {
    var documents = loadDocuments(input, options);
    if (documents.length === 0) {
      return void 0;
    } else if (documents.length === 1) {
      return documents[0];
    }
    throw new exception("expected a single document in the stream, but found more");
  }
  __name(load$1, "load$1");
  var loadAll_1 = loadAll$1;
  var load_1 = load$1;
  var loader = {
    loadAll: loadAll_1,
    load: load_1
  };
  var _toString = Object.prototype.toString;
  var _hasOwnProperty = Object.prototype.hasOwnProperty;
  var CHAR_BOM = 65279;
  var CHAR_TAB = 9;
  var CHAR_LINE_FEED = 10;
  var CHAR_CARRIAGE_RETURN = 13;
  var CHAR_SPACE = 32;
  var CHAR_EXCLAMATION = 33;
  var CHAR_DOUBLE_QUOTE = 34;
  var CHAR_SHARP = 35;
  var CHAR_PERCENT = 37;
  var CHAR_AMPERSAND = 38;
  var CHAR_SINGLE_QUOTE = 39;
  var CHAR_ASTERISK = 42;
  var CHAR_COMMA = 44;
  var CHAR_MINUS = 45;
  var CHAR_COLON = 58;
  var CHAR_EQUALS = 61;
  var CHAR_GREATER_THAN = 62;
  var CHAR_QUESTION = 63;
  var CHAR_COMMERCIAL_AT = 64;
  var CHAR_LEFT_SQUARE_BRACKET = 91;
  var CHAR_RIGHT_SQUARE_BRACKET = 93;
  var CHAR_GRAVE_ACCENT = 96;
  var CHAR_LEFT_CURLY_BRACKET = 123;
  var CHAR_VERTICAL_LINE = 124;
  var CHAR_RIGHT_CURLY_BRACKET = 125;
  var ESCAPE_SEQUENCES = {};
  ESCAPE_SEQUENCES[0] = "\\0";
  ESCAPE_SEQUENCES[7] = "\\a";
  ESCAPE_SEQUENCES[8] = "\\b";
  ESCAPE_SEQUENCES[9] = "\\t";
  ESCAPE_SEQUENCES[10] = "\\n";
  ESCAPE_SEQUENCES[11] = "\\v";
  ESCAPE_SEQUENCES[12] = "\\f";
  ESCAPE_SEQUENCES[13] = "\\r";
  ESCAPE_SEQUENCES[27] = "\\e";
  ESCAPE_SEQUENCES[34] = '\\"';
  ESCAPE_SEQUENCES[92] = "\\\\";
  ESCAPE_SEQUENCES[133] = "\\N";
  ESCAPE_SEQUENCES[160] = "\\_";
  ESCAPE_SEQUENCES[8232] = "\\L";
  ESCAPE_SEQUENCES[8233] = "\\P";
  var DEPRECATED_BOOLEANS_SYNTAX = [
    "y",
    "Y",
    "yes",
    "Yes",
    "YES",
    "on",
    "On",
    "ON",
    "n",
    "N",
    "no",
    "No",
    "NO",
    "off",
    "Off",
    "OFF"
  ];
  var DEPRECATED_BASE60_SYNTAX = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
  function compileStyleMap(schema2, map2) {
    var result, keys, index, length, tag, style, type2;
    if (map2 === null) return {};
    result = {};
    keys = Object.keys(map2);
    for (index = 0, length = keys.length; index < length; index += 1) {
      tag = keys[index];
      style = String(map2[tag]);
      if (tag.slice(0, 2) === "!!") {
        tag = "tag:yaml.org,2002:" + tag.slice(2);
      }
      type2 = schema2.compiledTypeMap["fallback"][tag];
      if (type2 && _hasOwnProperty.call(type2.styleAliases, style)) {
        style = type2.styleAliases[style];
      }
      result[tag] = style;
    }
    return result;
  }
  __name(compileStyleMap, "compileStyleMap");
  function encodeHex(character) {
    var string, handle, length;
    string = character.toString(16).toUpperCase();
    if (character <= 255) {
      handle = "x";
      length = 2;
    } else if (character <= 65535) {
      handle = "u";
      length = 4;
    } else if (character <= 4294967295) {
      handle = "U";
      length = 8;
    } else {
      throw new exception("code point within a string may not be greater than 0xFFFFFFFF");
    }
    return "\\" + handle + common.repeat("0", length - string.length) + string;
  }
  __name(encodeHex, "encodeHex");
  var QUOTING_TYPE_SINGLE = 1;
  var QUOTING_TYPE_DOUBLE = 2;
  function State(options) {
    this.schema = options["schema"] || _default;
    this.indent = Math.max(1, options["indent"] || 2);
    this.noArrayIndent = options["noArrayIndent"] || false;
    this.skipInvalid = options["skipInvalid"] || false;
    this.flowLevel = common.isNothing(options["flowLevel"]) ? -1 : options["flowLevel"];
    this.styleMap = compileStyleMap(this.schema, options["styles"] || null);
    this.sortKeys = options["sortKeys"] || false;
    this.lineWidth = options["lineWidth"] || 80;
    this.noRefs = options["noRefs"] || false;
    this.noCompatMode = options["noCompatMode"] || false;
    this.condenseFlow = options["condenseFlow"] || false;
    this.quotingType = options["quotingType"] === '"' ? QUOTING_TYPE_DOUBLE : QUOTING_TYPE_SINGLE;
    this.forceQuotes = options["forceQuotes"] || false;
    this.replacer = typeof options["replacer"] === "function" ? options["replacer"] : null;
    this.implicitTypes = this.schema.compiledImplicit;
    this.explicitTypes = this.schema.compiledExplicit;
    this.tag = null;
    this.result = "";
    this.duplicates = [];
    this.usedDuplicates = null;
  }
  __name(State, "State");
  function indentString(string, spaces) {
    var ind = common.repeat(" ", spaces), position = 0, next = -1, result = "", line, length = string.length;
    while (position < length) {
      next = string.indexOf("\n", position);
      if (next === -1) {
        line = string.slice(position);
        position = length;
      } else {
        line = string.slice(position, next + 1);
        position = next + 1;
      }
      if (line.length && line !== "\n") result += ind;
      result += line;
    }
    return result;
  }
  __name(indentString, "indentString");
  function generateNextLine(state, level) {
    return "\n" + common.repeat(" ", state.indent * level);
  }
  __name(generateNextLine, "generateNextLine");
  function testImplicitResolving(state, str2) {
    var index, length, type2;
    for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
      type2 = state.implicitTypes[index];
      if (type2.resolve(str2)) {
        return true;
      }
    }
    return false;
  }
  __name(testImplicitResolving, "testImplicitResolving");
  function isWhitespace(c) {
    return c === CHAR_SPACE || c === CHAR_TAB;
  }
  __name(isWhitespace, "isWhitespace");
  function isPrintable(c) {
    return 32 <= c && c <= 126 || 161 <= c && c <= 55295 && c !== 8232 && c !== 8233 || 57344 <= c && c <= 65533 && c !== CHAR_BOM || 65536 <= c && c <= 1114111;
  }
  __name(isPrintable, "isPrintable");
  function isNsCharOrWhitespace(c) {
    return isPrintable(c) && c !== CHAR_BOM && c !== CHAR_CARRIAGE_RETURN && c !== CHAR_LINE_FEED;
  }
  __name(isNsCharOrWhitespace, "isNsCharOrWhitespace");
  function isPlainSafe(c, prev, inblock) {
    var cIsNsCharOrWhitespace = isNsCharOrWhitespace(c);
    var cIsNsChar = cIsNsCharOrWhitespace && !isWhitespace(c);
    return (
        // ns-plain-safe
        (inblock ? (
            // c = flow-in
            cIsNsCharOrWhitespace
        ) : cIsNsCharOrWhitespace && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET) && c !== CHAR_SHARP && !(prev === CHAR_COLON && !cIsNsChar) || isNsCharOrWhitespace(prev) && !isWhitespace(prev) && c === CHAR_SHARP || prev === CHAR_COLON && cIsNsChar
    );
  }
  __name(isPlainSafe, "isPlainSafe");
  function isPlainSafeFirst(c) {
    return isPrintable(c) && c !== CHAR_BOM && !isWhitespace(c) && c !== CHAR_MINUS && c !== CHAR_QUESTION && c !== CHAR_COLON && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET && c !== CHAR_SHARP && c !== CHAR_AMPERSAND && c !== CHAR_ASTERISK && c !== CHAR_EXCLAMATION && c !== CHAR_VERTICAL_LINE && c !== CHAR_EQUALS && c !== CHAR_GREATER_THAN && c !== CHAR_SINGLE_QUOTE && c !== CHAR_DOUBLE_QUOTE && c !== CHAR_PERCENT && c !== CHAR_COMMERCIAL_AT && c !== CHAR_GRAVE_ACCENT;
  }
  __name(isPlainSafeFirst, "isPlainSafeFirst");
  function isPlainSafeLast(c) {
    return !isWhitespace(c) && c !== CHAR_COLON;
  }
  __name(isPlainSafeLast, "isPlainSafeLast");
  function codePointAt(string, pos) {
    var first = string.charCodeAt(pos), second;
    if (first >= 55296 && first <= 56319 && pos + 1 < string.length) {
      second = string.charCodeAt(pos + 1);
      if (second >= 56320 && second <= 57343) {
        return (first - 55296) * 1024 + second - 56320 + 65536;
      }
    }
    return first;
  }
  __name(codePointAt, "codePointAt");
  function needIndentIndicator(string) {
    var leadingSpaceRe = /^\n* /;
    return leadingSpaceRe.test(string);
  }
  __name(needIndentIndicator, "needIndentIndicator");
  var STYLE_PLAIN = 1;
  var STYLE_SINGLE = 2;
  var STYLE_LITERAL = 3;
  var STYLE_FOLDED = 4;
  var STYLE_DOUBLE = 5;
  function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth, testAmbiguousType, quotingType, forceQuotes, inblock) {
    var i;
    var char = 0;
    var prevChar = null;
    var hasLineBreak = false;
    var hasFoldableLine = false;
    var shouldTrackWidth = lineWidth !== -1;
    var previousLineBreak = -1;
    var plain = isPlainSafeFirst(codePointAt(string, 0)) && isPlainSafeLast(codePointAt(string, string.length - 1));
    if (singleLineOnly || forceQuotes) {
      for (i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
        char = codePointAt(string, i);
        if (!isPrintable(char)) {
          return STYLE_DOUBLE;
        }
        plain = plain && isPlainSafe(char, prevChar, inblock);
        prevChar = char;
      }
    } else {
      for (i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
        char = codePointAt(string, i);
        if (char === CHAR_LINE_FEED) {
          hasLineBreak = true;
          if (shouldTrackWidth) {
            hasFoldableLine = hasFoldableLine || // Foldable line = too long, and not more-indented.
                i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ";
            previousLineBreak = i;
          }
        } else if (!isPrintable(char)) {
          return STYLE_DOUBLE;
        }
        plain = plain && isPlainSafe(char, prevChar, inblock);
        prevChar = char;
      }
      hasFoldableLine = hasFoldableLine || shouldTrackWidth && (i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ");
    }
    if (!hasLineBreak && !hasFoldableLine) {
      if (plain && !forceQuotes && !testAmbiguousType(string)) {
        return STYLE_PLAIN;
      }
      return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
    }
    if (indentPerLevel > 9 && needIndentIndicator(string)) {
      return STYLE_DOUBLE;
    }
    if (!forceQuotes) {
      return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
    }
    return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
  }
  __name(chooseScalarStyle, "chooseScalarStyle");
  function writeScalar(state, string, level, iskey, inblock) {
    state.dump = function() {
      if (string.length === 0) {
        return state.quotingType === QUOTING_TYPE_DOUBLE ? '""' : "''";
      }
      if (!state.noCompatMode) {
        if (DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1 || DEPRECATED_BASE60_SYNTAX.test(string)) {
          return state.quotingType === QUOTING_TYPE_DOUBLE ? '"' + string + '"' : "'" + string + "'";
        }
      }
      var indent = state.indent * Math.max(1, level);
      var lineWidth = state.lineWidth === -1 ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);
      var singleLineOnly = iskey || state.flowLevel > -1 && level >= state.flowLevel;
      function testAmbiguity(string2) {
        return testImplicitResolving(state, string2);
      }
      __name(testAmbiguity, "testAmbiguity");
      switch (chooseScalarStyle(
          string,
          singleLineOnly,
          state.indent,
          lineWidth,
          testAmbiguity,
          state.quotingType,
          state.forceQuotes && !iskey,
          inblock
      )) {
        case STYLE_PLAIN:
          return string;
        case STYLE_SINGLE:
          return "'" + string.replace(/'/g, "''") + "'";
        case STYLE_LITERAL:
          return "|" + blockHeader(string, state.indent) + dropEndingNewline(indentString(string, indent));
        case STYLE_FOLDED:
          return ">" + blockHeader(string, state.indent) + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
        case STYLE_DOUBLE:
          return '"' + escapeString(string) + '"';
        default:
          throw new exception("impossible error: invalid scalar style");
      }
    }();
  }
  __name(writeScalar, "writeScalar");
  function blockHeader(string, indentPerLevel) {
    var indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : "";
    var clip = string[string.length - 1] === "\n";
    var keep = clip && (string[string.length - 2] === "\n" || string === "\n");
    var chomp = keep ? "+" : clip ? "" : "-";
    return indentIndicator + chomp + "\n";
  }
  __name(blockHeader, "blockHeader");
  function dropEndingNewline(string) {
    return string[string.length - 1] === "\n" ? string.slice(0, -1) : string;
  }
  __name(dropEndingNewline, "dropEndingNewline");
  function foldString(string, width) {
    var lineRe = /(\n+)([^\n]*)/g;
    var result = function() {
      var nextLF = string.indexOf("\n");
      nextLF = nextLF !== -1 ? nextLF : string.length;
      lineRe.lastIndex = nextLF;
      return foldLine(string.slice(0, nextLF), width);
    }();
    var prevMoreIndented = string[0] === "\n" || string[0] === " ";
    var moreIndented;
    var match;
    while (match = lineRe.exec(string)) {
      var prefix = match[1], line = match[2];
      moreIndented = line[0] === " ";
      result += prefix + (!prevMoreIndented && !moreIndented && line !== "" ? "\n" : "") + foldLine(line, width);
      prevMoreIndented = moreIndented;
    }
    return result;
  }
  __name(foldString, "foldString");
  function foldLine(line, width) {
    if (line === "" || line[0] === " ") return line;
    var breakRe = / [^ ]/g;
    var match;
    var start = 0, end, curr = 0, next = 0;
    var result = "";
    while (match = breakRe.exec(line)) {
      next = match.index;
      if (next - start > width) {
        end = curr > start ? curr : next;
        result += "\n" + line.slice(start, end);
        start = end + 1;
      }
      curr = next;
    }
    result += "\n";
    if (line.length - start > width && curr > start) {
      result += line.slice(start, curr) + "\n" + line.slice(curr + 1);
    } else {
      result += line.slice(start);
    }
    return result.slice(1);
  }
  __name(foldLine, "foldLine");
  function escapeString(string) {
    var result = "";
    var char = 0;
    var escapeSeq;
    for (var i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
      char = codePointAt(string, i);
      escapeSeq = ESCAPE_SEQUENCES[char];
      if (!escapeSeq && isPrintable(char)) {
        result += string[i];
        if (char >= 65536) result += string[i + 1];
      } else {
        result += escapeSeq || encodeHex(char);
      }
    }
    return result;
  }
  __name(escapeString, "escapeString");
  function writeFlowSequence(state, level, object) {
    var _result = "", _tag = state.tag, index, length, value;
    for (index = 0, length = object.length; index < length; index += 1) {
      value = object[index];
      if (state.replacer) {
        value = state.replacer.call(object, String(index), value);
      }
      if (writeNode(state, level, value, false, false) || typeof value === "undefined" && writeNode(state, level, null, false, false)) {
        if (_result !== "") _result += "," + (!state.condenseFlow ? " " : "");
        _result += state.dump;
      }
    }
    state.tag = _tag;
    state.dump = "[" + _result + "]";
  }
  __name(writeFlowSequence, "writeFlowSequence");
  function writeBlockSequence(state, level, object, compact) {
    var _result = "", _tag = state.tag, index, length, value;
    for (index = 0, length = object.length; index < length; index += 1) {
      value = object[index];
      if (state.replacer) {
        value = state.replacer.call(object, String(index), value);
      }
      if (writeNode(state, level + 1, value, true, true, false, true) || typeof value === "undefined" && writeNode(state, level + 1, null, true, true, false, true)) {
        if (!compact || _result !== "") {
          _result += generateNextLine(state, level);
        }
        if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
          _result += "-";
        } else {
          _result += "- ";
        }
        _result += state.dump;
      }
    }
    state.tag = _tag;
    state.dump = _result || "[]";
  }
  __name(writeBlockSequence, "writeBlockSequence");
  function writeFlowMapping(state, level, object) {
    var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, pairBuffer;
    for (index = 0, length = objectKeyList.length; index < length; index += 1) {
      pairBuffer = "";
      if (_result !== "") pairBuffer += ", ";
      if (state.condenseFlow) pairBuffer += '"';
      objectKey = objectKeyList[index];
      objectValue = object[objectKey];
      if (state.replacer) {
        objectValue = state.replacer.call(object, objectKey, objectValue);
      }
      if (!writeNode(state, level, objectKey, false, false)) {
        continue;
      }
      if (state.dump.length > 1024) pairBuffer += "? ";
      pairBuffer += state.dump + (state.condenseFlow ? '"' : "") + ":" + (state.condenseFlow ? "" : " ");
      if (!writeNode(state, level, objectValue, false, false)) {
        continue;
      }
      pairBuffer += state.dump;
      _result += pairBuffer;
    }
    state.tag = _tag;
    state.dump = "{" + _result + "}";
  }
  __name(writeFlowMapping, "writeFlowMapping");
  function writeBlockMapping(state, level, object, compact) {
    var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, explicitPair, pairBuffer;
    if (state.sortKeys === true) {
      objectKeyList.sort();
    } else if (typeof state.sortKeys === "function") {
      objectKeyList.sort(state.sortKeys);
    } else if (state.sortKeys) {
      throw new exception("sortKeys must be a boolean or a function");
    }
    for (index = 0, length = objectKeyList.length; index < length; index += 1) {
      pairBuffer = "";
      if (!compact || _result !== "") {
        pairBuffer += generateNextLine(state, level);
      }
      objectKey = objectKeyList[index];
      objectValue = object[objectKey];
      if (state.replacer) {
        objectValue = state.replacer.call(object, objectKey, objectValue);
      }
      if (!writeNode(state, level + 1, objectKey, true, true, true)) {
        continue;
      }
      explicitPair = state.tag !== null && state.tag !== "?" || state.dump && state.dump.length > 1024;
      if (explicitPair) {
        if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
          pairBuffer += "?";
        } else {
          pairBuffer += "? ";
        }
      }
      pairBuffer += state.dump;
      if (explicitPair) {
        pairBuffer += generateNextLine(state, level);
      }
      if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
        continue;
      }
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        pairBuffer += ":";
      } else {
        pairBuffer += ": ";
      }
      pairBuffer += state.dump;
      _result += pairBuffer;
    }
    state.tag = _tag;
    state.dump = _result || "{}";
  }
  __name(writeBlockMapping, "writeBlockMapping");
  function detectType(state, object, explicit) {
    var _result, typeList, index, length, type2, style;
    typeList = explicit ? state.explicitTypes : state.implicitTypes;
    for (index = 0, length = typeList.length; index < length; index += 1) {
      type2 = typeList[index];
      if ((type2.instanceOf || type2.predicate) && (!type2.instanceOf || typeof object === "object" && object instanceof type2.instanceOf) && (!type2.predicate || type2.predicate(object))) {
        if (explicit) {
          if (type2.multi && type2.representName) {
            state.tag = type2.representName(object);
          } else {
            state.tag = type2.tag;
          }
        } else {
          state.tag = "?";
        }
        if (type2.represent) {
          style = state.styleMap[type2.tag] || type2.defaultStyle;
          if (_toString.call(type2.represent) === "[object Function]") {
            _result = type2.represent(object, style);
          } else if (_hasOwnProperty.call(type2.represent, style)) {
            _result = type2.represent[style](object, style);
          } else {
            throw new exception("!<" + type2.tag + '> tag resolver accepts not "' + style + '" style');
          }
          state.dump = _result;
        }
        return true;
      }
    }
    return false;
  }
  __name(detectType, "detectType");
  function writeNode(state, level, object, block, compact, iskey, isblockseq) {
    state.tag = null;
    state.dump = object;
    if (!detectType(state, object, false)) {
      detectType(state, object, true);
    }
    var type2 = _toString.call(state.dump);
    var inblock = block;
    var tagStr;
    if (block) {
      block = state.flowLevel < 0 || state.flowLevel > level;
    }
    var objectOrArray = type2 === "[object Object]" || type2 === "[object Array]", duplicateIndex, duplicate;
    if (objectOrArray) {
      duplicateIndex = state.duplicates.indexOf(object);
      duplicate = duplicateIndex !== -1;
    }
    if (state.tag !== null && state.tag !== "?" || duplicate || state.indent !== 2 && level > 0) {
      compact = false;
    }
    if (duplicate && state.usedDuplicates[duplicateIndex]) {
      state.dump = "*ref_" + duplicateIndex;
    } else {
      if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
        state.usedDuplicates[duplicateIndex] = true;
      }
      if (type2 === "[object Object]") {
        if (block && Object.keys(state.dump).length !== 0) {
          writeBlockMapping(state, level, state.dump, compact);
          if (duplicate) {
            state.dump = "&ref_" + duplicateIndex + state.dump;
          }
        } else {
          writeFlowMapping(state, level, state.dump);
          if (duplicate) {
            state.dump = "&ref_" + duplicateIndex + " " + state.dump;
          }
        }
      } else if (type2 === "[object Array]") {
        if (block && state.dump.length !== 0) {
          if (state.noArrayIndent && !isblockseq && level > 0) {
            writeBlockSequence(state, level - 1, state.dump, compact);
          } else {
            writeBlockSequence(state, level, state.dump, compact);
          }
          if (duplicate) {
            state.dump = "&ref_" + duplicateIndex + state.dump;
          }
        } else {
          writeFlowSequence(state, level, state.dump);
          if (duplicate) {
            state.dump = "&ref_" + duplicateIndex + " " + state.dump;
          }
        }
      } else if (type2 === "[object String]") {
        if (state.tag !== "?") {
          writeScalar(state, state.dump, level, iskey, inblock);
        }
      } else if (type2 === "[object Undefined]") {
        return false;
      } else {
        if (state.skipInvalid) return false;
        throw new exception("unacceptable kind of an object to dump " + type2);
      }
      if (state.tag !== null && state.tag !== "?") {
        tagStr = encodeURI(
            state.tag[0] === "!" ? state.tag.slice(1) : state.tag
        ).replace(/!/g, "%21");
        if (state.tag[0] === "!") {
          tagStr = "!" + tagStr;
        } else if (tagStr.slice(0, 18) === "tag:yaml.org,2002:") {
          tagStr = "!!" + tagStr.slice(18);
        } else {
          tagStr = "!<" + tagStr + ">";
        }
        state.dump = tagStr + " " + state.dump;
      }
    }
    return true;
  }
  __name(writeNode, "writeNode");
  function getDuplicateReferences(object, state) {
    var objects = [], duplicatesIndexes = [], index, length;
    inspectNode(object, objects, duplicatesIndexes);
    for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
      state.duplicates.push(objects[duplicatesIndexes[index]]);
    }
    state.usedDuplicates = new Array(length);
  }
  __name(getDuplicateReferences, "getDuplicateReferences");
  function inspectNode(object, objects, duplicatesIndexes) {
    var objectKeyList, index, length;
    if (object !== null && typeof object === "object") {
      index = objects.indexOf(object);
      if (index !== -1) {
        if (duplicatesIndexes.indexOf(index) === -1) {
          duplicatesIndexes.push(index);
        }
      } else {
        objects.push(object);
        if (Array.isArray(object)) {
          for (index = 0, length = object.length; index < length; index += 1) {
            inspectNode(object[index], objects, duplicatesIndexes);
          }
        } else {
          objectKeyList = Object.keys(object);
          for (index = 0, length = objectKeyList.length; index < length; index += 1) {
            inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
          }
        }
      }
    }
  }
  __name(inspectNode, "inspectNode");
  function dump$1(input, options) {
    options = options || {};
    var state = new State(options);
    if (!state.noRefs) getDuplicateReferences(input, state);
    var value = input;
    if (state.replacer) {
      value = state.replacer.call({ "": value }, "", value);
    }
    if (writeNode(state, 0, value, true, true)) return state.dump + "\n";
    return "";
  }
  __name(dump$1, "dump$1");
  var dump_1 = dump$1;
  var dumper = {
    dump: dump_1
  };
  function renamed(from, to) {
    return function() {
      throw new Error("Function yaml." + from + " is removed in js-yaml 4. Use yaml." + to + " instead, which is now safe by default.");
    };
  }
  __name(renamed, "renamed");
  var Type = type;
  var Schema = schema;
  var FAILSAFE_SCHEMA = failsafe;
  var JSON_SCHEMA = json;
  var CORE_SCHEMA = core;
  var DEFAULT_SCHEMA = _default;
  var load = loader.load;
  var loadAll = loader.loadAll;
  var dump = dumper.dump;
  var YAMLException = exception;
  var types = {
    binary,
    float,
    map,
    null: _null,
    pairs,
    set,
    timestamp,
    bool,
    int,
    merge,
    omap,
    seq,
    str
  };
  var safeLoad = renamed("safeLoad", "load");
  var safeLoadAll = renamed("safeLoadAll", "loadAll");
  var safeDump = renamed("safeDump", "dump");
  var jsYaml = {
    Type,
    Schema,
    FAILSAFE_SCHEMA,
    JSON_SCHEMA,
    CORE_SCHEMA,
    DEFAULT_SCHEMA,
    load,
    loadAll,
    dump,
    YAMLException,
    types,
    safeLoad,
    safeLoadAll,
    safeDump
  };
  var js_yaml_default = jsYaml;

  // src/strings.js
  var pre = `

port: 7890
socks-port: 7891
mode: Rule
allow-lan: false
log-level: silent
ipv6: true
disable-keep-alive: true
unified-delay: true
tcp-concurrent: true
geodata-loader: standard
external-controller: :9090

dns:
  enable: true
  cache-algorithm: lru
  prefer-h3: false
  use-hosts: true
  use-system-hosts: true
  respect-rules: false
  listen: 0.0.0.0:1053
  ipv6: false
  default-nameserver:
    - system
  enhanced-mode: fake-ip
  fake-ip-range: 198.18.0.1/16
  fake-ip-filter-mode: blacklist
  fake-ip-filter:
    - 'geosite:private'
    - '*.lan'
  nameserver-policy:
    '+.arpa': '10.0.0.1'
    '+.internal.crop.com': '10.0.0.1'
    'geosite:cn': system

  nameserver:
    - https://doh.pub/dns-query
    - https://101.102.103.104/dns-query#skip-cert-verify=true
    - https://public.dns.iij.jp/dns-query
    - https://dns.flyme.cc/dns-query
  fallback:
    - tls://1.1.1.1#RULES
    - tls://8.8.8.8#RULES
    - https://101.102.103.104/dns-query#skip-cert-verify=true
    - https://public.dns.iij.jp/dns-query
  proxy-server-nameserver:
    - https://doh.pub/dns-query
  direct-nameserver:

  direct-nameserver-follow-policy:
  fallback-filter:
    geoip: false
    geoip-code: CN
    geosite:
    ipcidr:
      - 240.0.0.0/4
    domain:

`;
  var group = `

    [
    	{
        "name": "\u8282\u70B9\u9009\u62E9",
        "type": "select",
        "proxies": [
            "\u81EA\u52A8\u9009\u62E9",
            "\u8F6E\u8BE2\u5747\u8861",
            "\u54C8\u5E0C\u5747\u8861",
            "\u7C98\u6027\u5747\u8861"
        	]
    	},
    	{
        "name": "\u5168\u7403\u76F4\u8FDE",
        "type": "select",
        "proxies": [
            "DIRECT",
            "\u8282\u70B9\u9009\u62E9"
        	]
    	},
        {
        "name": "\u6F0F\u7F51\u4E4B\u9C7C",
        "type": "select",
        "proxies": [
            "\u8282\u70B9\u9009\u62E9",
            "DIRECT",
            "REJECT"
        	]
    	},
    	{
        "name": "\u5168\u7403\u62E6\u622A",
        "type": "select",
        "proxies": [
            "REJECT",
            "\u8282\u70B9\u9009\u62E9"
        	]
    	},
        {
        "name": "\u81EA\u52A8\u9009\u62E9",
        "type": "url-test",
        "url": "https://android.chat.openai.com",
        "interval": "300",
        "lazy": true,
        "icon": "\u{1F601}",
        "proxies": [
            ]
        },
        {
        "name": "\u8F6E\u8BE2\u5747\u8861",
        "type": "load-balance",
        "strategy": "round-robin",
        "url": "https://android.chat.openai.com",
        "interval": "300",
        "lazy": true,
        "proxies": [    
            ]
        },
        {
        "name": "\u54C8\u5E0C\u5747\u8861",
        "type": "load-balance",
        "strategy": "consistent-hashing",
        "url": "https://android.chat.openai.com",
        "interval": "300",
        "lazy": true,
        "proxies": [    
            ]
        },
        {
        "name": "\u7C98\u6027\u5747\u8861",
        "type": "load-balance",
        "strategy": "sticky-sessions",
        "url": "https://android.chat.openai.com",
        "interval": "300",
        "lazy": true,
        "proxies": [    
            ]
        }
    ]

`;
  var post = `


rules:
  - DOMAIN-REGEX,\\b(ads\\.|ad\\.)\\S+,\u5168\u7403\u62E6\u622A
  - DOMAIN-KEYWORD, .ad., \u5168\u7403\u62E6\u622A
  - DOMAIN-KEYWORD, .ads.,\u5168\u7403\u62E6\u622A


  - DOMAIN-KEYWORD,twitter,\u8282\u70B9\u9009\u62E9
  - DOMAIN-KEYWORD,telegra,\u8282\u70B9\u9009\u62E9
  - DOMAIN-KEYWORD,google,\u8282\u70B9\u9009\u62E9
  - DOMAIN-KEYWORD,github,\u8282\u70B9\u9009\u62E9


  - GEOSITE,youtube,\u8282\u70B9\u9009\u62E9
  - GEOIP,telegram,\u8282\u70B9\u9009\u62E9             
  - GEOSITE,bilibili,\u5168\u7403\u76F4\u8FDE
  - GEOSITE,cn,\u5168\u7403\u76F4\u8FDE
  - GEOIP,cn,\u5168\u7403\u76F4\u8FDE
  - GEOSITE,private,DIRECT
  - GEOIP,private,DIRECT,no-resolve

  
  - MATCH,\u6F0F\u7F51\u4E4B\u9C7C

`;

  // src/html.js
  var html = `
PCFET0NUWVBFIGh0bWw+CjxodG1sIGxhbmc9InpoIj4KPGhlYWQ+CiAgICA8bGluayByZWw9ImFwcGxlLXRvdWNoLWljb24iIHNpemVzPSIxODB4MTgwIiBocmVmPSJodHRwczovLzRldmVyZ3I4LmdpdGh1Yi5pby9yZXNvdXJjZXMvaWNvbi5wbmciPgogICAgPGxpbmsgcmVsPSJpY29uIiB0eXBlPSJpbWFnZS9wbmciIHNpemVzPSIzMngzMiIgaHJlZj0iaHR0cHM6Ly80ZXZlcmdyOC5naXRodWIuaW8vcmVzb3VyY2VzL2ljb24ucG5nIj4KICAgIDxsaW5rIHJlbD0iaWNvbiIgdHlwZT0iaW1hZ2UvcG5nIiBzaXplcz0iMTZ4MTYiIGhyZWY9Imh0dHBzOi8vNGV2ZXJncjguZ2l0aHViLmlvL3Jlc291cmNlcy9pY29uLnBuZyI+CiAgICA8bWV0YSBjaGFyc2V0PSJVVEYtOCI+CiAgICA8bWV0YSBuYW1lPSJ2aWV3cG9ydCIgY29udGVudD0id2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEuMCI+CiAgICA8dGl0bGU+Q2xhc2jphY3nva7ono3lkIg8L3RpdGxlPgogICAgPHNjcmlwdCB0eXBlPSJ0ZXh0L2phdmFzY3JpcHQiIHNyYz0iaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvcXJjb2RlanMvMS4wLjAvcXJjb2RlLm1pbi5qcyI+PC9zY3JpcHQ+CiAgICA8c3R5bGU+CgoKCiAgICAgICAgQGltcG9ydCB1cmwoJ2h0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzMj9mYW1pbHk9Tm90bytTYW5zJmZhbWlseT1Ob3RvK1NhbnMrU0M6d2dodEA0MDAmZGlzcGxheT1zd2FwJyk7CiAgICAgICAgI093bkljb24gewogICAgICAgICAgICBmb250LWZhbWlseTogIlBsYXl3cml0ZSBBVSBTQSIsICJaQ09PTCBLdWFpTGUiLCBzZXJpZjsKICAgICAgICAgICAgcG9zaXRpb246IGZpeGVkOyAvKiDlm7rlrprkvY3nva4gKi8KICAgICAgICAgICAgYm90dG9tOiAxMHB4OyAvKiDot53nprvlupXpg6gxMHB4ICovCiAgICAgICAgICAgIGxlZnQ6IDEwcHg7IC8qIOi3neemu+WPs+S+pzEwcHggKi8KICAgICAgICAgICAgd2lkdGg6IDMwcHg7IC8qIOiuvue9ruWuveW6puS4ujMwcHggKi8KICAgICAgICAgICAgaGVpZ2h0OiAzMHB4OyAvKiDorr7nva7pq5jluqbkuLozMHB4ICovCiAgICAgICAgICAgIG1hcmdpbjogMDsgLyog56e76Zmk5aSW6L656LedICovCiAgICAgICAgICAgIHBhZGRpbmc6IDA7IC8qIOenu+mZpOWGhei+uei3nSAqLwogICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDEyMywgMjU1LCAwKTsgLyog5oyJ6ZKu6IOM5pmv6ImyICovCiAgICAgICAgICAgIGJvcmRlcjogbm9uZTsgLyog5Y675o6J6L655qGGICovCiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTsgLyog6K6+572u5Li65ZyG5b2iICovCiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTZweDsgLyog5a2X5L2T5aSn5bCPICovCiAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjsgLyog6byg5qCH5oyH6ZKI5qC35byPICovCiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7IC8qIOS9v+eUqEZsZXhib3jlsYXkuK3lhoXlrrkgKi8KICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjsgLyog5Z6C55u05bGF5LitICovCiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyOyAvKiDmsLTlubPlsYXkuK0gKi8KICAgICAgICAgICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjNzLCBib3gtc2hhZG93IDAuM3MsIHRyYW5zZm9ybSAwLjNzOyAvKiDmt7vliqDov4fmuKHmlYjmnpwgKi8KICAgICAgICB9CgogICAgICAgICNPd25JY29uOmhvdmVyIHsKICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDI1NSwgMjU1LCAyNTUpOyAvKiDmgqzlgZzml7bog4zmma/oibIgKi8KICAgICAgICAgICAgYm94LXNoYWRvdzogMCA0cHggMTVweCByZ2IoMjU1LCAyNTUsIDI1NSk7IC8qIOaCrOWBnOaXtumYtOW9sSAqLwogICAgICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDEuMSk7IC8qIOaCrOWBnOaXtuaUvuWkpyAqLwogICAgICAgIH0KICAgICAgICAjR2l0SHViSWNvbiB7CiAgICAgICAgICAgIGZvbnQtZmFtaWx5OiAiUGxheXdyaXRlIEFVIFNBIiwgIlpDT09MIEt1YWlMZSIsIHNlcmlmOwogICAgICAgICAgICBwb3NpdGlvbjogZml4ZWQ7IC8qIOWbuuWumuS9jee9riAqLwogICAgICAgICAgICBib3R0b206IDEwcHg7IC8qIOi3neemu+W6lemDqDEwcHggKi8KICAgICAgICAgICAgcmlnaHQ6IDEwcHg7IC8qIOi3neemu+WPs+S+pzEwcHggKi8KICAgICAgICAgICAgd2lkdGg6IDMwcHg7IC8qIOiuvue9ruWuveW6puS4ujMwcHggKi8KICAgICAgICAgICAgaGVpZ2h0OiAzMHB4OyAvKiDorr7nva7pq5jluqbkuLozMHB4ICovCiAgICAgICAgICAgIG1hcmdpbjogMDsgLyog56e76Zmk5aSW6L656LedICovCiAgICAgICAgICAgIHBhZGRpbmc6IDA7IC8qIOenu+mZpOWGhei+uei3nSAqLwogICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDA3YmZmOyAvKiDmjInpkq7og4zmma/oibIgKi8KICAgICAgICAgICAgY29sb3I6IHdoaXRlOyAvKiDmjInpkq7lrZfkvZPpopzoibIgKi8KICAgICAgICAgICAgYm9yZGVyOiBub25lOyAvKiDljrvmjonovrnmoYYgKi8KICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogNTAlOyAvKiDorr7nva7kuLrlnIblvaIgKi8KICAgICAgICAgICAgZm9udC1zaXplOiAxNnB4OyAvKiDlrZfkvZPlpKflsI8gKi8KICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyOyAvKiDpvKDmoIfmjIfpkojmoLflvI8gKi8KICAgICAgICAgICAgZGlzcGxheTogZmxleDsgLyog5L2/55SoRmxleGJveOWxheS4reWGheWuuSAqLwogICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyOyAvKiDlnoLnm7TlsYXkuK0gKi8KICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7IC8qIOawtOW5s+WxheS4rSAqLwogICAgICAgICAgICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MsIGJveC1zaGFkb3cgMC4zcywgdHJhbnNmb3JtIDAuM3M7IC8qIOa3u+WKoOi/h+a4oeaViOaenCAqLwogICAgICAgIH0KCiAgICAgICAgI0dpdEh1Ykljb246aG92ZXIgewogICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDA1NmIzOyAvKiDmgqzlgZzml7bog4zmma/oibIgKi8KICAgICAgICAgICAgYm94LXNoYWRvdzogMCA0cHggMTVweCByZ2JhKDAsIDEyMywgMjU1LCAwLjUpOyAvKiDmgqzlgZzml7bpmLTlvbEgKi8KICAgICAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSgxLjEpOyAvKiDmgqzlgZzml7bmlL7lpKcgKi8KICAgICAgICB9CgoKICAgICAgICBpbWd7CiAgICAgICAgICAgIG1heC13aWR0aDogMjU2cHg7CiAgICAgICAgfQogICAgICAgIC5idmFtYmllbnRfcGFydGljbGUKICAgICAgICB7CiAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsKICAgICAgICAgICAgcG9pbnRlci1ldmVudHM6IG5vbmU7CiAgICAgICAgICAgIHRyYW5zaXRpb246IHRvcCBsaW5lYXIsIGxlZnQgbGluZWFyOwoKICAgICAgICB9CgogICAgICAgICNhbWJpZW50IHsKICAgICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjsKICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlOwogICAgICAgICAgICB3aWR0aDogMTAwJTsKICAgICAgICAgICAgaGVpZ2h0OiAxMDB2aDsKICAgICAgICAgICAgei1pbmRleDogLTE7IC8qIOWwhuWFg+e0oOe9ruS6juacgOW6leWxgiAqLwogICAgICAgIH0KICAgICAgICAjcXJjb2RlIHsKCgogICAgICAgICAgICBkaXNwbGF5OiBibG9jazsgLyog56Gu5L+d5piv5Z2X57qn5YWD57SgICovCiAgICAgICAgICAgIG1hcmdpbjogMjBweCBhdXRvOyAvKiDlsYXkuK3mmL7npLogKi8KICAgICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjsgLyog6Ziy5q2i5YaF5a655rqi5Ye6ICovCiAgICAgICAgfQoKICAgICAgICAqIHsKICAgICAgICAgICAgbWFyZ2luOiAwOwogICAgICAgICAgICBwYWRkaW5nOiAwOwogICAgICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiDkvb/lrr3luqblkozpq5jluqborqHnrpfljIXmi6zlhoXovrnot50gKi8KICAgICAgICB9CgogICAgICAgIGJvZHkgewogICAgICAgICAgICBmb250LWZhbWlseTogIk5vdG8gU2FucyIsICJOb3RvIFNhbnMgU0MiLCBzZXJpZjsKICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7CiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7CiAgICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47CiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7IC8qIOawtOW5s+WxheS4rSAqLwogICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjsgLyog5Z6C55u05bGF5LitICovCiAgICAgICAgICAgIGhlaWdodDogMTAwdmg7IC8qIOinhuWPo+mrmOW6piAqLwogICAgICAgICAgICBtYXJnaW46IDA7IC8qIOWOu+aOiem7mOiupOeahOi+uei3nSAqLwoKICAgICAgICB9CgoKICAgICAgICBoMSB7CiAgICAgICAgICAgIGZvbnQtc2l6ZTogMzBweDsKICAgICAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyOyAvKiDmoIfpopjlsYXkuK0gKi8KICAgICAgICAgICAgY29sb3I6IGJsYWNrOyAvKiDlrZfkvZPpopzoibIgKi8KICAgICAgICAgICAgbWFyZ2luOiAxMHB4OyAvKiDovrnot50gKi8KICAgICAgICB9CgogICAgICAgIGgyIHsKICAgICAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyOyAvKiDmoIfpopjlsYXkuK0gKi8KICAgICAgICAgICAgY29sb3I6IGJsYWNrOyAvKiDlrZfkvZPpopzoibIgKi8KICAgICAgICAgICAgbWFyZ2luOiAxMHB4OyAvKiDovrnot50gKi8KICAgICAgICB9CgogICAgICAgIGgzIHsKICAgICAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyOyAvKiDmoIfpopjlsYXkuK0gKi8KICAgICAgICAgICAgY29sb3I6IGJsYWNrOyAvKiDlrZfkvZPpopzoibIgKi8KICAgICAgICAgICAgbWFyZ2luOiAxMHB4OyAvKiDovrnot50gKi8KICAgICAgICB9CgoKICAgICAgICAuaW5wdXQtZ3JvdXAgewogICAgICAgICAgICBkaXNwbGF5OiBmbGV4OyAvKiDkvb/nlKjlvLnmgKfluIPlsYAgKi8KICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7IC8qIOWxheS4reWvuem9kCAqLwogICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAyMHB4OyAvKiDkuIvovrnot50gKi8KICAgICAgICB9CgogICAgICAgIGxhYmVsIHsKICAgICAgICAgICAgZm9udC1zaXplOiAxOHB4OyAvKiDmoIfnrb7lrZfkvZPlpKflsI8gKi8KICAgICAgICAgICAgbWFyZ2luOiAxMHB4OyAvKiDovrnot50gKi8KICAgICAgICAgICAgYWxpZ24tc2VsZjogY2VudGVyOyAvKiDlnoLnm7TlsYXkuK0gKi8KICAgICAgICB9CgoKICAgICAgICBpbnB1dFt0eXBlPSJ0ZXh0Il0gewogICAgICAgICAgICBtYXJnaW46IDEwcHg7IC8qIOavj+S4quaMiemSruWRqOWbtOaciTEwcHjnmoTpl7Tot50gKi8KICAgICAgICAgICAgcGFkZGluZzogMTBweDsgLyog5YaF6L656LedICovCiAgICAgICAgICAgIGJvcmRlcjogMnB4IHNvbGlkICMwMDdiZmY7IC8qIOi+ueahhuminOiJsiAqLwogICAgICAgICAgICBib3JkZXItcmFkaXVzOiAxMHB4OyAvKiDlnIbop5IgKi8KICAgICAgICAgICAgZm9udC1zaXplOiAxNnB4OyAvKiDlrZfkvZPlpKflsI8gKi8KICAgICAgICAgICAgd2lkdGg6IDIwMHB4OyAvKiDovpPlhaXmoYblrr3luqYgKi8KICAgICAgICAgICAgdHJhbnNpdGlvbjogYm9yZGVyLWNvbG9yIDAuM3MsIGJveC1zaGFkb3cgMC4zcywgdHJhbnNmb3JtIDAuM3M7IC8qIOa3u+WKoOi/h+a4oeaViOaenCAqLwogICAgICAgIH0KCiAgICAgICAgaW5wdXRbdHlwZT0idGV4dCJdOmZvY3VzIHsKICAgICAgICAgICAgYm9yZGVyLWNvbG9yOiAjMDA1NmIzOyAvKiDogZrnhKbml7bovrnmoYbpopzoibIgKi8KICAgICAgICAgICAgb3V0bGluZTogbm9uZTsgLyog5Y675o6J6buY6K6k55qE6L2u5buTICovCiAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgMCA1cHggcmdiYSgwLCAxMjMsIDI1NSwgMC41KTsgLyog6IGa54Sm5pe26Zi05b2xICovCiAgICAgICAgfQoKICAgICAgICBpbnB1dFt0eXBlPSJ0ZXh0Il06aG92ZXIgewogICAgICAgICAgICBib3gtc2hhZG93OiAwIDRweCAxNXB4IHJnYmEoMCwgMTIzLCAyNTUsIDAuNSk7IC8qIOaCrOWBnOaXtumYtOW9sSAqLwogICAgICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDEuMSk7IC8qIOaCrOWBnOaXtuS4iuenuyAqLwogICAgICAgIH0KCiAgICAgICAgYnV0dG9uIHsKICAgICAgICAgICAgZm9udC1mYW1pbHk6ICJaQ09PTCBLdWFpTGUiLCBzZXJpZjsKICAgICAgICAgICAgbWFyZ2luOiAxMHB4OyAvKiDmr4/kuKrmjInpkq7lkajlm7TmnIkxMHB455qE6Ze06LedICovCiAgICAgICAgICAgIHBhZGRpbmc6IDEwcHggMTVweDsgLyog5YaF6L656LedICovCiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICMwMDdiZmY7IC8qIOaMiemSruiDjOaZr+iJsiAqLwogICAgICAgICAgICBjb2xvcjogd2hpdGU7IC8qIOaMiemSruWtl+S9k+minOiJsiAqLwogICAgICAgICAgICBib3JkZXI6IG5vbmU7IC8qIOWOu+aOiei+ueahhiAqLwogICAgICAgICAgICBib3JkZXItcmFkaXVzOiAxMHB4OyAvKiDlnIbop5IgKi8KICAgICAgICAgICAgZm9udC1zaXplOiAxNnB4OyAvKiDlrZfkvZPlpKflsI8gKi8KICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyOyAvKiDpvKDmoIfmjIfpkojmoLflvI8gKi8KICAgICAgICAgICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjNzLCBib3gtc2hhZG93IDAuM3MsIHRyYW5zZm9ybSAwLjNzOyAvKiDmt7vliqDov4fmuKHmlYjmnpwgKi8KICAgICAgICB9CgogICAgICAgIGJ1dHRvbjpob3ZlciB7CiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICMwMDU2YjM7IC8qIOaCrOWBnOaXtuiDjOaZr+iJsiAqLwogICAgICAgICAgICBib3gtc2hhZG93OiAwIDRweCAxNXB4IHJnYmEoMCwgMTIzLCAyNTUsIDAuNSk7IC8qIOaCrOWBnOaXtumYtOW9sSAqLwogICAgICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDEuMSk7IC8qIOaCrOWBnOaXtuaUvuWkpyAqLwogICAgICAgIH0KCgogICAgICAgIC5jYXJkLWJhY2sgewoKICAgICAgICAgICAgcGFkZGluZzogMjBweDsgLyog5YaF6L656LedICovCiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7CiAgICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47CiAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgNHB4IDE1cHggcmdiYSgwLCAwLCAwLCAwLjIpOyAvKiDpmLTlvbHmlYjmnpwgKi8KICAgICAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyOyAvKiDmlofmnKzlsYXkuK0gKi8KICAgICAgICAgICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KHRvIHJpZ2h0LCByZ2JhKDUwLCA1MCwgNTAsIDEpLCByZ2JhKDIxMSwgMjExLCAyMTEsIDEpKTsgLyog5pu05reh55qE6buR5Yiw5rWF54Gw55qE5riQ5Y+YICovCgoKICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMTVweDsKICAgICAgICAgICAgYm9yZGVyOiAycHggc29saWQgIzAwN2JmZjsgLyog6L655qGG6aKc6ImyICovCiAgICAgICAgfQoKCiAgICA8L3N0eWxlPgoKPC9oZWFkPgo8Ym9keT4KPGRpdiBpZD0iYW1iaWVudCI+PC9kaXY+Cgo8c2NyaXB0PgogICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCgpCVkFtYmllbnQgLSBWYW5pbGxhSlMgUGFydGljbGUgQmFja2dyb3VuZApodHRwczovL2Jtc3ZpZWlyYS5naXRodWIuaW8vQlZBbWJpZW50LwoKTWFkZSBieTogQnJ1bm8gVmllaXJhCgotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi8KCiAgICB2YXIgaXNQYXVzZWQgPSBmYWxzZTsKCiAgICBjbGFzcyBCVkFtYmllbnQgewoKICAgICAgICBjb25zdHJ1Y3Rvcih7CiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yID0gJ2RlZmF1bHRJZCcsCiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlX251bWJlciA9ICI1MCIsCiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlX21heHdpZHRoID0gIjMwIiwKICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGVfbWlud2lkdGggPSAiNSIsCiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlX3JhZGl1cyA9ICI1MCIsCiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlX29wYWNpdHkgPSB0cnVlLAogICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZV9jb2xpc2lvbl9jaGFuZ2UgPSB0cnVlLAogICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZV9iYWNrZ3JvdW5kID0gIiNlZGVkZWQiLAogICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZV9pbWFnZSA9IHsKICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlOiBmYWxzZSwKICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyYzogIiIKICAgICAgICAgICAgICAgICAgICAgICAgfSwKICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2l2ZSA9IFsKICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiAiZGVmYXVsdCIKICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgICAgICAgICAgXSwKICAgICAgICAgICAgICAgICAgICAgICAgZnBzID0gIjYwIiwKICAgICAgICAgICAgICAgICAgICAgICAgbWF4X3RyYW5zaXRpb25fc3BlZWQgPSAxMjAwMCwKICAgICAgICAgICAgICAgICAgICAgICAgbWluX3RyYW5zaXRpb25fc3BlZWQgPSA4MDAwLAogICAgICAgICAgICAgICAgICAgICAgICByZWZyZXNoX29uZm9jdXMgPSB0cnVlCiAgICAgICAgICAgICAgICAgICAgfSkKICAgICAgICB7CiAgICAgICAgICAgIC8vIERlZmluZSBWYXJpYWJsZXMKICAgICAgICAgICAgdGhpcy5zZWxlY3RvciA9IHNlbGVjdG9yLnN1YnN0cmluZygxKTsKICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZV9udW1iZXIgPSBwYXJ0aWNsZV9udW1iZXI7CiAgICAgICAgICAgIHRoaXMuZnBzID0gZnBzOwogICAgICAgICAgICB0aGlzLm1heF90cmFuc2l0aW9uX3NwZWVkID0gbWF4X3RyYW5zaXRpb25fc3BlZWQsCiAgICAgICAgICAgICAgICB0aGlzLm1pbl90cmFuc2l0aW9uX3NwZWVkID0gbWluX3RyYW5zaXRpb25fc3BlZWQsCiAgICAgICAgICAgICAgICB0aGlzLnBhcnRpY2xlX21heHdpZHRoID0gcGFydGljbGVfbWF4d2lkdGg7CiAgICAgICAgICAgIHRoaXMucGFydGljbGVfbWlud2lkdGggPSBwYXJ0aWNsZV9taW53aWR0aDsKICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZV9yYWRpdXMgPSBwYXJ0aWNsZV9yYWRpdXM7CiAgICAgICAgICAgIHRoaXMucGFydGljbGVfY29saXNpb25fY2hhbmdlID0gcGFydGljbGVfY29saXNpb25fY2hhbmdlOwogICAgICAgICAgICB0aGlzLnBhcnRpY2xlX2JhY2tncm91bmQgPSBwYXJ0aWNsZV9iYWNrZ3JvdW5kOwogICAgICAgICAgICB0aGlzLnBhcnRpY2xlX2ltYWdlID0gcGFydGljbGVfaW1hZ2U7CiAgICAgICAgICAgIHRoaXMucmVzcG9uc2l2ZSA9IHJlc3BvbnNpdmU7CiAgICAgICAgICAgIHRoaXMucGFydGljbGVfb3BhY2l0eSA9IHBhcnRpY2xlX29wYWNpdHk7CiAgICAgICAgICAgIHRoaXMucmVmcmVzaF9vbmZvY3VzID0gcmVmcmVzaF9vbmZvY3VzOwoKICAgICAgICAgICAgLy8gR2xvYmFsIFZhcmlhYmxlcwogICAgICAgICAgICB2YXIgcmFuZG9tSUQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoOTk5OSAtIDAgKyAxKSkgKyAwOwogICAgICAgICAgICB2YXIgc2VsZWN0b3IgPSB0aGlzLnNlbGVjdG9yOwogICAgICAgICAgICB2YXIgZnBzID0gdGhpcy5mcHM7CiAgICAgICAgICAgIHZhciBpc1BsYXlpbmcgPSB0cnVlOwogICAgICAgICAgICB2YXIgcGFydGljbGVfbWF4d2lkdGggPSB0aGlzLnBhcnRpY2xlX21heHdpZHRoOwogICAgICAgICAgICB2YXIgcGFydGljbGVfbWlud2lkdGggPSB0aGlzLnBhcnRpY2xlX21pbndpZHRoOwogICAgICAgICAgICB2YXIgcGFydGljbGVfcmFkaXVzID0gdGhpcy5wYXJ0aWNsZV9yYWRpdXM7CiAgICAgICAgICAgIHZhciBwYXJ0aWNsZV9jb2xpc2lvbl9jaGFuZ2UgPSB0aGlzLnBhcnRpY2xlX2NvbGlzaW9uX2NoYW5nZTsKICAgICAgICAgICAgdmFyIHBhcnRpY2xlX2JhY2tncm91bmQgPSB0aGlzLnBhcnRpY2xlX2JhY2tncm91bmQ7CiAgICAgICAgICAgIHZhciBwYXJ0aWNsZV9pbWFnZSA9IHRoaXMucGFydGljbGVfaW1hZ2U7CiAgICAgICAgICAgIHZhciByZXNwb25zaXZlID0gdGhpcy5yZXNwb25zaXZlOwogICAgICAgICAgICB2YXIgcGFydGljbGVfb3BhY2l0eSA9IHRoaXMucGFydGljbGVfb3BhY2l0eTsKICAgICAgICAgICAgdmFyIHRyYWlsX2NvdW50ID0gMDsKICAgICAgICAgICAgdmFyIG1heF90cmFuc2l0aW9uX3NwZWVkID0gdGhpcy5tYXhfdHJhbnNpdGlvbl9zcGVlZDsKICAgICAgICAgICAgdmFyIG1pbl90cmFuc2l0aW9uX3NwZWVkID0gdGhpcy5taW5fdHJhbnNpdGlvbl9zcGVlZDsKICAgICAgICAgICAgdmFyIHJlZnJlc2hfb25mb2N1cyA9IHRoaXMucmVmcmVzaF9vbmZvY3VzOwoKICAgICAgICAgICAgdmFyIHBhcnRpY2xlX3hfcmF5ID0gW107CgogICAgICAgICAgICAvLyBBZGQgbW92ZW1lbnQgdG8gcGFydGljbGUKICAgICAgICAgICAgdGhpcy5Nb3ZlUGFydGljbGUgPSBmdW5jdGlvbihlbGVtZW50KSB7CgogICAgICAgICAgICAgICAgdmFyIGlzcmVzdGluZyA9IDE7CgogICAgICAgICAgICAgICAgLy8gTW92aW5nIERpcmVjdGlvbnMKICAgICAgICAgICAgICAgIHZhciB0b3BfZG93biA9IFsndG9wJywgImRvd24iXTsKICAgICAgICAgICAgICAgIHZhciBsZWZ0X3JpZ2h0ID0gWyJsZWZ0IiwgInJpZ2h0Il07CgogICAgICAgICAgICAgICAgLy8gUmFuZG9tIHZhbHVlIHRvIGRlY2lkZSB3aWNoIGRpcmVjdGlvbiBmb2xsb3cKICAgICAgICAgICAgICAgIHZhciBkaXJlY3Rpb25faCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICgxIC0gMCArIDEpKSArIDA7CiAgICAgICAgICAgICAgICB2YXIgZGlyZWN0aW9uX3YgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoMSAtIDAgKyAxKSkgKyAwOwoKICAgICAgICAgICAgICAgIC8vIERpcmVjdGlvbgogICAgICAgICAgICAgICAgdmFyIGRfaCA9IGxlZnRfcmlnaHRbZGlyZWN0aW9uX2hdOwogICAgICAgICAgICAgICAgdmFyIGRfdiA9IHRvcF9kb3duW2RpcmVjdGlvbl92XTsKCiAgICAgICAgICAgICAgICB2YXIgcG9zID0gMCwgdmVyID0gMCwgZWxlbWVudF93aWR0aCA9IGVsZW1lbnQub2Zmc2V0V2lkdGg7CiAgICAgICAgICAgICAgICB2YXIgcmVjdF9tYWluID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc2VsZWN0b3IpOwoKICAgICAgICAgICAgICAgIC8vIENoYW5nZSBwYXJ0aWNsZSBzaXplCiAgICAgICAgICAgICAgICBmdW5jdGlvbiBDaGFuZ2VQYXJ0aWNsZShwYXJ0aWNsZSkKICAgICAgICAgICAgICAgIHsKCiAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgcmFuZG9tIGNvbG9yIGlzIGVuYWJsZWQsIGNoYW5nZSBwYXJ0aWNsZSBjb2xvciB3aGVuIGNvbGlkZXMKICAgICAgICAgICAgICAgICAgICBpZihwYXJ0aWNsZV9iYWNrZ3JvdW5kID09ICJyYW5kb20iKSB7IHBhcnRpY2xlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGdldFJhbmRvbUNvbG9yKCk7IH0KCiAgICAgICAgICAgICAgICAgICAgLy8gR2V0IHJhbmRvbSBudW1iZXIgYmFzZWQgb24gdGhlIHdpZHRoIGFuZCBoZWlnaHQgb2YgbWFpbiBkaXYKICAgICAgICAgICAgICAgICAgICB2YXIgUmFuZG9tV2lkdGggPSBNYXRoLnJhbmRvbSgpICogKHBhcnRpY2xlX21heHdpZHRoIC0gcGFydGljbGVfbWlud2lkdGgpICsgcGFydGljbGVfbWlud2lkdGg7CiAgICAgICAgICAgICAgICAgICAgcGFydGljbGUuc3R5bGUud2lkdGggPSBSYW5kb21XaWR0aCsicHgiOwogICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnN0eWxlLmhlaWdodCA9IFJhbmRvbVdpZHRoKyJweCI7CgogICAgICAgICAgICAgICAgfQoKICAgICAgICAgICAgICAgIC8vIFNldCBmcmFtZSB0byBtb3ZlIHBhcnRpY2xlCiAgICAgICAgICAgICAgICBmdW5jdGlvbiBTZXRGcmFtZSgpIHsKCiAgICAgICAgICAgICAgICAgICAgaWYgKGlzUGxheWluZykgc2V0VGltZW91dChTZXRGcmFtZSwgMTAwMCAvIGZwcyk7CgogICAgICAgICAgICAgICAgICAgIC8vIEVsZW1lbnQgb2Zmc2V0IHBvc2l0aW9uaW5nCiAgICAgICAgICAgICAgICAgICAgcG9zID0gZWxlbWVudC5vZmZzZXRUb3A7CiAgICAgICAgICAgICAgICAgICAgdmVyID0gZWxlbWVudC5vZmZzZXRMZWZ0OwoKICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBjb2xpc2lvbiBib3VuZHMKICAgICAgICAgICAgICAgICAgICBpZihwb3MgPT0gcmVjdF9tYWluLm9mZnNldEhlaWdodC1lbGVtZW50X3dpZHRoKSB7CiAgICAgICAgICAgICAgICAgICAgICAgIGRfdiA9ICJ0b3AiOwogICAgICAgICAgICAgICAgICAgICAgICBwb3MgPSByZWN0X21haW4ub2Zmc2V0SGVpZ2h0LWVsZW1lbnRfd2lkdGg7CiAgICAgICAgICAgICAgICAgICAgICAgIGlzcmVzdGluZyA9IDE7CiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHBhcnRpY2xlX2NvbGlzaW9uX2NoYW5nZSA9PSB0cnVlKSB7IENoYW5nZVBhcnRpY2xlKGVsZW1lbnQpOyB9IC8vIENoYW5nZSBQYXJ0aWNsZSBTaXplIG9uIGNvbGlzaW9uCiAgICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgICAgIGlmKHBvcyA8PSAwKXsKICAgICAgICAgICAgICAgICAgICAgICAgZF92ID0gImRvd24iOwogICAgICAgICAgICAgICAgICAgICAgICBwb3MgPSAwOwogICAgICAgICAgICAgICAgICAgICAgICBpc3Jlc3RpbmcgPSAxOwogICAgICAgICAgICAgICAgICAgICAgICBpZihwYXJ0aWNsZV9jb2xpc2lvbl9jaGFuZ2UgPT0gdHJ1ZSkgeyBDaGFuZ2VQYXJ0aWNsZShlbGVtZW50KTsgfSAvLyBDaGFuZ2UgUGFydGljbGUgU2l6ZSBvbiBjb2xpc2lvbgogICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgICAgICBpZih2ZXIgPT0gcmVjdF9tYWluLm9mZnNldFdpZHRoLWVsZW1lbnRfd2lkdGgpewogICAgICAgICAgICAgICAgICAgICAgICBkX2ggPSAibGVmdCI7CiAgICAgICAgICAgICAgICAgICAgICAgIHZlciA9IHJlY3RfbWFpbi5vZmZzZXRXaWR0aC1lbGVtZW50X3dpZHRoOwogICAgICAgICAgICAgICAgICAgICAgICBpc3Jlc3RpbmcgPSAxOwogICAgICAgICAgICAgICAgICAgICAgICBpZihwYXJ0aWNsZV9jb2xpc2lvbl9jaGFuZ2UgPT0gdHJ1ZSkgeyBDaGFuZ2VQYXJ0aWNsZShlbGVtZW50KTsgfSAvLyBDaGFuZ2UgUGFydGljbGUgU2l6ZSBvbiBjb2xpc2lvbgogICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgICAgICBpZih2ZXIgPD0gMCl7CiAgICAgICAgICAgICAgICAgICAgICAgIGRfaCA9ICJyaWdodCI7CiAgICAgICAgICAgICAgICAgICAgICAgIHZlciA9IDA7CiAgICAgICAgICAgICAgICAgICAgICAgIGlzcmVzdGluZyA9IDE7CiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHBhcnRpY2xlX2NvbGlzaW9uX2NoYW5nZSA9PSB0cnVlKSB7IENoYW5nZVBhcnRpY2xlKGVsZW1lbnQpOyB9IC8vIENoYW5nZSBQYXJ0aWNsZSBTaXplIG9uIGNvbGlzaW9uCiAgICAgICAgICAgICAgICAgICAgfQoKICAgICAgICAgICAgICAgICAgICAvLyBJdCB3b24gYWRkIGFub3RoZXIgcG9zaXRpb24gdW50aWwgdGhlIGVuZCBvZiB0cmFuc2l0aW9uCiAgICAgICAgICAgICAgICAgICAgaWYoaXNyZXN0aW5nID09IDEpCiAgICAgICAgICAgICAgICAgICAgewoKICAgICAgICAgICAgICAgICAgICAgICAgdmFyIFJhbmRvbVRyYW5zaXRpb25UaW1lID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heF90cmFuc2l0aW9uX3NwZWVkIC0gbWluX3RyYW5zaXRpb25fc3BlZWQgKyAxKSkgKyBtaW5fdHJhbnNpdGlvbl9zcGVlZDsKICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBSYW5kb21UcmFuc2l0aW9uVGltZSsibXMiOwoKICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgUG9zaXRpb24KICAgICAgICAgICAgICAgICAgICAgICAgaWYoZF92ID09ICJkb3duIiAmJiBkX2ggPT0gJ2xlZnQnKQogICAgICAgICAgICAgICAgICAgICAgICB7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLmxlZnQgPSBOdW1iZXIoZWxlbWVudC5vZmZzZXRMZWZ0KSAtIE51bWJlcigzMDApICsgInB4IjsKICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUudG9wID0gcmVjdF9tYWluLm9mZnNldEhlaWdodC1OdW1iZXIoZWxlbWVudF93aWR0aCkgKyAicHgiOwogICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNyZXN0aW5nID0gMDsKICAgICAgICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgICAgICAgICBpZihkX3YgPT0gImRvd24iICYmIGRfaCA9PSAncmlnaHQnKQogICAgICAgICAgICAgICAgICAgICAgICB7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLmxlZnQgPSBOdW1iZXIoZWxlbWVudC5vZmZzZXRMZWZ0KSArIE51bWJlcigzMDApICsgInB4IjsKICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUudG9wID0gcmVjdF9tYWluLm9mZnNldEhlaWdodC1OdW1iZXIoZWxlbWVudF93aWR0aCkgKyAicHgiOwogICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNyZXN0aW5nID0gMDsKCiAgICAgICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgICAgICAgICAgaWYoZF92ID09ICJ0b3AiICYmIGRfaCA9PSAnbGVmdCcpCiAgICAgICAgICAgICAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUubGVmdCA9IE51bWJlcihlbGVtZW50Lm9mZnNldExlZnQpLU51bWJlcihlbGVtZW50X3dpZHRoKSAtIE51bWJlcigzMDApICsgInB4IjsKICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUudG9wID0gIjBweCI7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc3Jlc3RpbmcgPSAwOwoKICAgICAgICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgICAgICAgICBpZihkX3YgPT0gInRvcCIgJiYgZF9oID09ICdyaWdodCcpCiAgICAgICAgICAgICAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUubGVmdCA9IE51bWJlcihlbGVtZW50Lm9mZnNldExlZnQpLU51bWJlcihlbGVtZW50X3dpZHRoKSArIE51bWJlcigzMDApICsgInB4IjsKICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUudG9wID0gIjBweCI7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc3Jlc3RpbmcgPSAwOwogICAgICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICAgICAgfQoKICAgICAgICAgICAgICAgICAgICAvLyBTYXZlcyBwYXJ0aWNsZSBwb3NpdGlvbiB0byBhcnJheQogICAgICAgICAgICAgICAgICAgIGlmKGVsZW1lbnQub2Zmc2V0TGVmdCAhPSAwICYmIGVsZW1lbnQub2Zmc2V0VG9wICE9IDApIHsgcGFydGljbGVfeF9yYXlbZWxlbWVudC5pZF0gPSAoeydpZCc6IGVsZW1lbnQuaWQsICd4JzogZWxlbWVudC5vZmZzZXRMZWZ0LCAneSc6IGVsZW1lbnQub2Zmc2V0VG9wfSk7IH0KCiAgICAgICAgICAgICAgICB9CgogICAgICAgICAgICAgICAgLy8gQ2FsbCBmdW5jdGlvbiBmb3IgdGhlIGZpcnN0IHRpbWUKICAgICAgICAgICAgICAgIFNldEZyYW1lKCk7CiAgICAgICAgICAgIH07CgogICAgICAgICAgICAvLyBTZXQgdXAgcGFydGljbGVzIHRvIHNlbGVjdG9yIGRpdgogICAgICAgICAgICB0aGlzLlNldHVwUGFydGljbGVzID0gZnVuY3Rpb24obnVtYmVyKSB7CgogICAgICAgICAgICAgICAgdmFyIHJlc3BfcGFydGljbGVzOwogICAgICAgICAgICAgICAgcGFydGljbGVfeF9yYXkgPSBbXTsKCiAgICAgICAgICAgICAgICAvLyBHZXQgd2luZG93IHZpZXdwb3J0IGlubmVyIHdpZHRoCiAgICAgICAgICAgICAgICB2YXIgd2luZG93Vmlld3BvcnRXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoOwoKICAgICAgICAgICAgICAgIC8vIElmIGZ1bmN0aW9ucyBicmluZ3Mgbm8gbnVtYmVyLCBpdCBmb2xsb3cgdGhlIGRlZmF1bHQKICAgICAgICAgICAgICAgIGlmKG51bWJlciA9PSB1bmRlZmluZWQpCiAgICAgICAgICAgICAgICB7CgogICAgICAgICAgICAgICAgICAgIC8vIExvb3AgcmVzcG9uc2l2ZSBvYmplY3QgdG8gZ2V0IGN1cnJlbnQgdmlld3BvcnQKICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBsb29wID0gMDsgbG9vcCA8IHJlc3BvbnNpdmUubGVuZ3RoOyBsb29wKyspIHsKICAgICAgICAgICAgICAgICAgICAgICAgaWYocmVzcG9uc2l2ZVtsb29wXS5icmVha3BvaW50ID49IHdpbmRvd1ZpZXdwb3J0V2lkdGgpIHsgcmVzcF9wYXJ0aWNsZXMgPSByZXNwb25zaXZlW2xvb3BdWyJzZXR0aW5ncyJdLnBhcnRpY2xlX251bWJlcjsgfQogICAgICAgICAgICAgICAgICAgIH0KCiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlcmUgaXMgbm8gcmVzdWx0IGZyb20gYWJvdmUsIGRlZmF1bHQgcGFydGljbGVzIGFyZSBhcHBsaWVkCiAgICAgICAgICAgICAgICAgICAgaWYocmVzcF9wYXJ0aWNsZXMgPT0gdW5kZWZpbmVkKSB7IHJlc3BfcGFydGljbGVzID0gdGhpcy5wYXJ0aWNsZV9udW1iZXI7IH0KCiAgICAgICAgICAgICAgICB9IGVsc2UgewogICAgICAgICAgICAgICAgICAgIHJlc3BfcGFydGljbGVzID0gbnVtYmVyOwogICAgICAgICAgICAgICAgfQoKICAgICAgICAgICAgICAgIC8vIEFkZCBudW1iZXIgb2YgcGFydGljbGVzIHRvIHNlbGVjdG9yIGRpdgogICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gcmVzcF9wYXJ0aWNsZXM7IGkrKykgewoKICAgICAgICAgICAgICAgICAgICAvLyBHZW5lcmF0ZSByYW5kb20gbnVtYmVyIHRvIHBhcnRpY2xlcwogICAgICAgICAgICAgICAgICAgIHZhciByYW5kb21faWRfcGFydGljbGUgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoOTk5OSAtIDAgKyAxKSkgKyAwOwoKICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiBpbWFnZSBzb3VyY2UgaXMgZW1wdHkgYW5kIGFwcGVuZCBwYXJ0aWNsZSB0byBtYWluIGRpdgogICAgICAgICAgICAgICAgICAgIGlmKHRoaXMucGFydGljbGVfaW1hZ2VbJ2ltYWdlJ10gPT0gZmFsc2UpCiAgICAgICAgICAgICAgICAgICAgewogICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnNlbGVjdG9yKS5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsICI8ZGl2IGlkPSdidnBhcnRpY2xlXyIrcmFuZG9tX2lkX3BhcnRpY2xlKyInIGNsYXNzPSdidmFtYmllbnRfcGFydGljbGUnIHN0eWxlPSdkaXNwbGF5OiBibG9jazsnPjwvZGl2PiIpOwogICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7CiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuc2VsZWN0b3IpLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgIjxpbWcgc3JjPSciK3RoaXMucGFydGljbGVfaW1hZ2VbJ3NyYyddKyInIGlkPSdidnBhcnRpY2xlXyIrcmFuZG9tX2lkX3BhcnRpY2xlKyInIGNsYXNzPSdidmFtYmllbnRfcGFydGljbGUnIHN0eWxlPSdkaXNwbGF5OiBibG9jazsnPiIpOwogICAgICAgICAgICAgICAgICAgIH0KCiAgICAgICAgICAgICAgICAgICAgdmFyIGJ2cGFydGljbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiYnZwYXJ0aWNsZV8iK3JhbmRvbV9pZF9wYXJ0aWNsZSk7CgogICAgICAgICAgICAgICAgICAgIC8vIEFkZAogICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlX3hfcmF5LnB1c2goImJ2cGFydGljbGVfIityYW5kb21faWRfcGFydGljbGUpOwoKICAgICAgICAgICAgICAgICAgICAvLyBHZXQgV2lkdGggYW5kIEhlaWdodCBvZiBtYWluIGRpdgogICAgICAgICAgICAgICAgICAgIHZhciB3aWR0aE1haW5EaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzZWxlY3Rvcik7CgogICAgICAgICAgICAgICAgICAgIC8vIEdldCByYW5kb20gbnVtYmVyIGJhc2VkIG9uIHRoZSB3aWR0aCBhbmQgaGVpZ2h0IG9mIG1haW4gZGl2CiAgICAgICAgICAgICAgICAgICAgdmFyIFJhbmRvbVRvcFBvc2l0aW9uID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKHdpZHRoTWFpbkRpdi5vZmZzZXRIZWlnaHQgLSA0MCArIDEpKSArIDA7CiAgICAgICAgICAgICAgICAgICAgdmFyIFJhbmRvbUxlZnRQb3NpdGlvbiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICh3aWR0aE1haW5EaXYub2Zmc2V0V2lkdGggLSAxMDAgKyAxKSkgKyAwOwoKICAgICAgICAgICAgICAgICAgICAvLyBHZXQgcmFuZG9tIG51bWJlciBiYXNlZCBvbiB0aGUgd2lkdGggYW5kIGhlaWdodCBvZiBtYWluIGRpdgogICAgICAgICAgICAgICAgICAgIHZhciBSYW5kb21XaWR0aCA9IE1hdGgucmFuZG9tKCkgKiAodGhpcy5wYXJ0aWNsZV9tYXh3aWR0aCAtIHRoaXMucGFydGljbGVfbWlud2lkdGgpICsgdGhpcy5wYXJ0aWNsZV9taW53aWR0aDsKCiAgICAgICAgICAgICAgICAgICAgLy8gR2V0IFJhbmRvbSBPcGFjaXR5IGJldHdlZW4gMC4yIGFuZCAxIGlmIGFjdGl2ZQogICAgICAgICAgICAgICAgICAgIGlmKHBhcnRpY2xlX29wYWNpdHkgPT0gdHJ1ZSkgeyB2YXIgUmFuZG9tT3BhY2l0eSA9IE1hdGgucmFuZG9tKCkgKiAoMSAtIDAuMikgKyAwLjI7IH0gZWxzZSB7IHZhciBSYW5kb21PcGFjaXR5ID0gMTsgfQoKICAgICAgICAgICAgICAgICAgICAvLyBBZGQgcmFuZG9tIHBvc2l0aW9uaW5nIHRvIHBhcnRpY2xlCiAgICAgICAgICAgICAgICAgICAgYnZwYXJ0aWNsZS5zdHlsZS50b3AgPSBSYW5kb21Ub3BQb3NpdGlvbisicHgiOwogICAgICAgICAgICAgICAgICAgIGJ2cGFydGljbGUuc3R5bGUubGVmdCA9IFJhbmRvbUxlZnRQb3NpdGlvbisicHgiOwogICAgICAgICAgICAgICAgICAgIGJ2cGFydGljbGUuc3R5bGUud2lkdGggPSBSYW5kb21XaWR0aCsicHgiOwogICAgICAgICAgICAgICAgICAgIGJ2cGFydGljbGUuc3R5bGUuaGVpZ2h0ID0gUmFuZG9tV2lkdGgrInB4IjsKICAgICAgICAgICAgICAgICAgICBidnBhcnRpY2xlLnN0eWxlLm9wYWNpdHkgPSBSYW5kb21PcGFjaXR5OwogICAgICAgICAgICAgICAgICAgIGJ2cGFydGljbGUuc3R5bGUuYm9yZGVyUmFkaXVzID0gcGFydGljbGVfcmFkaXVzKyJweCI7CgogICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIGl0IGhhcyByYW5kb20gY29sb3IgZW5hYmxlZAogICAgICAgICAgICAgICAgICAgIGlmKHBhcnRpY2xlX2JhY2tncm91bmQgPT0gInJhbmRvbSIpIHsgYnZwYXJ0aWNsZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBnZXRSYW5kb21Db2xvcigpOyB9IGVsc2UgeyBidnBhcnRpY2xlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHBhcnRpY2xlX2JhY2tncm91bmQ7IH0KCiAgICAgICAgICAgICAgICAgICAgLy8gTW92ZSBwYXJ0aWNsZQogICAgICAgICAgICAgICAgICAgIHRoaXMuTW92ZVBhcnRpY2xlKGJ2cGFydGljbGUpOwogICAgICAgICAgICAgICAgfQogICAgICAgICAgICB9CgogICAgICAgICAgICAvLyAqKiBTRVRVUCBTTElERSAqKgogICAgICAgICAgICB0aGlzLlNldHVwUGFydGljbGVzKCk7CgogICAgICAgICAgICBpZihyZWZyZXNoX29uZm9jdXMgPT0gdHJ1ZSl7CiAgICAgICAgICAgICAgICAvLyBXaGVuIHVzZXIgZW50ZXJzIHRhYiBhZ2FpbiByZWZyZXNoIHBvc2l0aW9uCiAgICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIChlKSA9PiB7CiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc2VsZWN0b3IpLmlubmVySFRNTCA9ICIiOwogICAgICAgICAgICAgICAgICAgIHRoaXMuU2V0dXBQYXJ0aWNsZXMoKTsKICAgICAgICAgICAgICAgIH0pO30KCiAgICAgICAgICAgIC8vIFJlZnJlc2ggcmVzdWx0cwogICAgICAgICAgICB0aGlzLnBhcnRpY2xlX3hfcmF5ID0gcGFydGljbGVfeF9yYXk7CgogICAgICAgICAgICAvLyBHZW5lcmF0ZXMgYSByYW5kb20gaGV4IGNvbG9yCiAgICAgICAgICAgIGZ1bmN0aW9uIGdldFJhbmRvbUNvbG9yKCkgewogICAgICAgICAgICAgICAgdmFyIGxldHRlcnMgPSAnMDEyMzQ1Njc4OUFCQ0RFRic7CiAgICAgICAgICAgICAgICB2YXIgY29sb3IgPSAnIyc7CiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDY7IGkrKykgewogICAgICAgICAgICAgICAgICAgIGNvbG9yICs9IGxldHRlcnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTYpXTsKICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgIHJldHVybiBjb2xvcjsKICAgICAgICAgICAgfQogICAgICAgIH0KCiAgICAgICAgLy8gKiogTUVUSE9EUyAqKgogICAgICAgIC8vIFJFRlJFU0ggUEFSVElDTEVTCiAgICAgICAgUmVmcmVzaCgpIHsKCiAgICAgICAgICAgIC8vIFJlbW92ZSBhbGwgcGFydGljbGVzCiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuc2VsZWN0b3IpLmlubmVySFRNTCA9ICIiOwogICAgICAgICAgICAvLyBTZXR1cCBuZXcgQW1iaWVudAogICAgICAgICAgICB0aGlzLlNldHVwUGFydGljbGVzKCk7CiAgICAgICAgfQoKICAgICAgICAvLyBERVNUUk9ZCiAgICAgICAgRGVzdHJveSgpIHsKCiAgICAgICAgICAgIC8vIFJlbW92ZSBhbGwgcGFydGljbGVzIGFuZCB1bmJpbmQgYWxsIGl0cyBldmVudHMKICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5zZWxlY3RvcikucmVtb3ZlKCk7CiAgICAgICAgfQoKICAgICAgICAvLyBBREQgUEFSVElDTEVTCiAgICAgICAgQWRkKG51bWJlcikgewogICAgICAgICAgICBpZihudW1iZXIgIT0gdW5kZWZpbmVkKQogICAgICAgICAgICB7CiAgICAgICAgICAgICAgICAvLyBBZGQgbmV3IHBhcnRpY2xlcwogICAgICAgICAgICAgICAgdGhpcy5TZXR1cFBhcnRpY2xlcyhudW1iZXIpOwogICAgICAgICAgICB9CiAgICAgICAgfQoKICAgICAgICAvLyBQQVVTRQogICAgICAgIENvbnRyb2xzKGNvbW1hbmQpCiAgICAgICAgewogICAgICAgICAgICAvLyBDaGVjayB3aGF0IHR5cGUgb2YgY29tbWFuZCBpcwogICAgICAgICAgICBzd2l0Y2goY29tbWFuZCkgewogICAgICAgICAgICAgICAgY2FzZSAicGF1c2UiOiAvLyBQYXVzZSBQYXJ0aWNsZXMgbW92aW1lbnQKICAgICAgICAgICAgICAgICAgICBpc1BhdXNlZCA9IHRydWU7CiAgICAgICAgICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICAgICAgICBjYXNlICJwbGF5IjogLy8gUmVzdW1lIFBhcnRpY2xlcyBtb3ZpbWVudAogICAgICAgICAgICAgICAgICAgIGlzUGF1c2VkID0gZmFsc2U7CiAgICAgICAgICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICAgICAgICBkZWZhdWx0OgogICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCJCVkFtYmllbnQgfCBDb21tYW5kIG5vdCByZWNvZ25pemVkLiIpOwogICAgICAgICAgICB9CiAgICAgICAgfQoKICAgICAgICAvLyBDSEFOR0UgUEFSVElDTEVTCiAgICAgICAgQ2hhbmdlKHByb3BlcnRpZXMpIHsKCiAgICAgICAgICAgIC8vIENoYW5nZXMgcGFydGljbGVzIGFjY29yZGluZyB0byBwcm9wZXJ0aWVzIGF2YWlsYWJsZQogICAgICAgICAgICBpZihwcm9wZXJ0aWVzLnR5cGUgPT0gInBhcnRpY2xlX2JhY2tncm91bmQiKQogICAgICAgICAgICB7CiAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYnZhbWJpZW50X3BhcnRpY2xlJykuZm9yRWFjaCgoaXRlbSkgPT4gewogICAgICAgICAgICAgICAgICAgIC8vIENoYW5nZSB0byBjaG9zZW4gY29sb3IKICAgICAgICAgICAgICAgICAgICBpdGVtLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHByb3BlcnRpZXMudmFsdWU7CiAgICAgICAgICAgICAgICB9KTsKICAgICAgICAgICAgfSBlbHNlIHsgY29uc29sZS5sb2coIkJWQW1iaWVudCB8IFByb3BlcnRpZSBub3QgcmVjb2duaXplZC4iKTsgfQogICAgICAgIH0KICAgIH0KICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoIkRPTUNvbnRlbnRMb2FkZWQiLCBmdW5jdGlvbigpIHsKICAgICAgICB2YXIgZGVtbzEgPSBuZXcgQlZBbWJpZW50KHsKICAgICAgICAgICAgc2VsZWN0b3I6ICIjYW1iaWVudCIsCiAgICAgICAgICAgIGZwczogNjAsCiAgICAgICAgICAgIG1heF90cmFuc2l0aW9uX3NwZWVkOiAxMjAwMCwKICAgICAgICAgICAgbWluX3RyYW5zaXRpb25fc3BlZWQ6IDgwMDAsCiAgICAgICAgICAgIHBhcnRpY2xlX251bWJlcjogMzAsCiAgICAgICAgICAgIHBhcnRpY2xlX21heHdpZHRoOiA2MCwKICAgICAgICAgICAgcGFydGljbGVfbWlud2lkdGg6IDEwLAogICAgICAgICAgICBwYXJ0aWNsZV9yYWRpdXM6IDUwLAogICAgICAgICAgICBwYXJ0aWNsZV9vcGFjaXR5OiB0cnVlLAogICAgICAgICAgICBwYXJ0aWNsZV9jb2xpc2lvbl9jaGFuZ2U6IHRydWUsCiAgICAgICAgICAgIHBhcnRpY2xlX2JhY2tncm91bmQ6ICIjNThjNzBjIiwKICAgICAgICAgICAgcmVmcmVzaF9vbmZvY3VzOiB0cnVlLAogICAgICAgICAgICBwYXJ0aWNsZV9pbWFnZTogewogICAgICAgICAgICAgICAgaW1hZ2U6IGZhbHNlLAogICAgICAgICAgICAgICAgc3JjOiAiIgogICAgICAgICAgICB9LAogICAgICAgICAgICByZXNwb25zaXZlOiBbCiAgICAgICAgICAgICAgICB7CiAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogNzY4LAogICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7CiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlX251bWJlcjogIjE1IgogICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgIH0sCiAgICAgICAgICAgICAgICB7CiAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogNDgwLAogICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7CiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlX251bWJlcjogIjEwIgogICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgXQogICAgICAgIH0pOwogICAgfSk7Cjwvc2NyaXB0PgoKCgoKPGRpdiBjbGFzcz0iY2FyZC1iYWNrIj4KICAgIDxoMT5DbGFzaOmFjee9ruiejeWQiDwvaDE+CgogICAgPCEtLSDop6PnoIHpg6jliIYgLS0+CiAgICA8ZGl2IGlkPSJpbnB1dC1jb250YWluZXIiPgogICAgICAgIDwhLS0g5Yid5aeL6L6T5YWl5qGGIC0tPgogICAgICAgIDxkaXYgY2xhc3M9ImlucHV0LWdyb3VwIj4KICAgICAgICAgICAgPGlucHV0IHR5cGU9InRleHQiIGNsYXNzPSJpbnB1dC1maWVsZCIgcGxhY2Vob2xkZXI9IueymOi0tOiuoumYhemTvuaOpSI+CiAgICAgICAgPC9kaXY+CiAgICA8L2Rpdj4KCiAgICA8ZGl2IGNsYXNzPSJpbnB1dC1ncm91cCI+CiAgICAgICAgPGJ1dHRvbiBvbmNsaWNrPSJhZGRJbnB1dCgpIj7inpU8L2J1dHRvbj4KICAgICAgICA8YnV0dG9uIG9uY2xpY2s9ImNvcHlMaW5rKCkiPuiejeWQiOmFjee9rjwvYnV0dG9uPgoKICAgIDwvZGl2PgoKCiAgICA8ZGl2IGlkPSJxcmNvZGUiPgogICAgICAgIDxpbWcgc3JjPSJodHRwczovLzRldmVyZ3I4LmdpdGh1Yi5pby9yZXNvdXJjZXMvaWNvbi5wbmciIGFsdD0i56S65L6L5Zu+54mHIiBpZD0icmFuZG9tIiBvbmNsaWNrPSJnZXRSYW5kb21JbWFnZSgpIj4KICAgIDwvZGl2PgoKCjwvZGl2Pgo8YSBocmVmPSJodHRwczovL2dpdGh1Yi5jb20vNGV2ZXJncjgvd29ya2VyLXN1Yi1tZXJnZSIgdGFyZ2V0PSJfYmxhbmsiPgogICAgPGltZyBzcmM9Imh0dHBzOi8vNGV2ZXJncjguZ2l0aHViLmlvL3Jlc291cmNlcy9naXRodWItbWFyay5wbmciIGFsdD0i6aG555uu5Zyw5Z2AIiBpZD0iR2l0SHViSWNvbiI+CjwvYT4KPGEgaHJlZj0iaHR0cHM6Ly80ZXZlcmdyOC5naXRodWIuaW8iIHRhcmdldD0iX2JsYW5rIj4KICAgIDxpbWcgc3JjPSJodHRwczovLzRldmVyZ3I4LmdpdGh1Yi5pby9yZXNvdXJjZXMvaWNvbi5wbmciIGFsdD0i5Li76aG15Zyw5Z2AIiBpZD0iT3duSWNvbiI+CjwvYT4KCgo8c2NyaXB0PgogICAgZnVuY3Rpb24gZ2V0UmFuZG9tSW1hZ2UoKSB7CiAgICAgICAgdmFyIHRvdGFsSW1hZ2VzID0gNTI7IC8vIOWBh+iuvuaciTI2OOW8oOWbvueJh++8iDAwMS5qcGfliLAyNjguanBn77yJCiAgICAgICAgdmFyIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdG90YWxJbWFnZXMpICsgMTsgLy8g6ZqP5py66I635Y+W57Si5byVCiAgICAgICAgdmFyIGltYWdlUGF0aCA9ICdodHRwczovLzRldmVyZ3I4LmdpdGh1Yi5pby9yZXNvdXJjZXMvanBncy8nICsgcmFuZG9tSW5kZXgudG9TdHJpbmcoKS5wYWRTdGFydCgzLCAnMCcpICsgJy5qcGcnOyAvLyDkvb/nlKggcGFkU3RhcnQg5aSE55CG5bqP5Y+3CiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JhbmRvbScpLnNyYyA9IGltYWdlUGF0aDsgLy8g6K6+572u5Zu+54mH5rqQCiAgICB9CgoKCgoKCgoKCgoKICAgIGdldFJhbmRvbUltYWdlKCk7CgoKCgoKCgoKCgoKCgogICAgZnVuY3Rpb24gZ2VuZXJhdGVRUkNvZGUobGluaykgewogICAgICAgIC8vIOa4heepuuS5i+WJjeeahOS6jOe7tOeggQogICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJxcmNvZGUiKS5pbm5lckhUTUwgPSAiIjsKCiAgICAgICAgLy8g55Sf5oiQ5paw55qE5LqM57u056CBCiAgICAgICAgbmV3IFFSQ29kZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgicXJjb2RlIiksIHsKICAgICAgICAgICAgdGV4dDogbGluaywKICAgICAgICAgICAgY29sb3JEYXJrOiAiIzAwMDAwMCIsIC8vIOa3seiJsumDqOWIhuminOiJsgogICAgICAgICAgICBjb2xvckxpZ2h0OiAiI2ZmZmZmZiIsIC8vIOa1heiJsumDqOWIhuminOiJsgogICAgICAgICAgICBjb3JyZWN0TGV2ZWw6IFFSQ29kZS5Db3JyZWN0TGV2ZWwuSCAvLyDnuqDplJnnrYnnuqcKICAgICAgICB9KTsKICAgIH0KCgoKCiAgICAvLyDojrflj5bovpPlhaXmoYblrrnlmagKICAgIGNvbnN0IGlucHV0Q29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lucHV0LWNvbnRhaW5lcicpOwoKICAgIC8vIOa3u+WKoOi+k+WFpeahhgogICAgZnVuY3Rpb24gYWRkSW5wdXQoKSB7CiAgICAgICAgaWYoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoInFyY29kZSIpKXtkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgicXJjb2RlIikucmVtb3ZlKCl9CgogICAgICAgIGNvbnN0IGxhc3RJbnB1dEdyb3VwID0gaW5wdXRDb250YWluZXIubGFzdEVsZW1lbnRDaGlsZDsKCgogICAgICAgIGNvbnN0IG5ld0lucHV0R3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTsKICAgICAgICBuZXdJbnB1dEdyb3VwLmNsYXNzTmFtZSA9ICdpbnB1dC1ncm91cCc7CgoKICAgICAgICBjb25zdCBuZXdJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7CiAgICAgICAgbmV3SW5wdXQudHlwZSA9ICd0ZXh0JzsKICAgICAgICBuZXdJbnB1dC5jbGFzc05hbWUgPSAnaW5wdXQtZmllbGQnOwogICAgICAgIG5ld0lucHV0LnBsYWNlaG9sZGVyID0gJ+eymOi0tOiuoumYhemTvuaOpSc7CgogICAgICAgIGNvbnN0IGNvbW1hQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7CiAgICAgICAgY29tbWFCdXR0b24uZGlzYWJsZWQgPSB0cnVlOyAvLyDnpoHnlKjmjInpkq4KICAgICAgICBjb21tYUJ1dHRvbi50ZXh0Q29udGVudCA9ICfvvIwnOyAvLyDpgJflj7fooajmg4XnrKblj7cKICAgICAgICBjb21tYUJ1dHRvbi5jbGFzc05hbWUgPSAnY29tbWEtYnV0dG9uJzsKCgogICAgICAgIGlmIChsYXN0SW5wdXRHcm91cCkgewogICAgICAgICAgICBsYXN0SW5wdXRHcm91cC5hcHBlbmRDaGlsZChjb21tYUJ1dHRvbik7CiAgICAgICAgfQoKCiAgICAgICAgbmV3SW5wdXRHcm91cC5hcHBlbmRDaGlsZChuZXdJbnB1dCk7CgoKICAgICAgICBpbnB1dENvbnRhaW5lci5hcHBlbmRDaGlsZChuZXdJbnB1dEdyb3VwKTsKICAgIH0KCiAgICAvLyDlpI3liLbpk77mjqXliLDliarotLTmnb8KICAgIGZ1bmN0aW9uIGNvcHlMaW5rKCkgewogICAgICAgIGNvbnN0IGlucHV0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5pbnB1dC1maWVsZCcpOwogICAgICAgIGNvbnN0IGxpbmtzID0gQXJyYXkuZnJvbShpbnB1dHMpLm1hcChpbnB1dCA9PiBpbnB1dC52YWx1ZS50cmltKCkpLmZpbHRlcih2YWx1ZSA9PiB2YWx1ZSAhPT0gJycpOwogICAgICAgIGNvbnN0IGNvbWJpbmVkTGlua3MgPSBsaW5rcy5qb2luKCcsJyk7CgogICAgICAgIGNvbnN0IGxpbmsgPSBgJHt3aW5kb3cubG9jYXRpb24ub3JpZ2lufS8/bGlua3M9JHtlbmNvZGVVUklDb21wb25lbnQoY29tYmluZWRMaW5rcyl9YDsKCiAgICAgICAgLy8g5aSN5Yi26ZO+5o6l5Yiw5Ymq6LS05p2/CiAgICAgICAgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQobGluayk7CiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBgY2xhc2g6Ly9pbnN0YWxsLWNvbmZpZz91cmw9JHtsaW5rfWAKICAgICAgICBjb25zb2xlLmxvZyhsaW5rKTsKCgoKICAgICAgICBnZW5lcmF0ZVFSQ29kZShsaW5rKTsKICAgIH0KPC9zY3JpcHQ+CjwvYm9keT4KPC9odG1sPg==





`;

  // src/index.js
  addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
  });
  async function handleRequest(request) {
    let warnings = "";
    let readpre = "";
    let readpost = "";
    let readgroup = "";
    let contentDisposition;
    if (new URL(request.url).searchParams.has("links")) {
      const links = new URL(request.url).searchParams.get("links");
      const linkArray = links.split(",");
      const resultString = linkArray.map((link) => `#${link}
`).join("");
      warnings += resultString;
      const now = /* @__PURE__ */ new Date();
      const str2 = `#${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}
`;
      warnings += str2;
      const headers = { "User-Agent": "clash-verge/v1.6.6" };
      const fetchPromises = linkArray.map((link) => fetch(link, { headers }).then((response) => response.text()));
      const results = await Promise.all(fetchPromises);
      let mergedProxies = { proxies: [] };
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const link = linkArray[i];
        let parsed;
        try {
          parsed = js_yaml_default.load(result);
        } catch (e) {
          parsed = null;
        }
        if (!parsed?.proxies || !Array.isArray(parsed.proxies) || parsed.proxies.length === 0) {
          const cached = await BACKUP.get(link);
          if (!cached) {
            return new Response(
                JSON.stringify({ error: `\u94FE\u63A5\u65E0\u6548\u4E14\u672A\u627E\u5230\u7F13\u5B58: ${link}` }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
          }
          parsed = js_yaml_default.load(cached);
        } else {
          await BACKUP.put(link, result, { expirationTTL: 15552e3 });
        }
        mergedProxies.proxies.push(...parsed.proxies);
      }
      const proxyNames = mergedProxies.proxies.map((proxy) => proxy.name);
      mergedProxies["proxy-groups"] = [];
      try {
        readpre = await BACKUP.get("pre");
      } catch (error) {
        warnings += "#KV\u914D\u7F6E\u5931\u8D25\uFF0C\u4F7F\u7528\u9ED8\u8BA4pre\u503C\n";
      }
      readpre = readpre || pre;
      try {
        readpost = await BACKUP.get("post");
      } catch (error) {
        warnings += "#KV\u914D\u7F6E\u5931\u8D25\uFF0C\u4F7F\u7528\u9ED8\u8BA4post\u503C\n";
      }
      readpost = readpost || post;
      try {
        readgroup = await BACKUP.get("group");
      } catch (error) {
        warnings += "#KV\u914D\u7F6E\u5931\u8D25\uFF0C\u4F7F\u7528\u9ED8\u8BA4group\u503C\n";
      }
      readgroup = readgroup || group;
      mergedProxies["proxy-groups"] = JSON.parse(group);
      mergedProxies["proxy-groups"].forEach((group2) => {
        group2.proxies.push(...proxyNames);
      });
      const content = js_yaml_default.dump(mergedProxies);
      let finalContent = warnings + readpre + content + readpost;
      try {
        await BACKUP.put(Date.now().toString(), finalContent, { expirationTTL: 432e3 });
      } catch (error) {
        finalContent = "#\u4FDD\u5B58\u5907\u4EFD\u5931\u8D25\n" + finalContent;
      }
      let extraHeaders = {};
      if (linkArray.length === 1) {
        const response = await fetch(linkArray[0], { headers });
        contentDisposition = response.headers.get("Content-Disposition") || `inline; filename="${new URL(linkArray[0]).hostname}"`;
        const subInfo = response.headers.get("subscription-userinfo");
        if (subInfo) {
          extraHeaders["subscription-userinfo"] = subInfo;
        }
      } else {
        contentDisposition = `inline; filename*=UTF-8''${encodeURIComponent("\u878D\u5408\u914D\u7F6E")}`;
      }
      return new Response(finalContent, {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Content-Disposition": contentDisposition,
          ...extraHeaders
        }
      });
    } else if (new URL(request.url).searchParams.has("linkss")) {
    } else {
      return new Response(decodeURIComponent(escape(atob(html))), {
        headers: { "Content-Type": "text/html" }
      });
    }
  }
  __name(handleRequest, "handleRequest");
})();
/*! Bundled license information:

js-yaml/dist/js-yaml.mjs:
  (*! js-yaml 4.1.0 https://github.com/nodeca/js-yaml @license MIT *)
*/
//# sourceMappingURL=index.js.map
