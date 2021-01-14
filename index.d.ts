declare const objHelper: {
  /**
  Get the value of the property at the given path.

  @param object - Object to get the `path` value.
  @param path - Path of the property in the object, using `.` to separate each nested key. Use `\\.` if you have a `.` in the key.
  @param defaultValue - Default value.
  @param validator - function to validate result is of expected type

  @example
  ```
  import o = require('obj-helper');

  o.get({foo: {bar: 'john'}}, 'foo.bar');
  //=> 'john'
  ```
  */
  get<T>(
    object: {[key: string]: any} | undefined,
    path: string
  ): T | undefined;
  get<T>(
    object: {[key: string]: any} | undefined,
    path: string,
    defaultValue: T
  ): T;
  get<T>(
    object: {[key: string]: any} | undefined,
    path: string,
    defaultValue: T,
    validate: (n:T) => boolean
  ): T;

  /**
  Set the property at the given path to the given value.

  @param object - Object to set the `path` value.
  @param path - Path of the property in the object, using `.` to separate each nested key. Use `\\.` if you have a `.` in the key.
  @param value - Value to set at `path`.
  @param force - if path doesnot exsists, create it.
  @returns The object.

  @example
  ```
  import o = require('obj-helper');

  const object = {foo: {bar: 'a'}};
  o.set(object, 'foo.bar', 'b');
  console.log(object);
  //=> {foo: {bar: 'b'}}

  const foo = o.set({}, 'foo.c.bar', 'c', true);
  console.log(foo);
  //=> {foo: {bar: 'a'}, c:{ {bar: 'c'} }}
  ```
  */
  set<T extends Record<string, unknown>>(
    object: T,
    path: string,
    value: unknown,
    force?: boolean
  ): boolean;

  /**
  Delete the property at the given path.

  @param object - Object to delete the `path` value.
  @param path - Path of the property in the object, using `.` to separate each nested key. Use `\\.` if you have a `.` in the key.
  @returns A boolean of whether the property existed before being deleted.

  @example
  ```
  import dotProp = require('dot-prop');

  const object = {foo: {bar: 'a'}};
  dotProp.delete(object, 'foo.bar');
  console.log(object);
  //=> {foo: {}}

  object.foo.bar = {x: 'y', y: 'x'};
  dotProp.delete(object, 'foo.bar.x');
  console.log(object);
  //=> {foo: {bar: {y: 'x'}}}
  ```
  */
  delete(object: {[key: string]: any}, path: string): boolean;
}

export = objHelper;
