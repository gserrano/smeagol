const Smeagol = require('../index.js'),
	fs = require('fs');

/* Instance crawler */
let smeagol = new Smeagol(
	{
		crawl : [
			{
				pattern_url : '^http://eucompraria.dev/produto/(.*)?$', 
				id : 'produtos',
				each_item : '.product-item',
				find : {
					id	  : '$("h1 a").text()',
					title	: '$("h1 a").text()',
					price	: '$(".item_price").attr("data-price")',
					photo   : '$(".main-photo img").attr("src")',
					parcela : '$(".installments b").eq(0).html()'
				}
			}
		],
		log : 'smeagol-log.txt',
		limit: 10,
		continuous : true,
		maxConcurrency: 10,
		domain : 'http://eucompraria.dev',
		pattern_to_crawl : '^http://eucompraria.dev/produto/(.*)?$'
	}
);


/* Start crawling */
console.time('execution');
smeagol.crawl({
	uri : 'http://eucompraria.dev/'
})
.on('complete', function(results){
	if (!fs.existsSync('results')){
		fs.mkdirSync('results');
	}
	file = fs.createWriteStream('results/smeagol-result.json', {'flags': 'a'});
	file.write(JSON.stringify(results)+'\r\n');
	console.timeEnd("execution");
})
.on('crawl', function(url, result){
    // console.log('crawl', url);
})