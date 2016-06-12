const Smeagol = require('../index.js');

/* Instance crawler */
let smeagol = new Smeagol(
	{
		crawl : [
			{
				pattern_url : '^http://g1.globo.com/economia/noticia/(.*)?$', 
				id : 'news',
				each_item : '#glb-materia',
				find : {
					id	  : '$(".share-bar").attr("data-url")',
					title	: '$(".entry-title").text()'
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


/* Crawling */
smeagol.crawl({
	uri : 'http://g1.globo.com/economia/'
})
.on('complete', function(results){
	console.log(results);
	console.log('Finished');
})
.on('crawl', function(url, result){
    console.log('crawl', url, result);
})