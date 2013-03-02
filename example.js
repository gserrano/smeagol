require.main.paths.unshift('/usr/local/lib/node_modules/');

var smeagol = require('smeagol');

/* Create Smeagol configuration */
smeagol.configure({
    patterns : {
        'http://andafter.org/publicacoes/([^/].)*?' : {
            id : 'posts',
            find : {
            	id		: '("h1 a").attr("href")',
            	name 	: '("h1 a").html()',
            	olho 	: '(".olho").html()'
            }
        }
    },
    callback : function(result){
        console.log(result);
    }
})

/* Get info */
smeagol.crawl({
	uri : 'http://andafter.org/publicacoes/entrevista-de-emprego-unica.html'
})