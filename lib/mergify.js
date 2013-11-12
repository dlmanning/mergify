var EventEmitter = require('events').EventEmitter;
var fs = require('fs');

var csv = require('fast-csv');
var handlebars = require('handlebars');

function mergify (csvFile, templateFile) {

  var ee = new EventEmitter;

  ifFilesExist([csvFile, templateFile],
    function (err) {
      if (err) {
        throw err;
      }

      fs.readFile(templateFile, { encoding: 'utf8' }, function (err, templateString) {
        var template = handlebars.compile(templateString);

        csv(csvFile, { headers: true })
         .on('data', function (data) {
           ee.emit('data', template(data));
         })
         .on('end', function () {
           ee.emit('end');
         })
         .parse();

      });
    }
  );

  return ee;
}

function ifFilesExist (files, cb) {
  var numberOfFiles = files.length
    , returnsChecked = 0
    , existencesConfirmed = 0;

  for (var i = 0; i < numberOfFiles; i++) {
    fs.exists(files[i], next);
  }

  function next (e) {
    returnsChecked++;
    if (e) {
      existencesConfirmed++;
    }

    if (returnsChecked >= numberOfFiles) {
      if (existencesConfirmed >= numberOfFiles) {
        cb(null);
      } else {
        cb(new Error("Not all files exist."));
      }
    }
  }

}

module.exports = mergify;