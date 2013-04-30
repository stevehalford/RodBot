var config = require('./config.json');

var irc = require("irc");
var http = require("http");
var cheerio = require('cheerio');

var bot = new irc.Client(config.server, config.botName, {
    channels: [config.channel],
    userName: config.userName,
    password: config.password
});

bot.addListener('error', function(message) {
    console.log('error: ', message);
});

bot.addListener("message"+config.channel, function(from, text, message) {
    //only continue if mentioned
    if (text.indexOf(config.botName) === -1) {
        return false;
    }

    var exp = new RegExp(
        "(^|[ \t\r\n])((http|https):(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){2,}(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-]))"
        ,"g"
    );

    var urls = text.match(exp);

    if (!urls) {
        return false;
    }

    for (var i = 0; i < urls.length; i++) {
        url = encodeURIComponent(urls[i]);

        console.log('Link posted: '+urls[i]);

        //boxuk urls should be ignored
        if (url.indexOf('.boxuk.') !== -1) {
            return false;
        }

        //images can't be rodded
        if (url.indexOf('.jpg', url.length - 4) !== -1 || url.indexOf('.gif', url.length - 4) !== -1 || url.indexOf('.png', url.length - 4) !== -1) {
            return false;
        }

        http.request(
            {
                host: config.server,
                path: '/search?' + 'irc_search[query]="' + url + '"'
            },
            function(response) {
                var str = '';

                response.on('data', function (chunk) {
                    str += chunk;
                });

                response.on('end', function () {
                    //parse the html
                    $ = cheerio.load(str);

                    console.log('Results found: '+($('table.results tr').length - 1));

                    if ($('table.results tr').length > 1) { //greater than 1 because there's a header row

                        var name = $('table.results tr:nth-child(2) td[rel="tooltip"]').text();
                        var log = $('table.results tr:nth-child(2) a.btn').attr('href');

                        if (name != '' && typeof log != "undefined") {
                            bot.say(config.channel, from+": You've been rodded by "+name+"! http://"+config.server+log);
                        }
                    }
                });
            }
        ).end();
    }
});
