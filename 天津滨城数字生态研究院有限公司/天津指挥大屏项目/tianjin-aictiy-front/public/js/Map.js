(function () {
    window.BMapGL_loadScriptTime = (new Date).getTime();
    window.BMapGL = window.BMapGL || {};
    window.BMapGL.apiLoad = function () {
        delete window.BMapGL.apiLoad;
        if (typeof init == "function") {
            init()
        }
    };
    var s = document.createElement('script');
    s.src = 'http://api.map.baidu.com/getscript?type=webgl&v=1.0&ak=Aa1fulopZQjKejNyt7c6zxyjpFisi0HF&services=&t=20220422151616';
    document.body.appendChild(s);
    var link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', 'http://api.map.baidu.com/res/webgl/10/bmap.css');
    document.getElementsByTagName('head')[0].appendChild(link);
})();