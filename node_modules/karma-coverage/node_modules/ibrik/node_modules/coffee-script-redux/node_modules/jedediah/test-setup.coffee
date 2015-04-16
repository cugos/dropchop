path = require 'path'
util = require 'util'

fs = require 'scopedfs'

global[name] = func for name, func of require 'assert'

# See http://wiki.ecmascript.org/doku.php?id=harmony:egal
egal = (a, b) ->
  if a is b
    a isnt 0 or 1/a is 1/b
  else
    a isnt a and b isnt b

# A recursive functional equivalence helper; uses egal for testing equivalence.
arrayEgal = (a, b) ->
  if egal a, b then yes
  else if (Array.isArray a) and Array.isArray b
    return no unless a.length is b.length
    return no for el, idx in a when not arrayEgal el, b[idx]
    yes

global.inspect = (o) -> util.inspect o, no, 2, yes
global.eq      = (a, b, msg) -> ok egal(a, b), msg ? "#{inspect a} === #{inspect b}"
global.arrayEq = (a, b, msg) -> ok arrayEgal(a,b), msg ? "#{inspect a} === #{inspect b}"

global.FIXTURES_DIR = path.join __dirname, 'fixtures'

sfs = fs.scoped FIXTURES_DIR
sfs.reset = ->
  fs.rmrfSync FIXTURES_DIR
  fs.mkdirpSync FIXTURES_DIR
do sfs.reset

global.fs = sfs
global.fixtures = (opts) ->
  do sfs.reset
  sfs.applySync opts

global[k] = v for own k, v of require './src/index'
