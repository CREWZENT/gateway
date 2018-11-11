var https = require('https');
var http = require('http');
var fs = require('fs');

// This line is from the Node.js HTTPS documentation.
var options = {
    key: fs.readFileSync('client-key.pem'),
    cert: fs.readFileSync('client-cert.pem')
};

var app = function (req, res) {
    res.writeHead(200);
    res.end("hello world\n");
}

// Create an HTTP service.
const httpServer = http.createServer(app).listen(80);
httpServer.on('error', (err) => {
    console.log(JSON.stringify(err));
});

// Create an HTTPS service identical to the HTTP service.
const httpsServer = https.createServer(options, app).listen(443);
httpsServer.on('error', (err) => {
    console.log(JSON.stringify(err));
});


