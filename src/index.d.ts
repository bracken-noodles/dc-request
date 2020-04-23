export enum RequestMethod {
  POST = "POST",
  GET = "GET",
  PUT = "PUT",
  DELETE = "DELETE"
}

export interface NecessaryHttpInfo {
  status: number;
  statusText: string;
  ok: boolean;
}
