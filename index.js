"use strict"
var request = require("request")
var semver = require("semver")
var npmver = require("npm").version

module.exports = function (argv) {
  if (argv.length != 3) return help()
  var pkg = argv[2].split('@')
  var pkgname = pkg[0]
  var pkgver  = pkg[1] || '*'
  
  request('http://registry.npmjs.org/'+pkgname, function (er, response, body) {
    if (er) return error(er)
    try { var info = JSON.parse(body) } catch (E) { return error(E) }
    if (info.error) { return error(info) }
    console.log('Name: ' + info.name)
    console.log('Description: ' + info.description)
    var distTags = {}
    Object.keys(info['dist-tags']).forEach(function(T){
      var ver = distTags[info['dist-tags'][T]] = distTags[info['dist-tags'][T]] || []
      ver.push(T)
    })
    console.log('Versions: ')
    Object.keys(info.versions).sort(semver.rcompare).forEach(function (ver) {
      var pkg = info.versions[ver]
      var passes = true
      var engines = Object.keys(pkg.engines||{}).map(function (E) {
        var version = E=="node" ? process.versions.node : E=="npm" ? npmver : null
        var satisfies = version==null ? true : semver.satisfies(version, pkg.engines[E])
        if (!satisfies) passes = false
        return E + (! satisfies ? "!" : "") + " "+pkg.engines[E]
      })
      console.log(
         semver.satisfies(ver,pkgver) ? ( passes ? "*" : pkg.engineStrict ? " " : "!" ) :' ',
         ver,
         distTags[ver] ? distTags[ver].map(function(V){ return "["+V+"]" }).join(", ") : "",
         engines.length ? "("+(pkg.engineStrict ? "requires" : "suggests")+": "+engines.join(", ")+")" : "")
    })
  })
}

function help() {
  console.error("form: npm-show-versions packagename[@packageversion]")
  process.exit(1)
}

function error(er) {
  if (er.name ==  "SyntaxError") {
    console.error("Received non-JSON body from server")
  }
  else if (er.error) {
    console.error(er.error + ": "+ er.reason)
  }
  else if (er.stack) {
    console.error(er.stack)
  }
  else {
    console.error(er)
  }
  process.exit(1)
}