// @flow
const {isPlainObject, map, mapValues, propertyOf} = require('lodash');

type Config<T> = Env => T;
type Env = {[string]: ?string};

const fromMaybe = <T>(maybe: ?T, whenUndef: () => T): T =>
  maybe == null
    ? whenUndef()
    : maybe;

exports.required =
  <T>(getter: Config<?T>): (Env => T) =>
    (env: Env): T =>
      fromMaybe(getter(env), () => {
        throw Error('Environment variable is not defined');
      });

exports.optional =
  <T>(getter: Config<?T>, def: T): (Env => T) =>
    (env: Env): T =>
      fromMaybe(getter(env), () => def);

exports.variable = (name: string) => (env: Env) => env[name];

exports.computed =
  <T>(names: Array<string>, f: (Array<?string>) => T) =>
    (env: Env) =>
      f(map(names, propertyOf(env)));

exports.fromEnv = (tree: Tree<Config<*>>, env: Env) =>
  mapValues(tree, (value) =>
    isPlainObject(value)
      ? exports.fromEnv(value, env)
      : value(env)
  );

exports.nodeEnv =
  exports.optional(exports.variable('NODE_ENV'), 'development');
