var redirects = [],
    redirect = [];

var news_sources = {
                'YAHOO': {url: 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%3D%22http%3A%2F%2Frss.news.yahoo.com%2Frss%2Ftopstories%22&format=json&diagnostics=true'},
                'CNN': {url: 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%3D%22http%3A%2F%2Frss.cnn.com%2Frss%2Fcnn_topstories.rss%22&format=json&diagnostics=true'},
                'NYTIMES': {url: 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%3D%22http%3A%2F%2Fwww.nytimes.com%2Fservices%2Fxml%2Frss%2Fnyt%2FWorld.xml%22&format=json&diagnostics=true'},
                'RT': {url: 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%3D%22https%3A%2F%2Fwww.rt.com%2Frss%2Fnews%2F%22&format=json&diagnostics=true'},
                'BBC': {url: 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%3D%22http%3A%2F%2Ffeeds.bbci.co.uk%2Fnews%2Fworld%2Frss.xml%22&format=json&diagnostics=true'}
              };
              // &callback=cbfunc

var body = $('body'),
    loading_screen = $('.loading_screen'),
    white_screen = $('.white_screen'),
    logo = $('.logo'),
    news_source = $('.news_source'),
    title = $('.title'),
    date = $('.date'),
    print_screen = $('.print_screen');
    
$(window).scroll(function() {
    var countdown = white_screen.position().top - window.innerHeight;
    if (countdown == window.innerHeight) { 
        white_screen.hide(); 
        loading_screen.show();
        print_articles();
        setTimeout(function() {
            white_screen.show();
            body.scrollTop(0);
            loading_screen.hide();
        }, 250)
    }
    clearTimeout($(this).data(this, 'timer'));
    $(window).data(this, 'timer', setTimeout(function() { logo.html('&#8631;'); }, 300));
    logo.html('&#8631; Redirect&nbsp;');
})
    
var get_date = function() {
    var date = new Date(),
        hour = date.getHours(),
        minutes = date.getMinutes(),
        month = date.getMonth(),
        day = date.getDate(),
        year = date.getFullYear(),
        time_of_day;
        
    if (minutes.toString().length < 2) { minutes = '0' + minutes.toString(); }
    if (hour > 12) {
        hour = hour - 12;
        time_of_day = ' PM';
    } else if (hour == 0) {
        hour = 12;
        time_of_day = ' AM';
    } else if (hour == 12) {
        time_of_day = ' PM';
    } else {
        time_of_day = ' AM';
    }
    var record = (month + 1) + '.' + day + '.' + year + ', ' + hour + ':' + minutes + time_of_day;
    return record;
};

var get_articles = function(current_source) {
    $.ajax({
        url: news_sources[current_source].url,
        dataType: 'jsonp',
        jsonp: 'callback',
        // jsonpCallback: 'cbfunc',
        success: function(data){
            var json_data = data.query.results.item;
            var no_items = 10;
            for (var i = 0; i < no_items; i++) {
                if (current_source == "YAHOO") {
                    redirect[0] = "YAHOO";
                    redirect[1] = json_data[i].link;
                }
                if (current_source == "CNN") {
                    redirect[0] = "CNN";
                    redirect[1] = json_data[i].guid.content;
                }
                if (current_source == "NYTIMES") {
                    redirect[0] = "NYTIMES";
                    redirect[1] = json_data[i].guid.content;
                }
                if (current_source == "RT") {
                    redirect[0] = "RT";
                    redirect[1] = json_data[i].guid;
                }
                if (current_source == "BBC") {
                    redirect[0] = "BBC";
                    redirect[1] = json_data[i].guid.content;
                }
                redirects.push(redirect);
                redirect = [];
            }
            redirect = [];
        }
    })
}

var make_title = function(title) {
    var new_title = title;
    if (title.search('.HTML')) { new_title = new_title.replace('.html', ''); }
    if (title.search('HTTP://')) { new_title = new_title.replace('http://', ''); }
    if (title.search('HTTPS://')) { new_title = new_title.replace('https://', ''); }
    if (title.search('WWW.')) { new_title = new_title.replace('www.', ''); }
    if (title.search('.COM')) { new_title = new_title.slice(new_title.search('.com') + 4, 100); }
    if (title.search('.CO')) { new_title = new_title.replace('.co', ''); }
    if (title.search('.UK')) { new_title = new_title.replace('.uk', ''); }
    return new_title;
}

var print_articles = function() {
    var random = Math.floor(Math.random()*redirects.length);
    random = redirects[random];
    news_source.html(random[0]);
    title.html(make_title(random[1])).attr('href', random[1]);
    date.html(get_date());
    Cookies.set('date', get_date());
    Cookies.set('title', make_title(random[1]));
    Cookies.set('titlehref', random[1]);
    Cookies.set('news_source', random[0]);
    window.open(random[1]);
}

$(document).ready(function() {
    loading_screen.hide();
    date.html(Cookies.get('date'));
    news_source.html(Cookies.get('news_source'));
    title.html(Cookies.get('title')).attr('href', Cookies.get('titlehref'));
    for (var i = 0; i < Object.keys(news_sources).length; i++) {
        get_articles(Object.keys(news_sources)[i]);
    }
})

