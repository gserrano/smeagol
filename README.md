# Smeagol #

NodeJS crawler module.

## Require ##
- fs
- jsdom

## How to use ##


### Require Smeagol ###
    var smeagol = require('smeagol');


### Configure ###
You can create url patterns to extract different contents from different URL patterns. In find you use jQuery selectors to get your content, really simple, huh? :)

    smeagol.configure({
        patterns : { // Create patterns to URLs and content selectors to crawl
            'http://andafter.org/publicacoes/([^/].)*?' : {
                id : 'posts',
                find : {
                    id      : '("h1 a").attr("href")',
                    name    : '("h1 a").html()',
                    olho    : '(".olho").html()'
                }
            }
        },
        limit: 2,
        log : true, // Log smeagol-log.txt file
        continuous : true, // Get all pages that url match pattern_to_crawl and automatic crawl this pages
        domain : 'http://andafter.org',
        pattern_to_crawl : 'http://andafter.org/publicacoes/([^/].)*?', // Continuous crawling will get url's that match this REGEX
        callback : function(result){ // Execute when finish the crawl function
            file = fs.createWriteStream('smeagol-result.txt', {'flags': 'a'});
            file.write(JSON.stringify(result)+'\r\n');
        }
    })


### Crawl ###
Just start crawling!

    smeagol.crawl({
    	uri : 'http://andafter.org/publicacoes/entrevista-de-emprego-unica.html'
    })