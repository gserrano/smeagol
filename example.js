require.main.paths.unshift('/usr/local/lib/node_modules/');

var smeagol = require('smeagol'),
	fs = require('fs');

/* Create Smeagol configuration */
smeagol.configure({
    patterns : { // Create patterns to URLs and content selectors to crawl
        'http://eucompraria.com.br/produto/([^/].)*?' : {
            id : 'posts',
            find : {
            	id		: '("h1 a").attr("href")',
            	name 	: '("h1 a").html()',
                price   : '(".item_price b").html()'
            }
        }
    },
    limit: 10,
    log : true, // Log smeagol-log.txt file
    continuous : true, // Get all pages that url match pattern_to_crawl and automatic crawl this pages
    domain : 'http://eucompraria.com.br',
    pattern_to_crawl : 'http://eucompraria.com.br/produto/([^/].)*?', // Continuous crawling will get url's that match this REGEX
    callback : function(result){ // Execute when finish the crawl function
        file = fs.createWriteStream('smeagol-result.txt', {'flags': 'a'});
		file.write(JSON.stringify(result)+'\r\n');
    }
})

/* Get info */
var content = smeagol.crawl({
	uri : 'http://eucompraria.com.br/'
});