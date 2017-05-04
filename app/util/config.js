// @flow
const {isPlainObject, map, mapValues, propertyOf} = require('lodash');

type Config = Env => mixed;
type Env = {[string]: ?string};

const fromMaybe = <T>(maybe: ?T, whenUndef: () => T): T =>
  maybe == null
    ? whenUndef()
    : maybe;

exports.required = (getter: Config) => (env: Env): mixed =>
  fromMaybe(getter(env), () => {
    throw Error('Environment variable is not defined');
  });

exports.optional = (getter: Config, def: mixed) => (env: Env) =>
  fromMaybe(getter(env), () => def);

exports.variable = (name: string) => (env: Env) => env[name];

exports.computed =
  (names: Array<string>, f: Array<?string> => mixed) =>
    (env: Env) =>
      f(map(names, propertyOf(env)));

exports.fromEnv = (tree: Tree<string>, env: Env) =>
  mapValues(tree, (value) =>
    isPlainObject(value)
      ? exports.fromEnv(value, env)
      : value(env)
  );
