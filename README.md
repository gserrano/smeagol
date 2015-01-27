# Smeagol #

NodeJS crawler module.

## Install smeagol ##
    npm install smeagol


## How to use ##

### Require Smeagol ###
    var smeagol = require('smeagol');


### Configure ###
You can create url patterns to extract different contents from different URL patterns. In find you use jQuery selectors to get your content, really simple, huh? :)

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

### Crawl ###
Just start crawling!

    var content = smeagol.crawl({
        uri : 'http://eucompraria.com.br/'
    });
