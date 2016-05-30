const Smeagol = require('../index.js'),
	fs = require('fs');

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
				},
				callback : function(result){
					// result.price = result.price.replace('.', ',');
					// result.parcela = result.parcela.replace('R$ ', '').replace('.', ',');
					// console.log(result);
					return result;
				}
			}
		],
		log : 'smeagol-log.txt',
		limit: 5,
		continuous : true,
		domain : 'http://eucompraria.dev',
		pattern_to_crawl : '^http://eucompraria.dev/produto/(.*)?$', 
		callback : function(results){
			if (!fs.existsSync('results')){
				fs.mkdirSync('results');
			}
			file = fs.createWriteStream('results/smeagol-result.json', {'flags': 'a'});
			file.write(JSON.stringify(results)+'\r\n');
		}
	}
);


/* Get info */
var content = smeagol.crawl({
	uri : 'http://eucompraria.dev/'
});