/*
	Smeagol, nodeJS scrapper to crawl content in HTML pages using html selectors
*/

module.paths.unshift('/usr/local/lib/node_modules/');

const fs = require('fs'),
	http = require('http'),
	https = require('https'),
	cheerio = require("cheerio"),
	q = require('q'),
	emmiter    = require("events").EventEmitter;

class Smeagol extends emmiter{

    constructor(settings) {
    	super();
		let self = this;

		self.settings = settings;
		self.results = {
			contents : {}
		};
		self.counter = 0;
		self.running = 0;
		self.openQueue = 0;

		self.queue = {
			crawled : [],
			toCrawl : [],
			ignore : [],
			addUrl : function(url){
				if(typeof(url) == 'string'){
					if(url.substring(0,4) != 'http' && url.substring(0,1) != '/'){
						url = this_path +'/'+ url;
					}else if(url.substring(0,1) == '/'){
						url = self.settings.domain + url;
					}
					
					if(self.queue.toCrawl.indexOf(url) < 0 && 
						self.queue.crawled.indexOf(url) < 0 && 
						self.queue.ignore.indexOf(url) < 0){
						var re = new RegExp(self.settings.pattern_to_crawl,'gi');
						if(validUrl(url) && re.exec(url)){
							self.queue.toCrawl.push(url);
						}else{
							self.queue.ignore.push(url);
						}
					}
				}
			},
			getNext : function(){
				return self.queue.toCrawl[0];
			},
			hasNext : function(){
				return self.queue.toCrawl.length > 0;
			},
			crawlNext : function(){
				if(self.settings.continuous == true && self.queue.hasNext()){
					for(let i = self.openQueue; i < self.settings.maxConcurrency; i++){
						if(self.settings.limit && self.counter <= self.settings.limit){
							let url = self.queue.getNext();
							self.queue.updateUrl(url);
							self.crawl({
								uri : url
							});
						}
					}
				}
			},
			updateUrl : function(url){
				self.queue.crawled.push(url);

				if (self.queue.toCrawl.indexOf(url) >= 0){
					self.queue.toCrawl.splice(self.queue.toCrawl.indexOf(url), 1);
				}
			}
		}
    }
}


Smeagol.prototype.crawl = function(obj){
	let self = this;

	self.openQueue++;
	self.counter++;
	
	if(self.settings.log != ''){
		if (!fs.existsSync('logs')){
			fs.mkdirSync('logs');
		}
		log = fs.createWriteStream('logs/' + self.settings.log , {'flags': 'a'});
		log.write(obj.uri+'\r\n');
	}

	this_path = obj.uri.split('/');
	this_path.pop();
	this_path = this_path.join('/');

	self.download(obj.uri)
	.then(function(data) {
		self.openQueue--;

		data = data.data;
		if (data) {
			var $ = cheerio.load(data);

			/* Get all links and "categorize" to continuous crawling */
		    if(self.settings.continuous){
			    $('a').each(function(index){
			    	self.queue.addUrl($(this).attr('href'));
			    });
		    }

		    /* Verify all URL patterns */
			for(var i in self.settings['crawl']){

				var crawl = self.settings['crawl'][i],
					re = new RegExp(crawl.pattern_url,'gi');

					/* Get HTML contents for each url pattern */
					if(re.exec(obj.uri)){

						if(!self.results.contents[crawl.id]){
							self.results.contents[crawl.id] = {};
						}

						var temp_obj = {}
						if(crawl.each_item){
							$(crawl.each_item).each(function(i,e){

								for(var selector in crawl.find){
									temp_obj[selector] = eval(crawl.find[selector]);
								}

								if(!self.results.contents[crawl.id][temp_obj.id]){
									self.results.contents[crawl.id][temp_obj.id] = temp_obj;
									self.emit('crawl', obj.uri, temp_obj);
								}

							})
						}

					}


			}
			/* end patterns */

			/* Complete */ 
			if(self.settings.limit && self.counter >= self.settings.limit && self.openQueue == 0){
				self.emit('complete', self.results);
				return self;
			}
		    self.queue.crawlNext();
		}
	})
	.catch(function (error) {
		self.emit('error', error);
	});
	return self;
}

Smeagol.prototype.download = function(url){
	let self = this,
		deferred = q.defer(),
		data = '',
		protocol = defineProtocol(url);

	if(protocol != 'http' && protocol != 'https'){
		deferred.reject(`Protocol ${protocol} not supported. Error to crawl ${url}`);
		return deferred.promise;
	}

	protocol = (protocol == 'http') ? http : https;

	protocol.get(url, function(res) {
		res.setEncoding('binary')
		res.on('data', function (chunk) {
		  data += chunk;
	});
	res.on('end', function() {
		deferred.resolve({data : data, url : url});
	});
	}).on('error', function(err) {
		deferred.reject(err);
	});
	return deferred.promise;
}

function validUrl(url){
	let urlRegex = new RegExp('^(http:\/\/(www.)?|https:\/\/(www.)?|ftp:\/\/(www.)?){1}([0-9A-Za-z]+\.)');
	return urlRegex.test(url);
}

function defineProtocol(url){
	let protocolRegex = /^(https?):\/\//i;
	return url.match(protocolRegex)[1]
}



module.exports = Smeagol;