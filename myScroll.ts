
export class MyScroll {  // 自定义兼容性高的滚动条
    config: { [key: string]: any };
    dom: HTMLElement | null;
    scrollW: number;
    timeout: number;
    scroll_range: number;
    container: HTMLDivElement;
    scroll: HTMLDivElement;
    scrollStyle: string;
    showScroll: boolean;
    offsetTop: number;
    Time: NodeJS.Timer | any;
    dom_scrollHeight: number;
    dom_height: number;
    dom_width: number;

    constructor(dom: HTMLElement | null, config: { [key: string]: any }) {
        this.config = config || {}
        this.dom = dom;
        this.scrollW = this.config.width || 16;
        this.timeout = this.config.timeout || 1500;
        this.scroll_range = this.config.timeout || 20;
        this.container = document.createElement('div');
        this.scroll = document.createElement('div');
        this.scrollStyle = "border-radius:4px;width:80%;background-color:#999;cursor:pointer;" + (this.config.style || "") + ';'; // 默认滚动条条样式配置样式可以覆盖
        this.showScroll = false;
        this.offsetTop = 0;
        this.Time = 0;
        this.dom_scrollHeight = 0;
        this.dom_height = 0;
        this.dom_width = 0;
        this.init();
        this.event();
    }
    init() {
        if (this.dom) {
            this.dom_scrollHeight = this.dom.scrollHeight;
            this.dom_height = this.dom.offsetHeight;
            this.dom_width = this.dom.offsetWidth;
            this.dom.style.overflow = "hidden"; // 消除原始的滚动条
            this.container && ((this.container as any).style = "display:none;position:absolute;height:" +
                this.dom_height + "px;width:" + this.scrollW + "px;top:" + this.dom.offsetTop + "px;left:" +
                (this.dom.offsetLeft + this.dom_width - this.scrollW) + "px;" +
                (this.config.containerStyle || "")); // 配置的样式可以覆盖默认配置
            (this.scroll as any).style = this.scrollStyle + "height:" + (this.dom_height * this.dom_height / this.dom_scrollHeight) + "px";
            this.container.appendChild(this.scroll);
            document.body.appendChild(this.container); // 将进度条添加到body
            this.scroll.addEventListener('mousedown', (e) => {
                var spaceY = e.pageY - this.offsetTop;
                document.onmousemove = (e) => {
                    this.time();
                    var y = e.pageY - spaceY;
                    if (this.dom) {
                        this.dom.scrollTop = this.dom.scrollHeight * y / this.dom.offsetHeight;
                        this.scroll.style.marginTop = this.dom.scrollTop * this.dom.offsetHeight / this.dom.scrollHeight + "px";
                    }
                    //文字不被选中
                    const sec = window.getSelection();
                    if (sec) {
                        sec.removeAllRanges()
                    }
                };
            });
            document.addEventListener('mouseup', () => {
                document.onmousemove = null;
            })
        }
    }
    event() {
        if (this.dom) {
            this.dom.addEventListener('mousemove', (e: any) => {
                if (this.getAbsolute(e.target)) {
                    return;
                }
                if (this.dom) {
                    if (this.dom_scrollHeight != this.dom.scrollHeight) {
                        this.container && document.body.removeChild(this.container);
                        this.init(); //判断子元素高度是否改变，用来改变滚动条高度
                    }
                }
                var x;
                if (e.layerX || e.layerX == 0) { // 获取坐标
                    x = e.layerX;
                } else if (e.offsetX || e.offsetX == 0) { // Opera
                    x = e.offsetX;
                };
                if (x > this.dom_width - this.scrollW && this.dom_height < this.dom_scrollHeight) { //移动到右侧显示滚动条
                    this.container && (this.container.style.display = "block");
                    this.time();
                }
            })
            this.dom.addEventListener('mousewheel', (e:any) => { // 
                if (this.getAbsolute(e.target)) {
                    return;
                };
                if (this.dom_height < this.dom_scrollHeight) {
                    this.container && (this.container.style.display = "block");
                    this.time();
                    if (this.dom) {
                        if (e.wheelDelta < 0) {
                            this.dom.scrollTop = this.dom.scrollTop + this.scroll_range;
                        }
                        if (e.wheelDelta > 0) {
                            this.dom.scrollTop = this.dom.scrollTop - this.scroll_range;
                        }
                        this.scroll && (this.scroll.style.marginTop = this.dom.scrollTop * this.dom.offsetHeight / this.dom.scrollHeight + "px");
                    }
                };
            })
        }
    }
    time() {
        clearTimeout(this.Time);
        this.Time = setTimeout(() => {
            this.container && (this.container.style.display = "none");
        }, this.timeout);
    }
    getAbsolute(dom: HTMLElement):boolean {
        if (dom == this.dom) {
            return false
        }
        if (dom.style.top && dom.style.bottom) {
            return true;
        } else {
            return dom.parentElement ? this.getAbsolute(dom.parentElement) : false;
        }
    }
}