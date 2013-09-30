var http   = require('http'),
    fs     = require('fs'),
    path   = require('path'),
    zlib   = require('zlib'),
    tar    = require('tar'),
    AdmZip = require('adm-zip'),
    rimraf = require('rimraf');

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

        var filename     = req.query.name+'-'+req.query.version,
            fullpath     = path.resolve('site', 'public', 'libraries', filename),
            downloadLink = '/libraries/'+filename+'.zip';

        var options = {
            host: 'registry.npmjs.org',
            path: '/'+req.query.name+'/'+req.query.version
        };

        // request JSON definition from registry.npmjs.org in order to find .zip url
        http.get(options, function (resp) {
            resp.setEncoding('utf8');
            var packageDefJson = '';

            resp.on('data', function (chunk) {
                packageDefJson += chunk;
            });

            resp.on('end', function () {
                var jsonResp = JSON.parse(packageDefJson);

                // request .tgz from npmjs
                http.get(jsonResp.dist.tarball, function (response) {
                    var extractOpts = { type: "Directory", path: fullpath, strip: 1 }

                    // gunzip .tgz && untar .tar to fullpath folder
                    response.pipe(zlib.Unzip()).pipe(tar.Extract(extractOpts));

                    response.on('end', function () {
                        // zip fullpath folder
                        var zip = new AdmZip();
                        zip.addLocalFolder(fullpath);
                        zip.writeZip(fullpath+'.zip');

                        // remove fullpath folder from server
//                        rimraf(fullpath, function (err) {
//                            if (err) console.error("Unable to delete %s folder :/", fullpath);
//                        });

                        // send response
                        res.json({
                            zipPath: downloadLink,
                            zipName: filename
                        });
                    });
                });
            });

        }).on('error', function(e) {
            console.log("GET /resolve route error:" + e.message);
        });

    } else {
        res.send(500, 'Sorry, for now Kevoree Browser Runtime server is only able to resolve "npm" packages.');
    }
};