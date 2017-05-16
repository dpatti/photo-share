type JSONValue = null | boolean | string | number | JSONObject | JSONArray;
type JSONObject = {[key: string]: JSONValue};
type JSONArray = Array<JSONValue>;

// ToJSON, i.e., an argument of JSON.stringify()
type ToJSON = JSONValue | {toJSON: () => JSONValue}
