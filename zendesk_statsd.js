var https = require('https');
var lynx = require('lynx');
var nconf = require('nconf');
var logging = require('node-logging');

var metrics;

var loadConfig = function(filename) {
  nconf.file(filename)
    .env();

  nconf.defaults({
    statsdPort: 8125,
    statsdServer: 'localhost',
    logLevel: 'debug',
    statsdPrefix: 'zendesk',
    interval: 60000,
  });

  logging.setLevel(nconf.get('logLevel'));

  metrics = new lynx(
    nconf.get('statsdServer'),
    nconf.get('statsdPort')
  );
};


var getCounts = function(cb) {
  var options = {
    auth: nconf.get('zendeskUsername') + "/token:" + nconf.get('zendeskToken'),
    hostname: nconf.get('zendeskHostname'),
    path: '/api/v2/views/count_many.json?ids=' + Object.keys(nconf.get('viewsToStats')).join(',')
  };
  var req = https.get(options, function(res) {
    res.on('data', function(d) {
      logging.dbg('got response from zendesk' + d);
      JSON.parse(d).view_counts.forEach(function(c) {
        cb(nconf.get('viewsToStats')[c.view_id], c.value);
      });
    });
  });
};

var sendStats = function() {
  getCounts(function(view, count) {
    var key = nconf.get('statsdPrefix') + '.' + view;
    metrics.gauge(key, count);
    logging.inf('sending ' +  key + ' : ' +  count);
  });
}

var checkConfig = function() {
  configErrors = {
    viewsToStats: 'Please add some view -> stat mappings in the settings file',
    zendeskHostname: 'Please set the zendesk hostname (yoursubdomain.zendesk.com) in the settings file',
    zendeskUsername: 'Please set your zendesk username in the settings file',
    zendeskToken: 'Please set your zendesk token in the settings file',
  };
  Object.keys(configErrors).forEach(function(key) {
    if (!nconf.get(key)) {
      logging.err(configErrors[key]);
      logging.err('Exiting due to missing config');
      process.exit();
    }
  });
}

var main = function() {
  var filename = 'settings.json';
  if (process.argv.length === 3) {
    filename = process.argv[2];
  }
  loadConfig(filename);
  checkConfig();
  sendStats();
  setInterval(sendStats, nconf.get('interval'));
}

main();
