require.main.paths.unshift('/usr/local/lib/node_modules/');

var smeagol = require('smeagol');

/* Create Smeagol configuration */
smeagol.configure({
    patterns : { // Create patterns to URLs and content selectors to crawl
        'http://andafter.org/publicacoes/([^/].)*?' : {
            id : 'posts',
            find : {
            	id		: '("h1 a").attr("href")',
            	name 	: '("h1 a").html()',
            	olho 	: '(".olho").html()'
            }
        }
    },
    log : true, // Log smeagol-log.txt file
    continuous : true, // Get all pages that url match pattern_to_crawl and automatic crawl this pages
    domain : 'http://andafter.org',
    pattern_to_crawl : 'http://andafter.org/publicacoes/([^/].)*?', // Continuous crawling will get url's that match this REGEX
    callback : function(result){ // Execute when finish the crawl function
    	// console.log('callback');
        console.log(result);
    }
})

/* Get info */
var content = smeagol.crawl({
	uri : 'http://andafter.org/publicacoes/entrevista-de-emprego-unica.html'
})
