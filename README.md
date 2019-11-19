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
                    pattern_url : '^http://g1.globo.com/economia/noticia/(.*)?$', 
                    id : 'news',
                    each_item : '#glb-materia',
                    find : {
                        id    : '$(".share-bar").attr("data-url")',
                        title   : '$(".entry-title").text()'
                    }
                }
            ],
            limit: 6,
            continuous : true,
            maxConcurrency: 6,
            domain : 'http://g1.globo.com/',
            pattern_to_crawl : '^http://g1.globo.com/economia/noticia/(.*)?$'
        }
    );


"pattern_url" define what pages Smeagol will scrap.
"id" is the identification for the result group in Smeagol results.
"each_item" is a CSS selector. Smeagol will iterate this selector on the page and extract the data defined in "find".
"find" is a object with label and CSS selector for each information you want to get from each "each_item".

### Crawl ###
Just start crawling!

    smeagol.crawl({
        uri : 'http://g1.globo.com/economia/'
    })
### Events ###
Smeagol uses nodeJs events to let you decide what to do when you get the information you want to scrap.

#### complete(results) ####
Emitted when Smeagol complete scrapping or scrap the limit pages in settings.

    smeagol.on('complete', function(results){
        console.log(results);
        console.log('Finished');
    })

#### crawl(result) ####
Emitted every item (each_item in setting) Smeagol scrap. 

result is a json object.
url is the page url where Smeagol scrapped the result.

    smeagol.on('crawl', function(url, result){
        console.log('crawl', url, result);
    })
