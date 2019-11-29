function myScroll(dom, config) {
    this.config = config || {}
    this.dom = dom;
    this.scrollW = this.config.width || 16;
    this.timeout = this.config.timeout || 1500;
    this.scroll_range = this.config.timeout || 20;
    this.container = null;
    this.scroll = null;
    this.scrollStyle = "border-radius:4px;width:80%;background-color:#999;cursor:pointer;" + (this.config.style || ""); // 默认滚动条条样式配置样式可以覆盖
    this.showScroll = false;
    this.offsetTop = 0;
    this.Time;
    this.init();
    this.event();
}
myScroll.prototype.init = function() {
    this.dom_scrollHeight = this.dom.scrollHeight;
    this.dom_height = this.dom.offsetHeight;
    this.dom_width = this.dom.offsetWidth;
    this.dom.style.overflow = "hidden"; // 消除原始的滚动条
    this.container = document.createElement('div'); // 创建容器框
    this.container.style = "display:none;position:absolute;height:" +
        this.dom_height + "px;width:" + this.scrollW + "px;top:" + this.dom.offsetTop + "px;left:" +
        (this.dom.offsetLeft + this.dom_width - this.scrollW) + "px;" +
        (this.config.containerStyle || ""); // 配置的样式可以覆盖默认配置
    this.scroll = document.createElement('div');
    this.scroll.style = this.scrollStyle + "height:" + (this.dom_height * this.dom_height / this.dom_scrollHeight) + "px"
    this.container.appendChild(this.scroll);
    document.body.appendChild(this.container); // 将进度条添加到body
    var _this = this;
    this.scroll.addEventListener('mousedown', function(e) {
        var spaceY = e.pageY - this.offsetTop;
        document.onmousemove = function(e) {
            _this.time();
            var y = e.pageY - spaceY;
            _this.dom.scrollTop = _this.dom.scrollHeight * y / _this.dom.offsetHeight;
            _this.scroll.style.marginTop = _this.dom.scrollTop * _this.dom.offsetHeight / _this.dom.scrollHeight + "px";
            //文字不被选中
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        };
    });
    document.addEventListener('mouseup', function() {
        document.onmousemove = null;
    })
}
myScroll.prototype.event = function() {
    var _this = this;
    this.dom.addEventListener('mousemove', function(e) {
        if (_this.dom_scrollHeight != _this.dom.scrollHeight) {
            document.body.removeChild(_this.container);
            _this.init(); //判断子元素高度是否改变，用来改变滚动条高度
        }
        var x;
        if (e.layerX || e.layerX == 0) { // 获取坐标
            x = e.layerX;
        } else if (e.offsetX || e.offsetX == 0) { // Opera
            x = e.offsetX;
        };
        if (x > _this.dom_width - _this.scrollW && _this.dom_height < _this.dom_scrollHeight) { //移动到右侧显示滚动条
            _this.container.style.display = "block";
            _this.time();
        }
    })
    this.dom.addEventListener('mousewheel', function(e) { // 
        if (_this.dom_height < _this.dom_scrollHeight) {
            _this.container.style.display = "block";
            _this.time();
            if (e.wheelDelta < 0) {
                _this.dom.scrollTop = _this.dom.scrollTop + _this.scroll_range;
            }
            if (e.wheelDelta > 0) {
                _this.dom.scrollTop = _this.dom.scrollTop - _this.scroll_range;
            }
            _this.scroll.style.marginTop = _this.dom.scrollTop * _this.dom.offsetHeight / _this.dom.scrollHeight + "px";
        }
    })
}
myScroll.prototype.time = function() {
    clearTimeout(this.Time);
    this.Time = setTimeout(() => {
        this.container.style.display = "none";
    }, this.timeout);
}