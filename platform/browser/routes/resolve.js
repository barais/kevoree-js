var http       = require('http'),
  fs         = require('fs'),
  path       = require('path'),
  zlib       = require('zlib'),
  tar        = require('tar'),
  AdmZip     = require('adm-zip'),
  rimraf     = require('rimraf'),
  browserify = require('browserify'),
  npm        = require('npm');


var BROWSER_MODULES = 'browser_modules',
  BROWSER_TAG     = '-kbrowser';

/**
 * GET /resolve
 *
 * Request param = {
 *  type: string,       // deployUnit.type (npm, git, etc...)
 *  name: string,       // deployUnit.unitName (kevoree-node, kevoree-comp-helloworld, ...)
 *  version: string     // deployUnit.version (0.0.1, ...)
 * }
 *
 * @param req
 * @param res
 */
module.exports = function(req, res) {
  if (req.query.type == 'npm') {

    var installDir        = path.resolve('site', 'public', 'libraries'),
        modulePath        = path.resolve(installDir, 'node_modules', req.query.name),
        browserModulePath = path.resolve(installDir, BROWSER_MODULES, req.query.name+BROWSER_TAG),
        downloadLink      = '/libraries/'+BROWSER_MODULES+'/'+req.query.name+BROWSER_TAG+'.zip';

    // check if bundle as already been downloaded
    if (!fs.existsSync(browserModulePath+'.zip')) {
      // install module with npm
      npm.load({}, function (err) {
        if (err) {
          res.send(500, 'Unable to load npm module');
          return;
        }

        // load success
        npm.commands.install(installDir, [req.query.name+'@'+req.query.version], function installCallback(err) {
          if (err) {
            res.send(500, 'npm failed to install package %s:%s', req.query.name, req.query.version);
            return;
          }

          // installation succeeded
          fs.mkdir(browserModulePath, function () {
            // browserify module
            var b = browserify();
            var bundleFile = fs.createWriteStream(path.resolve(browserModulePath, req.query.name+'-bundle.js'));

            b.require(path.resolve(process.cwd(), 'client', 'node_modules', 'kevoree-library'), { external: true })
              .require(path.resolve(process.cwd(), 'client', 'node_modules', 'kevoree-kotlin'), { external: true })
              .require(modulePath, { expose: req.query.name })
              .bundle()
              .pipe(bundleFile)
              .on('finish', function () {
                // zip browser-bundled folder
                var zip = new AdmZip();
                zip.addLocalFolder(browserModulePath);
                zip.writeZip(browserModulePath+'.zip');
                // remove browserModulePath folder from server
                rimraf(browserModulePath, function (err) {
                  if (err) console.error("Unable to delete %s folder :/", browserModulePath);
                });
                // send response
                res.json({
                  zipPath: downloadLink,
                  zipName: req.query.name+'@'+req.query.version,
                  requireName: modulePath
                });
                return;
              });
          });
        });
      });

    } else {
      // send response
      res.json({
        zipPath: downloadLink,
        zipName: req.query.name+'@'+req.query.version,
        requireName: modulePath
      });
      return;
    }

  } else {
    res.send(500, 'Sorry, for now Kevoree Browser Runtime server is only able to resolve "npm" packages.');
  }
};