var mergify = require('../index');

mergify(__dirname + '/data/test.csv', __dirname + '/templates/test.html').on('data', function (data) {
  console.log(data);
})