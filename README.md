# gulp-aws-s3

A plugin for [Gulp](https://github.com/gulpjs/gulp) that uploads files to Amazon's S3 service.

## Installation

Install `gulp-aws-s3` as a development dependency:

```bash
npm install --save-dev git://github.com/mattbenton/gulp-aws-s3.git
```

## AWS Credentials

Create a JSON file with your AWS credentials and bucket name:

```json
{
  "key": "ABC123DEF456HIJ789KL",
  "secret": "abCdEFg1IJk2MnoPqrsTUvWxyZ3+4ABC5D6eFGHi",
  "bucket": "my-bucket"
}
```

## Usage

```js
var s3 = require('gulp-aws-s3');

gulp.task('deploy', function () {
  var aws = JSON.parse(fs.readFileSync('aws.json'));

  var options = {
    'headers': {
      'Cache-Control': 'max-age=315360000, no-transform, public',
      'Content-Type': 'application/javascript',
      'Content-Encoding': 'gzip'
    },
    'uploadPath': 'some/subdirectory/'
  };

  return gulp.src('./dist/*.js')
    .pipe(gzip())
    .pipe(rename('platform.js'))
    .pipe(s3(aws, options));
});
```


