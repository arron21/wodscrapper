var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

var tumblr = require('tumblr');

var oauth = {
    consumer_key: 'Tzt0n6bNFIR5HS3QJA7zGYXFMPcIRgs0Oz8l0ajLmh9rigxuAZ',
    consumer_secret: 'CuUQcb2XzYMAEnvfYlTmXbcapVsu6SuRoy3VOLR1OWsYNw0NlC',
    token: '0XwV0xz8e0ZXBj9SYWLfynaAn87HiSuDDBl4Sz0VVSNGvXQTit',
    token_secret: 'Hm32QfST5NqSO8ZixCHraYFKti3KVOOPpvZDVeskuCaOBXcHEW'
};

postBlog = function(data, date) {
    console.log('posting');
    console.log(data.text);
    console.log(date);
    var blog = new tumblr.Blog('wodfirst.tumblr.com', oauth);

    console.log(blog);
    blog.text({title: date, body: data.text}, function(error, response) {
        if (error) {
            throw new Error(error);
        }

        console.log('did blog test');
        console.log(response);
        console.log(response.posts);
    });

    blog.following(function (err, data) {
        console.log(data);
    });

};

getDate = function() {
    var d = new Date();
    const year = d.getFullYear();
    var d = new Date();
    var month = d.getMonth();
    if(month.toString().length === 1) {
        month = '0' + (month + 1);
    }
    var d = new Date();
    var day = d.getDate();
    var date = {
        year: year,
        month: month,
        day: day
    }

    return date;
}

app.get('/scrape', function(req, res){
    // Build url first

    var date = new getDate();

    url = 'https://www.crossfit.com/workout/'+date.year+'/'+date.month+'/'+date.day+'';
    var date = year+'-'+month+'-'+year;

    request(url, function(error, response, html){
        if(!error){

            console.log('start scrape');

            var $ = cheerio.load(html);

            var wod;
            var json = { text : ""};

            $('#wodContainer').filter(function(){
                wod = $(this).text();
                json.text = wod;
            })

            console.log('scrape done');

        } else {
            console.log('there was an error');
        }

        postBlog(json, date);

        // fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
        //     console.log('File successfully written! - Check your project directory for the output.json file');
        // })

        res.send('Check your console!')
    })
});



app.listen('8081');
console.log('refresh port 8081');
exports = module.exports = app;