# Smeagol #
Smeagol is a very simple NodeJS crawler module where you can create url patterns to extract different contents from different pages. 

## Install smeagol ##
    npm install smeagol

## How to use ##

### Require Smeagol ###
    var Smeagol = require('smeagol');


### Instance and settings ###
    let smeagol = new Smeagol(
        {
            crawl : [
                {
                    pattern_url : '^http://eucompraria.dev/produto/(.*)?$', 
                    id : 'produtos',
                    each_item : '.product-item',
                    find : {
                        id    : '$("h1 a").text()',
                        title   : '$("h1 a").text()',
                        price   : '$(".item_price").attr("data-price")',
                        photo   : '$(".main-photo img").attr("src")',
                        parcela : '$(".installments b").eq(0).html()'
                    }
                }
            ],
            log : 'smeagol-log.txt',
            limit: 5,
            continuous : true,
            domain : 'http://eucompraria.dev',
            pattern_to_crawl : '^http://eucompraria.dev/produto/(.*)?$'
        }
    );

"pattern_url" define what pages Smeagol will scrap.
"id" is the identification for the result Smeagol will give for this information group.
"each_item" is a CSS selector. Smeagol will iterate this selector on the page and extract the data defined in "find".
"find" is a object with label and CSS selector for each information you want to get from each "each_item".

### Crawl ###
Just start crawling!

    smeagol.crawl({
        uri : 'http://eucompraria.dev/'
    })

### Events ###
Smeagol uses nodeJs events to let you decide what to do when you get the information you want to scrap.

####complete(results)####
Emitted when Smeagol complete scrapping or scrap the limit pages in settings.

    smeagol.on('complete', function(results){
        if (!fs.existsSync('results')){
            fs.mkdirSync('results');
        }
        file = fs.createWriteStream('results/smeagol-result.json', {'flags': 'a'});
        file.write(JSON.stringify(results)+'\r\n');
    })

####crawl(result)####
Emitted every item (each_item in setting) Smeagol scrap. 

result is a json object.
url is the page url where Smeagol scrapped the result.

    smeagol.on('crawl', function(url, result){
        console.log('crawl', url, result);
    })