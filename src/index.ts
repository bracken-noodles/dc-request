import { RequestMethod, NecessaryHttpInfo } from "./index.d";
import filterApiParams from "./filterApiParams";

const middlewares: Array<(info: NecessaryHttpInfo) => boolean> = [];

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json"
};

export default function request(
  api: [RequestMethod, string, string, any],
  data: any
) {
  const method = api[0];
  const [path, body] = filterApiParams(api, data);

  const requestInfo: RequestInit = {
    method,
    headers
  };

  if (/POST|PUT|DELETE/.test(method.toUpperCase())) {
    requestInfo.body = body;
  }

  if (localStorage.token) {
    requestInfo.headers.Authorization = localStorage.token;
  }

  return new Promise((resolve, reject) => {
    fetch(path, requestInfo)
      .then(response => {
        const info = {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok
        };

        // will not be resolve if *any* middleware function returns *true*
        if (middlewares.every(mid => !mid(info))) {
          response
            .json()
            .then(data => {
              resolve([info, data]);
            })
            .catch(e => {
              reject(new Error("Response is not json"));
            });
        } else {
          reject(new Error("Middleware blocked"));
        }
      })
      .catch(error => {
        resolve([error, null]);
      });
  });
}

export const use = function(handler: (info: NecessaryHttpInfo) => boolean) {
  middlewares.push(handler);
};

export const setHeader = function(key: string, value: string) {
  headers[key] = value;
};
