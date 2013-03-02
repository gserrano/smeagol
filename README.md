# Smeagol #

NodeJS crawler module (in development)

## Require ##
- fs
- jsdom

## How to use ##


### Require Smeagol ###
var smeagol = require('smeagol');


### Configure ###
You can create url patterns to extract different contents from different URL patterns. In find you use jQuery selectors to get your content, really simple, huh? :)

smeagol.configure({
    patterns : {
        'http://andafter.org/publicacoes/([^/].)*?' : { 
            id : 'posts',
            find : {
            	id		: '("h1 a").attr("href")',
            	name 	: '("h1 a").html()',
            	olho 	: '(".olho").html()'
            }
        }
    },
    callback : function(result){
        console.log(result);
    }
})


### Crawl ###
Just start crawling!

smeagol.crawl({
	uri : 'http://andafter.org/publicacoes/entrevista-de-emprego-unica.html'
})