"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = filterApi;

var _tools = require("@dc/tools");

var _log = _interopRequireDefault(require("./log"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var RESTfulURITemplateRegExp = /{(.+?)}/g; // ヽ(｀Д´)ﾉ

function filterApi(api, data) {
  var _api = _slicedToArray(api, 4),
      method = _api[0],
      path = _api[1],
      query = _api[2],
      body = _api[3];

  path = path.replace(RESTfulURITemplateRegExp, function (s, variable) {
    if (!data[variable]) {
      (0, _log.default)("Lacking path paramater:", variable);
    }

    return data[variable];
  }); // query params

  var queryArray = Object.keys(query).map(function (queryName) {
    return _defineProperty({}, queryName, data[queryName]);
  });
  var queryString;

  if (queryArray.length) {
    queryString = (0, _tools.jsonToQuery)(queryArray.reduce(function (former, latter) {
      return Object.assign(former, latter);
    }));
  }

  var filledPath = queryString ? "".concat(path, "?").concat(queryString) : path;
  var bodyString;

  if (body.isArray) {
    bodyString = JSON.stringify(data[body.key]);
  } else {
    var bodyArray = Object.keys(body).map(function (bodyItem) {
      var bodyParam = _defineProperty({}, bodyItem, data[bodyItem]);

      delete data[bodyItem];
      return bodyParam;
    }); // 一些额外的参数, swagger 文档里没有声明, 但在 node 层的 hooks 中会用到, 需要保留到 body 中

    if (Object.prototype.toString.call(data, null) === "[object Object]") {
      var extraParams = Object.entries(data).map(function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
            field = _ref3[0],
            val = _ref3[1];

        return _defineProperty({}, field, val);
      });
      bodyArray = [].concat(_toConsumableArray(extraParams), _toConsumableArray(bodyArray));
    }

    if (bodyArray.length) {
      bodyString = JSON.stringify(bodyArray.reduce(function (former, latter) {
        return Object.assign(former, latter);
      }));
    }
  }

  return [filledPath, bodyString];
}