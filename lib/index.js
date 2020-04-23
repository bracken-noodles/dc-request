"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = request;
exports.setHeader = exports.use = void 0;

var _filterApiParams3 = _interopRequireDefault(require("./filterApiParams"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var middlewares = [];
var headers = {
  Accept: "application/json",
  "Content-Type": "application/json"
};

function request(api, data) {
  var method = api[0];

  var _filterApiParams = (0, _filterApiParams3.default)(api, data),
      _filterApiParams2 = _slicedToArray(_filterApiParams, 2),
      path = _filterApiParams2[0],
      body = _filterApiParams2[1];

  var requestInfo = {
    method: method,
    headers: headers
  };

  if (/POST|PUT|DELETE/.test(method.toUpperCase())) {
    requestInfo.body = body;
  }

  if (localStorage.token) {
    requestInfo.headers.Authorization = localStorage.token;
  }

  return new Promise(function (resolve, reject) {
    fetch(path, requestInfo).then(function (response) {
      var info = {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      }; // will not be resolve if *any* middleware function returns *true*

      if (middlewares.every(function (mid) {
        return !mid(info);
      })) {
        response.json().then(function (data) {
          resolve([info, data]);
        }).catch(function (e) {
          reject(new Error("Response is not json"));
        });
      } else {
        reject(new Error("Middleware blocked"));
      }
    }).catch(function (error) {
      resolve([error, null]);
    });
  });
}

var use = function use(handler) {
  middlewares.push(handler);
};

exports.use = use;

var setHeader = function setHeader(key, value) {
  headers[key] = value;
};

exports.setHeader = setHeader;