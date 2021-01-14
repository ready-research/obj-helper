
const Benchmark = require('benchmark')

const dotProp = require('./dist')

const suite = new Benchmark.Suite()

suite
  .add('get', () => {
    const fixture1 = { foo: { bar: 1 } }
    dotProp.get(fixture1)
    fixture1[''] = 'foo'
    dotProp.get(fixture1, '')
    dotProp.get(fixture1, 'foo')
    dotProp.get({ foo: 1 }, 'foo')
    dotProp.get({ foo: null }, 'foo')
    dotProp.get({ foo: undefined }, 'foo')
    dotProp.get({ foo: { bar: true } }, 'foo.bar')
    dotProp.get({ foo: { bar: { baz: true } } }, 'foo.bar.baz')
    dotProp.get({ foo: { bar: { baz: null } } }, 'foo.bar.baz')
    dotProp.get({ foo: { bar: 'a' } }, 'foo.fake')
    dotProp.get({ foo: { bar: 'a' } }, 'foo.fake.fake2')
    dotProp.get({ '\\': true }, '\\')
    dotProp.get({ '\\foo': true }, '\\foo')
    dotProp.get({ 'bar\\': true }, 'bar\\')
    dotProp.get({ 'foo\\bar': true }, 'foo\\bar')
    dotProp.get({ '\\.foo': true }, '\\\\.foo')
    dotProp.get({ 'bar\\.': true }, 'bar\\\\.')
    dotProp.get({ 'foo\\.bar': true }, 'foo\\\\.bar')

    const fixture2 = {}
    Object.defineProperty(fixture2, 'foo', {
      value: 'bar',
      enumerable: false
    })
    dotProp.get(fixture2, 'foo')
    dotProp.get({}, 'hasOwnProperty')

    function fn () {}
    fn.foo = { bar: 1 }
    dotProp.get(fn)
    dotProp.get(fn, 'foo')
    dotProp.get(fn, 'foo.bar')

    const fixture3 = { foo: null }
    dotProp.get(fixture3, 'foo.bar')

    dotProp.get({ 'foo.baz': { bar: true } }, 'foo\\.baz.bar')
    dotProp.get({ 'fo.ob.az': { bar: true } }, 'fo\\.ob\\.az.bar')

    dotProp.get(null, 'foo.bar', false)
    dotProp.get('foo', 'foo.bar', false)
    dotProp.get([], 'foo.bar', false)
    dotProp.get(undefined, 'foo.bar', false)
  })
  .add('set', () => {
    let fixture1 = {}

    dotProp.set(fixture1, 'foo', 2)
    fixture1 = { foo: { bar: 1 } }
    dotProp.set(fixture1, 'foo.bar', 2)

    dotProp.set(fixture1, 'foo.bar.baz', 3)

    dotProp.set(fixture1, 'foo.bar', 'test')

    dotProp.set(fixture1, 'foo.bar', null)

    dotProp.set(fixture1, 'foo.bar', false)

    dotProp.set(fixture1, 'foo.bar', undefined)
  })
  .add('delete', () => {
    const func = () => 'test'
    func.foo = 'bar'

    const inner = {
      a: 'a',
      b: 'b',
      c: 'c',
      func
    }

    const fixture1 = {
      foo: {
        bar: {
          baz: inner
        }
      },
      top: {
        dog: 'sindre'
      }
    }

    dotProp.delete(fixture1, 'foo.bar.baz.c')

    dotProp.delete(fixture1, 'top')

    dotProp.delete(fixture1, 'foo.bar.baz.func.foo')

    dotProp.delete(fixture1, 'foo.bar.baz.func')
  })
  .on('cycle', event => {
    console.log(String(event.target))
  })
  .on('complete', () => {
    console.log('Finished')
  })
  .run({ async: true })
