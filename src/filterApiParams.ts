import { RequestMethod } from "./index.d";
import { jsonToQuery } from "@dc/tools";
import log from "./log";

const RESTfulURITemplateRegExp = /{(.+?)}/g; // ヽ(｀Д´)ﾉ

export default function filterApi(
  api: [RequestMethod, string, string, any],
  data: any
) {
  let [method, path, query, body] = api;

  path = path.replace(RESTfulURITemplateRegExp, (s, variable) => {
    if (!data[variable]) {
      log("Lacking path paramater:", variable);
    }
    return data[variable];
  });

  // query params
  const queryArray = Object.keys(query).map(queryName => {
    return { [queryName]: data[queryName] };
  });

  let queryString;

  if (queryArray.length) {
    queryString = jsonToQuery(
      queryArray.reduce(
        (former: any, latter: any): any => Object.assign(former, latter)
      )
    );
  }

  const filledPath = queryString ? `${path}?${queryString}` : path;

  let bodyString;

  if (body.isArray) {
    bodyString = JSON.stringify(data[body.key]);
  } else {
    let bodyArray = Object.keys(body).map(bodyItem => {
      const bodyParam = { [bodyItem]: data[bodyItem] };
      delete data[bodyItem];
      return bodyParam;
    });

    // 一些额外的参数, swagger 文档里没有声明, 但在 node 层的 hooks 中会用到, 需要保留到 body 中
    if (Object.prototype.toString.call(data, null) === "[object Object]") {
      const extraParams = Object.entries(data).map(([field, val]) => {
        return { [field]: val };
      });
      bodyArray = [...extraParams, ...bodyArray];
    }

    if (bodyArray.length) {
      bodyString = JSON.stringify(
        bodyArray.reduce(
          (former: any, latter: any): any => Object.assign(former, latter)
        )
      );
    }
  }

  return [filledPath, bodyString];
}
