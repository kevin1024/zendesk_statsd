# zendesk_statsd

Have you ever wanted a graph of how many tickets you have in your ZenDesk views?  Well, you're in luck!  zendesk_statsd is a process that will consume your view counts from the Zendesk API periodically and send it to your StatsD server.

# Requirements

You need to have [StatsD](https://github.com/etsy/statsd/) running somewhere accessible, and have a ZenDesk account.  You will also need your Zendesk API key, which you can find in Settings -> Channels -> API

1. Put things in settings.json.  
2. Run with: `node zendesk_statsd.js`

## Configuration Options

Configuration is either loaded by a `settings.json` in the current directory, or by environment variables.  Environment variables take precendence over `settings.json`.  "Ah but how do I set that annoying nested setting using environment variables?", I hear you ask.  You can use `:` as a separator.

Now for the exciting list of settings:

### Required Settings

These have to be set before zendesk_statsd will run

* zendeskHostname - Set it to your Zendesk subdomain, example "yoursubdomain.zendesk.com"
* zendeskToken - Find this in Settings -> Channels -> API on your Zendesk dashboard
* zendeskUsername - You use this to log in to Zendesk.  It looks like an email address.
* viewsToStats - This is a javascript object mapping Zendesk view IDs (numeric strings) to StatsdD keys (also strings).  Example:

```json
{
  "12345":"myawesomeview.count",
  "5678":"anotherawesomeview.count"
}
```

### Optional Settings

* interval - Number of *milliseconds* between Zendesk pulls + StatsD pushes.  Defaults to 1 minute, which is probably too short.  Keep in mind that Zendesk will rate limit you.
* logLevel - How verbose zendesk_statsd will be.  Defaults to `debug`, but other log levels include: `info`, `warning`, and `error`
* statsdPort  - Defaults to 8125
* statsdPrefix - Automatically prefixed to all your stats you send over.  Defaults to "zendesk"
* statsdServer - Address of your StatsD server.  Defaults to "localhost"

Refer to [exampleSettings.json](exampleSettings.json) for an example config file.


## Changelog

* 0.0.2 - Add bin/zendesk_statsd executable for easier deployment
* 0.0.1 - Initial Release

## License (MIT)
The MIT License (MIT)

Copyright (c) 2013 Kevin McCarthy

Permission is hereby granted, free of charge, to any person obtaining a
copy
of this software and associated documentation files (the "Software"), to
deal
in the Software without restriction, including without limitation the
rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included
in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN
THE SOFTWARE.
