// through2 is a thin wrapper around node transform streams
var through = require('through2');
var gutil = require('gulp-util');
var knox = require('knox');
var path = require('path');
var PluginError = gutil.PluginError;

// Consts
const PLUGIN_NAME = 'gulp-aws-s3';

// Plugin level function(dealing with files)
function gulpAwsS3 ( aws, options ) {
  if ( !aws ) {
    throw PluginError(PLUGIN_NAME, 'Missing AWS credentials!');
  }

  var client = knox.createClient(aws);

  var headers = {
    'x-amz-acl': 'public-read'
  };

  if ( options.headers ) {
    for ( var key in options.headers ) {
      headers[key] = options.headers[key];
    }
  }

  // Creating a stream through which each file will pass
  var stream = through.obj(function(file, enc, callback) {
    if ( file.isNull() ) {
      // Do nothing if no contents
    }

    var uploadPath = path.join(options.uploadPath || '', path.basename(file.path));

    var method = null;
    if ( file.isBuffer() ) {
      method = 'putBuffer';
    } else if ( file.isStream() ) {
      method = 'putStream';
    }

    if ( method ) {
      client[method](file.contents, uploadPath, headers, function ( err, res ) {
        if ( err || res.statusCode !== 200 ) {
          gutil.log(gutil.colors.red('[FAILED]', file.path));
        } else {
          gutil.log(gutil.colors.green('[SUCCESS]', file.path));
          res.resume();
        }
      });
    } else {
      throw PluginError(PLUGIN_NAME, 'File is neither Buffer or Stream!');
    }

    this.push(file);
    return callback();
  });

  // returning the file stream
  return stream;
};

// Exporting the plugin main function
module.exports = gulpAwsS3;
