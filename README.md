npm-show-versions
=================

```
$ npm-show-versions semver
$ npm-show-versions semver@2
```

## npm-show-versions packagename[@packageversion]

A small tool to show which versions of a package would match a particular
version string for your copy of node and npm.  It takes into account not
just package version, but also engine restrictions and engineStrict.

So for instance, on node 0.11.x:

```
$ npm-show-versions abraxas@2
Name: abraxas
Description: A streaming gearman client / worker / server (as you choose)
Versions:
* 2.1.0 [latest] (requires: node >= 0.10.0)
* 2.0.2  (requires: node >= 0.10.0)
! 2.0.1  (suggests: node! ~0.10.0)
  2.0.0  (requires: node! ^0.10.0)
  1.2.1  (requires: node! ^0.10.0)
  1.2.0  (requires: node! ^0.10.0)
  1.1.0  (requires: node! ^0.10.0)
  1.0.0  (requires: node! ^0.10.0)
  0.4.0
  0.3.1
  0.3.0
  0.2.1
  0.2.0
  0.1.0
```

The `*` in the first column means that the package can be installed and
meets all criteria.  The `!` in the first column means the package can be
installed but there will be warnings.  The `node!` in the suggests/requires
section means that's the requirement that's failing.  And finally anything
in square brackets, like `[latest]`, shows the version a tag is associated
with.  All modules at a minimum have a latest tag.
