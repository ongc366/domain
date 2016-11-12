var redirect = [],
    redirects = [];

var rec_date = $('.date'),
    rec_name = $('.name'),
    rec_source = $('.news_source'),
    white_screen = $('.white_screen'),
    loading = $('.loading'),
    logo = $('.logo'),
    countdown = white_screen.position().top,
    source,
    link;
    
loading.hide();

$(window).scroll(function() {
    countdown = white_screen.position().top - window.innerHeight;
    if (countdown == window.innerHeight) { 
        white_screen.hide(); 
        loading.show();
        print_redirect();
        setTimeout(function() { 
            white_screen.show();  
            loading.hide(); 
            $('body').scrollTop(0);  
            retrieve_news();
        }, 250); 
    }
    clearTimeout($(this).data(this, 'timer'));
    $(window).data(this, 'timer', setTimeout(function() { logo.html('&#8631;'); }, 300));
    logo.html('&#8631; REDIRECT&nbsp;');
})

var time_accessed = function() {
    var date = new Date(),
        record,
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
    }else if (hour == 12) {
        time_of_day = ' PM';
    } else {
        time_of_day = ' AM';
    }
    record = month + '.' + day + '.' + year + ', ' + hour + ':' + minutes + time_of_day;
    return record;
};

var create_title = function(link) {
    var title = link;
    title = title.replace('.html', '');
    title = title.replace('http://', '');
    title = title.slice(title.search('.com') + 5);
    return title;
}

var print_redirect = function() {
    var random = Math.floor(Math.random()*redirects.length);
    random = redirects[random];
    source = random[0];
    link = random[1];
    rec_date.html(time_accessed());
    rec_source.html(source);
    rec_name.html(link).attr('href', link);
    Cookies.set('rec_date', time_accessed(), {expires: 1});
    Cookies.set('rec_source', source, {expires: 1});
    Cookies.set('rec_name', link, {expires: 1});
    window.open(link);
}

var current_source;

var sources = {
                'yahoo': { 'url': 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%3D%22http%3A%2F%2Frss.news.yahoo.com%2Frss%2Ftopstories%22&format=json&diagnostics=true&callback=cbfunc'},
                'cnn': {'url': 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%3D%22http%3A%2F%2Frss.cnn.com%2Frss%2Fcnn_topstories.rss%22&format=json&diagnostics=true&callback=cbfunc'},
                'nytimes': {'url': 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%3D%22http%3A%2F%2Fwww.nytimes.com%2Fservices%2Fxml%2Frss%2Fnyt%2FWorld.xml%22&format=json&diagnostics=true&callback=cbfunc'},
                'rt': {'url': 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%3D%22https%3A%2F%2Fwww.rt.com%2Frss%2Fnews%2F%22&format=json&diagnostics=true&callback=cbfunc'},
                'bbc': {'url': 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%3D%22http%3A%2F%2Ffeeds.bbci.co.uk%2Fnews%2Fworld%2Frss.xml%22&format=json&diagnostics=true&callback=cbfunc'}
              };

var random_sources = function() {
    var random = Math.floor(Math.random()*Object.keys(sources).length);
    var url = sources[Object.keys(sources)[random]].url;
    current_source = Object.keys(sources)[random];
    return url.toString();
    console.log(current_source);
}

function retrieve_news() {
$.ajax({
    url: random_sources(),
    dataType: 'jsonp',
    jsonp: 'callback',
    jsonpCallback: 'cbfunc',
    success: function(data){
        var json_data = data.query.results.item,
            no_items= 20;
        for (var i = 0; i < no_items; i++) {
            redirect = [];
            if (current_source == 'yahoo') {
                source = json_data[i].source.content.toUpperCase();
                link = json_data[i].link;
            }
            if (current_source == 'cnn') {
                source = 'CNN';
                link = json_data[i].origLink;
            }
            if (current_source == 'nytimes') {
                source = 'NEW YORK TIMES';
                link = json_data[i].guid.content;
            }
            if (current_source == 'rt') {
                source = 'RUSSIA TODAY';
                link = json_data[i].guid;
            }
            if (current_source == 'bbc') {
                source = 'BBC';
                link = json_data[i].guid.content;
            }
            redirect.push(source, link);
            redirects.push(redirect);
        }
        redirect = [];
        source = link = '';
        console.log(json_data);
    }
})
}

$(document).ready(function() { 
    retrieve_news(); 
    loading.hide(); 
    rec_date.html(Cookies.get('rec_date'));
    rec_source.html(Cookies.get('rec_source'));
    rec_name.html(Cookies.get('rec_name'));
})