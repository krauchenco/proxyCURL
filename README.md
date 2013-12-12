# Super minimalist http / https proxy with NodeJS

Shows the HTTP headers of a request made in the browser.
It also shows the CURL command to make the same request in the bash command line.

## How to use

Configure proxy in your system. For example, setting in Firefox:<br>
![settings in firefox](https://raw.github.com/krauchenco/proxyCURL/master/etc/settingsFirefox.png)

Install and execute server
```
cd proxyCURL
npm install
node server.js
```
<br>
Access Firefox and make a request:<br>
![request in firefox](https://raw.github.com/krauchenco/proxyCURL/master/etc/requestFirefox.png)

See the console log headers and curl commands generated:<br>
![request in firefox](https://raw.github.com/krauchenco/proxyCURL/master/etc/bashConsole.png)

In the browser, the request is returned normally.

## References
[http-proxy](https://github.com/nodejitsu/node-http-proxy)<br>
[request-as-curl](https://github.com/azproduction/node-request-as-curl)
