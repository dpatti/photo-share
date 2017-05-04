type JSON = null | boolean | string | number | JSONObject | JSONArray;
type JSONObject = {[key: string]: JSON};
type JSONArray = Array<JSON>;

// ToJSON, i.e., an argument of JSON.stringify()
type ToJSON = JSON | {toJSON: () => JSON}
