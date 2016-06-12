const Smeagol = require('../index.js'),
	fs = require('fs');

/* Instance crawler */
let smeagol = new Smeagol(
	{
		crawl : [
			{
				pattern_url : '^https://eucompraria.com.br/produto/(.*)?$', 
				id : 'produtos',
				each_item : '.product-item',
				find : {
					id	  : '$("h1 a").text()',
					title	: '$("h1 a").text()',
					price	: '$(".item_price").attr("data-price")',
					photo   : '$(".main-photo img").attr("src")'
				}
			}
		],
		limit: 6,
		continuous : true,
		maxConcurrency: 3,
		domain : 'https://eucompraria.com.br',
		pattern_to_crawl : '^https://eucompraria.com.br/produto/(.*)?$'
	}
);


/* Start crawling */
smeagol.crawl({
	uri : 'https://eucompraria.com.br/'
})
.on('complete', function(results){
	if (!fs.existsSync('results')){
		fs.mkdirSync('results');
	}
	file = fs.createWriteStream('results/smeagol-result.json', {'flags': 'a'});
	file.write(JSON.stringify(results)+'\r\n');
	console.log('Finished');
})
.on('error', function(err){
	console.log(err);
})