function getPath (path) {
  return (Array.isArray(path)
    ? path
    // ignore the \\. and the ^. in path
    : path.replace(/\\\.|^\./g, '_[[[-]]]_')
      .split('.')
      .map(n => n.replace(/_\[\[\[-\]\]\]_/g, '.'))
  )
}
// eslint-disable-next-line no-self-compare
function getProp (obj = {}, path = [], defaultValue = undefined, validate = (x) => x === x) {
  const pathArray = getPath(path)
  const key = pathArray.pop()
  if (isPrototypePolluted(key))
    return
  console.log(path, pathArray, key)
  try {
    if (path.length === 0 || pathArray.length === 0) {
      return obj[key]
    }

    const val = pathArray
      .reduce((carry, item) => carry[item], obj)
    if (validate(val) !== true) {
      throw Error('invalid')
    }
    return val && key in val ? val[key] : defaultValue
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('failed to fetch prop.', path, obj)
      console.error(error)
    }
    return defaultValue
  }
}

function setProp (obj, prop, val, createIfNotExists = true) {
  const path = getPath(prop)
  const key = path.pop()

  const ref = (createIfNotExists)
    ? path.reduce((c, i) => {
      if (!c[i] || typeof c[i] !== 'object' || Array.isArray(c[i])|| isPrototypePolluted(i)) {
        c[i] = {}
      }
      return c[i]
    }, obj)
    : getProp(
      obj,
      path
    )

  if (ref) {
    ref[key] = val
  }
  return obj
}

function deleteProp (object, prop) {
  const path = getPath(prop)
  const key = path.pop()
  const ref = getProp(object, path)
  console.log(ref, key, path)
  if (ref === undefined) {
    return false
  }

  if (path.length === 0) {
    delete ref[key]
    return object
  }

  key in ref && delete ref[key]
  return true
}

function has (obj, path) {
  console.log(getProp(obj, path, 'XXXUNIQUEXXX'))
  return getProp(obj, path, 'XXXUNIQUEXXX') !== 'XXXUNIQUEXXX'
}

function clone (obj) {
  return JSON.parse(JSON.stringify(obj))
}

function isPrototypePolluted(key) {
  return ['__proto__', 'constructor', 'prototype'].includes(key)
}

module.exports = { get: getProp, set: setProp, has, delete: deleteProp, clone }
