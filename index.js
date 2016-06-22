'use strict';

/* 糗事百科采集工具 */

var request = require('requrl');
var assert = require('assert');

/*
 * 采集主函数
 * @param {number} 开始页码
 * @param {number} 结束页码
 * @param {function} 完成后的回调函数，参数为数组
 */
module.exports = function(pagefrom, pageto, cb){
	assert(typeof pagefrom == 'number', 'Invalid pagefrom type');
	assert(typeof pageto == 'number', 'Invalid pageto type');
	assert(typeof cb == 'function', 'Invalid callback type');
	
	// 整理页码
	var from = pagefrom <= pageto ? pagefrom : pageto;
	var to = pageto >= pagefrom ? pageto : pagefrom;
	
	// 保存结果的数组
	var result = [];
	
	//  已完成的页数
	var finished = 0;
	
	// 开始采集
	for(var i = from; i <= to; i++){
		var page = i;
		var url = i == 1 ? 'http://www.qiushibaike.com/' : 'http://www.qiushibaike.com/8hr/page/' + i + '/';
		request({
			url: url,
			headers: {
				"referer": 'http://www.qiushibaike.com/',
				"user-agent": 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.23 Mobile Safari/537.36'
			},
			success: function(buf){
				var data = buf.toString().replace(/(\r|\n)/g, '');
				var matches = data.match(/<div class\=\"mlr mt10 content\-text\">.*?<\/div>/g);
				for(var j = 0 ; j < matches.length; j++){
					var str = matches[j].match(/^<div class\=\"mlr mt10 content\-text\">(.*?)<\/div>$/)[1];
					str = str.replace(/\s/g, '');
					str = str.replace(/\&nbsp\;/g, ' ');
					result.push(str);
				}
				finished++;
				if(finished == to - from + 1) cb.call(null, result);
			},
			error: function(err){
				console.log('获取第' + page + '页失败');
				finished++;
				if(finished == to - from + 1) cb.call(null, result);
			}
		});
	}
}
