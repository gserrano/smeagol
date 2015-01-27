// require.main.paths.unshift('/usr/local/lib/');

var smeagol = require('./index.js');


/* Create Smeagol configuration */
smeagol.configure({
    crawl : [
        {
            pattern_url : '^http://eucompraria.com.br/produto/(.*)?$',
            id : 'products',
            each_item : '.product-item',
            find : {
                id      : '$(".product-title a").attr("href")',
                title    : '$(".product-title").text()',
                price    : '$(".item_price").attr("data-price")'
            },
            callback : function(result){
                console.log(result);
                return result;
            }
        }
    ],
    log : true, // Log urls in smeagol-log.txt file
    limit: 3, //max pages to crawl
    continuous : true, // Get all pages that url match pattern_to_crawl and automatic crawl this pages
    domain : 'http://eucompraria.com.br',
    pattern_to_crawl : '^http://eucompraria.com.br/produto/(.*)?$', 
    callback : function(results){
        console.log(results);
    }
})

/* Get info */
var content = smeagol.crawl({
    uri : 'http://eucompraria.com.br/'
});