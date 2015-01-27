/*
	Smeagol, nodeJS scrapper to crawl content in HTML pages using html selectors
*/

module.paths.unshift('/usr/local/lib/node_modules/');

var fs = require('fs');
var http = require('http');
var cheerio = require("cheerio");

var settings,
	crawled,
	toCrawl,
	result,
	counter = 0;

exports.configure = function(config){
	settings = config,
	urls_crawled = [],
	urls_toCrawl = [],
	urls_ignore = [],
	result = {
		contents : {}
	};
}

exports.crawl = function(obj){

	console.log('Crawl: '+obj.uri);

	if(settings.log == true){
		log = fs.createWriteStream('smeagol-log.txt', {'flags': 'a'});
		log.write(obj.uri+'\r\n');
	}

	/* Testing */ 
	if(settings.limit && counter >= settings.limit){
		if(typeof(settings.callback) == 'function'){
			settings.callback(result);
		}
		return;
	}

	this_path = obj.uri.split('/');
	this_path.pop();
	this_path = this_path.join('/');


	download(obj.uri, function(data) {
		if (data) {
			var $ = cheerio.load(data);

			/* Get all links and "categorize" to continuous crawling */
		    if(settings.continuous){
			    $('a').each(function(index){
			    	var url = $(this).attr('href');

			    	if(typeof(url) == 'string'){
				    	if(url.substring(0,4) != 'http' && url.substring(0,1) != '/'){
				    		url = this_path +'/'+ url;
				    	}else if(url.substring(0,1) == '/'){
				    		url = settings.domain + url;
				    	}
				    	
				    	if(urls_toCrawl.indexOf(url) < 0 && urls_crawled.indexOf(url) < 0 && urls_ignore.indexOf(url) < 0){
							var re = new RegExp(settings.pattern_to_crawl,'gi');
				    		if(validUrl(url) && re.exec(url)){
				    			urls_toCrawl.push(url);
				    		}else{
				    			urls_ignore.push(url);
				    		}
				    	}
			    	}
			    });
		    }




		    /* Verify all URL patterns */
			for(var i in settings['crawl']){

				var crawl = settings['crawl'][i],
					re = new RegExp(crawl.pattern_url,'gi');


					/* Get HTML contents for each url pattern */
					if(re.exec(obj.uri)){

						if(!result.contents[crawl.id]){
							result.contents[crawl.id] = {};
						}


						var temp_obj = {}
						if(crawl.each_item){
							$(crawl.each_item).each(function(i,e){

								for(var selector in crawl.find){
									temp_obj[selector] = eval(crawl.find[selector]);
								}

								if(!result.contents[crawl.id][temp_obj.id]){
									if(typeof(crawl.callback) == 'function'){
										result.contents[crawl.id][temp_obj.id] = crawl.callback(temp_obj);
									}else{
										result.contents[crawl.id][temp_obj.id] = temp_obj;
									}
								}

								if(settings.log == true){
									log = fs.createWriteStream('smeagol-log.txt', {'flags': 'a'});
									log.write(temp_obj+'\r\n');
								}

							})
						}

						counter++;
					}

					// if(typeof(crawl.callback) == 'function'){
					// 	crawl.callback(result.contents[crawl.id]);
					// }
			}
			/* end patterns */

		    /* Add to crawled urls */
		    urls_crawled.push(obj.uri);

		    if (urls_toCrawl.indexOf(obj.uri) >= 0){
		    	urls_toCrawl.splice(urls_toCrawl.indexOf(obj.uri), 1);
		    }

			if(settings.continuous == true && urls_toCrawl.length > 0){
				module.exports.crawl({
					uri : urls_toCrawl[0]
				});
			}else{
				console.log('############# I finished, master ################');
				result.crawled = urls_crawled;
				if(typeof(settings.callback) == 'function'){
					settings.callback(result);
				}
				return result;
			}


		}
	});

}

function validUrl(url){
    var urlregex = new RegExp("^(http:\/\/(www.)?|https:\/\/(www.)?|ftp:\/\/(www.)?){1}([0-9A-Za-z]+\.)");
    if (urlregex.test(url)) {
        return true;
    }
    return false;
}


function download(url, callback) {
	http.get(url, function(res) {
		var data = "";
		res.setEncoding('binary')
		res.on('data', function (chunk) {
		  data += chunk;
	});
	res.on("end", function() {
		callback(data);
	});
	}).on("error", function() {
		callback(null);
	});
}