var baseUrl = 'http://ajax.frontend.itheima.net';
$.ajaxPrefilter(function(options) {
    options.url = baseUrl + options.url
    console.log(options.url);
})