Vue.component('vue-progress',{
    template: `<div>
              <div :style="fullBarStyle">
                <div :style="progressBarStyle"></div>
              </div>
            </div>`,
    props: ['value'],
    created() {
        this.progressBarStyle.width = `${this.value}%`;
    },
    data() { return {
        fullBarStyle: {
            width: '80%',
            height: '2px',
            backgroundColor: 'var(--dark-gray)',
        },
        progressBarStyle: {
            width: '100%',
            height: '100%',
            backgroundColor: 'var(--blue)',
        }
    }},
})
Vue.component('image-viewer', {
    template:
        `<div :style="bgStyle" v-show="isShow" v-if="imgList">
      <div v-show="isShow" :style="ctStyle">
        <div :style="indicatorStyle">
          <button class="previous-img" :style="btnStyle" @click="prevImg"><</button>
          <span>{{ indicatorText }}</span>
          <button class="next" :style="btnStyle" @click="nextImg">></button>
        </div>
        <img
          ref="img"
          :src="imgList[index]"
          :style="imgStyle"
          @mousedown.prevent="mouseDown"
          @mouseup.prevent="mouseUp"
          @mouseleave.prevent="mouseLeave"
          @mousemove.prevent="mouseMove"
          @mousewheel.prevent="mouseWheel">
        <button class="close" :style="Object.assign({},btnStyle, closeBtnStyle)" @click="isShow = false">x</button>
      </div>
      <div v-show="isShow" class="shadow" :style="shadowStyle"></div>
    </div>`,
    props: {
        imgList: Array,
        initIndex: {
            type: Number,
            default: 0,
        },
        show: {
            type: Boolean,
            default: false,
        }
    },
    data() { return {
        ctHeight: 600,
        imgRatio: true,
        isMouseDown: false,
        scaleValue: 1,
        initialMouseX: 0,
        initialMouseY: 0,
        offsetX: '50%',
        offsetY: '50%',
        index: this.initIndex,
        isShow: this.show,
        bgStyle: {
            width: '100%',
            height: '100%',
            position: 'fixed',
            top: 0,
            left: 0,
            overflow: 'hidden',
            zIndex: 999,
        },
        shadowStyle: {
            backgroundColor: 'rgba(0,0,0,0.7)',
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: -1,
        },
        ctStyle: {
            overflow: 'hidden',
            border: '5px solid silver',
            borderRadius: '5px',
            width: '800px',
            height: '600px',
            position: 'absolute',
            left: '50%',
            top: '50%',
            marginLeft: '-400px',
            marginTop: '-300px',
            backgroundColor: 'black',
        },
        imgStyle: {
            position: 'absolute',
            marginTop: 0,
            marginLeft: 0,
            height: 'auto',
            width: 'auto',
            top: 'auto',
            left: 'auto',
            opacity: 1,
            transform: 'scale(1)',
            transformOrigin: '50% 50%',
            cursor: ['-webkit-grab', 'grab'],
        },
        indicatorStyle: {
            zIndex: 2,
            position: 'absolute',
            bottom: '20px',
            width: '300px',
            left: '50%',
            marginLeft: '-150px',
            textAlign: 'center',
            color: 'white',
            fontSize: '12px',
        },
        btnStyle: {
            fontSize: '12px',
            outline: '0px',
            width: '60px',
            height: '25px',
            borderRadius: '6px',
            border: '1px solid var(--tr-border-color)',
            fontWeight: 'bold',
            backgroundImage: 'linear-gradient(to bottom,#f2f2f2,#cccccc)',
            margin: '0 20px',
            cursor: 'pointer',
        },
        closeBtnStyle: {
            position: 'absolute',
            zIndex: 2,
            top: '20px',
            right: '30px',
        },
    }},
    watch: {
        ctHeight: function(newValue) {
            let width = parseInt((newValue/3)*4+1);
            this.ctStyle.height = `${newValue}px`;
            this.ctStyle.width = `${width}px`;
            this.ctStyle.marginLeft = `-${width/2}px`;
            this.ctStyle.marginTop = `-${newValue/2}px`;
            this.setImgSize();
        },
        index: function(newValue) {
            this.loading();
            this.imgStyle.opacity = 0;
            this.transformInit();
            this.$refs.img.onload = async () => {
                await this.setImgRatio();
                this.setImgSize();
                this.loaded();
                this.imgFadeIn();
            };
        },
        initIndex(val) {
            this.index = val;
        },
        scaleValue: function(newValue) {
            this.imgStyle.transform = `scale(${newValue})`;
            if(newValue === 1) this.imgStyle.transformOrigin = '50% 50%';
        },
        show(val) {
            this.isShow = val;
        },
        isShow: function(newValue) {
            if(newValue) {
                document.body.style.overflow = 'hidden';
                document.body.onmousewheel = () => {
                    event.preventDefault();
                }
            } else {
                document.body.style.overflow = '';
                document.body.onmousewheel = null;
            }
            const set = async () => {
                await this.setImgRatio();
                this.setImgSize();
            };
            set();
            this.$emit('change-show',newValue);
        },
    },
    computed: {
        indicatorText() {
            return `${this.index+1} / ${this.lastIndex}`;
        },
        lastIndex() {
            return this.imgList.length;
        },
    },
    methods: {
        setCtHeight() {
            let winHeight = window.innerHeight;
            if(winHeight >= 600){
                this.ctHeight = winHeight*0.8;
            };
        },
        setImgRatio: async function() {
            this.imgStyleInit();
            let width = this.$refs.img.naturalWidth;
            let height = this.$refs.img.naturalHeight;
            if(width / height < 4 / 3) {
                this.imgRatio = false;
                this.imgStyle.height = '100%';
                this.imgStyle.left = '50%';
            } else {
                this.imgRatio = true;
                this.imgStyle.width = '100%';
                this.imgStyle.top = '50%';
            };
            // this.setImgSize();
        },
        imgStyleInit() {
            this.imgStyle.height = 'auto';
            this.imgStyle.width = 'auto';
            this.imgStyle.top = 'auto';
            this.imgStyle.left = 'auto';
            this.imgStyle.marginTop = 0;
            this.imgStyle.marginLeft = 0;
        },
        setImgSize() {
            if(this.imgRatio) {
                let height = this.$refs.img.height;
                this.imgStyle.marginTop = `-${height/2}px`;
            }else {
                let width = this.$refs.img.width;
                this.imgStyle.marginLeft = `-${width/2}px`;
            }
        },
        imgFadeIn() {
            clearInterval(this.fadeTimer);
            this.fadeTimer = setInterval(() => {
                this.imgStyle.opacity+= 0.005;
            if(this.imgStyle.opacity >= 1){
                clearInterval(this.fadeTimer);
            }
        },1)
        },
        nextImg() {
            this.index += 1
            if(this.index === this.lastIndex) this.index = 0;
        },
        prevImg() {
            if(this.index === 0) this.index = this.lastIndex;
            this.index -= 1;
        },
        mouseDown(e) {
            this.initialMouseX = e.offsetX;
            this.initialMouseY = e.offsetY;
            this.isMouseDown = true;
            this.imgStyle.cursor = ['-webkit-grabbing', 'grabbing'];
        },
        mouseUp(e) {
            this.isMouseDown = false;
            this.imgStyle.cursor = ['-webkit-grab', 'grab'];
        },
        mouseLeave(e) {
            this.isMouseDown = false;
            this.imgStyle.cursor = ['-webkit-grab', 'grab'];
        },
        mouseWheel(e) {
            if(this.isMouseDown) return;
            let delta = e.wheelDelta;
            if(delta > 0 && this.scaleValue < 3) {
                this.scaleValue += 0.1;
            }else if(delta < 0 && this.scaleValue > 1) {
                this.scaleValue -= 0.1;
            };
        },
        mouseMove(e) {
            if(!this.isMouseDown) return;
            if(this.scaleValue === 1) return;
            let imgHeight = this.$refs.img.height;
            let imgWidth = this.$refs.img.width;
            let offsetArr =  this.imgStyle.transformOrigin.split(' ');
            console.log(offsetArr);
            let currentImgX = imgWidth/2;
            let currentImgY = imgHeight/2;
            if(offsetArr[0] !== '50%' && offsetArr[1] !== '50%') {
                currentImgX = Number(offsetArr[0].replace('px', ''));
                currentImgY = Number(offsetArr[1].replace('px', ''));
            }
            let currentMouseX = e.offsetX;
            let currentMouseY = e.offsetY;
            let computedX = currentImgX- (currentMouseX- this.initialMouseX)/this.scaleValue;
            let computedY = currentImgY- (currentMouseY- this.initialMouseY)/this.scaleValue;
            // console.log(parseInt(computedX), parseInt(computedY));
            // console.log(currentMouseX, this.initialMouseX, currentImgX)
            if(
                (computedX < 0 || computedX > imgWidth)
                && (computedY < 0 || computedY > imgHeight)
            ) {
                return;
            } else if(computedX < 0 || computedX > imgWidth) {
                this.imgStyle.transformOrigin = `${currentImgX}px ${computedY}px`;
            } else if(computedY < 0 || computedY > imgHeight) {
                this.imgStyle.transformOrigin = `${computedX}px ${currentImgY}px`;
            } else {
                this.imgStyle.transformOrigin = `${computedX}px ${computedY}px`;
            };
        },
        transformInit() {
            this.imgStyle.transform = 'scale(1)';
            this.imgStyle.transformOrigin = '50% 50%';
        },
        loading() {
            this.imgStyle.cursor = 'progress';
            document.body.style.cursor = 'progress';
        },
        loaded() {
            this.imgStyle.cursor = ['-webkit-grab', 'grab'];
            document.body.style.cursor = 'auto';
        },
    },
    mounted() {
        // this.ctHeight = 800;
        this.setCtHeight();
        window.onresize = () => {
            this.setCtHeight();
        };
        this.$refs.img.onload = async () => {
            await this.setImgRatio();
            this.setImgSize();
        };
    },
});
new Vue({
    el: '#resume',
    data: {
        msg: '',
        msgList: ['你好', '欢迎', '兴趣', '勤奋', '责任',],
        skillList: [
            {
                name: 'HTML 5',
                percentage: 70,
            },{
                name: 'CSS 3',
                percentage: 70,
            },{
                name: 'JavaScript',
                percentage: 80,
            },{
                name: 'jQuery',
                percentage: 80,
            },
            {
                name: 'Boostrap',
                percentage: 50,
            },{
                name: 'Photoshop',
                percentage: 70,
            },
            {
                name: 'Vue',
                percentage: 50,
            }
        ],
        practiceList: [
            {
                title: '音乐播放器',
                href: 'http://book.jirengu.com/jirengu-inc/jrg-vip9/members/%E4%BD%99%E6%98%9F%E8%BE%B0/fm/src/index.html',
            },{
                title: '前端工程化页面',
                href: 'https://xxxzxx.github.io/xxxZxxx/gulp-page/id=1',
            },{
                title: '静态页面',
                href: 'https://xxxzxx.github.io/xxxZxxx/static-page/id=1/',
            },{
                title: '日期选择器',
                href: 'https://xxxzxx.github.io/xxxZxxx/DatePicker',
            },{
                title: '轮播',
                href: 'https://xxxzxx.github.io/xxxZxxx/plugins/carousel.html',
            },{
                title: '弹窗',
                href: 'https://xxxzxx.github.io/xxxZxxx/plugins/dialog.html',
            },{
                title: '瀑布流',
                href: 'https://xxxzxx.github.io/xxxZxxx/plugins/waterfull',
            },{
                title: '懒加载',
                href: 'https://xxxzxx.github.io/xxxZxxx/plugins/lazyload',
            },{
                title: '3d-banner',
                href: 'https://xxxzxx.github.io/xxxZxxx/3d-banner',
            },{
            title:'tab',
                href:'https://xxxzxx.github.io/xxxZxxx/plugins/tab.html',
            }
        ]
    },
    mounted() {
        Vue.nextTick(() => {
            this.changeMsg();
        this.pageLoading = false;
    })
    },
    methods: {
        changeMsg() {
            const self = this;
            let num = 0;
            async function write(text) {
                for (let i = 0; i < text.length; i++) {
                    await new Promise(r => {
                        self.msg += text[i];
                    setTimeout(r,500);
                })
                }
            }
            async function erase() {
                while(self.msg.length > 0) {
                    await new Promise(r => {
                        self.msg = self.msg.slice(0,self.msg.length - 1);
                    setTimeout(r,300);
                })
                }
            }
            async function change() {
                while(true) {
                    await write(self.msgList[num]);
                    await new Promise(r => {
                        setTimeout(r, 2000);
                });
                    await erase();
                    if(num === self.msgList.length - 1) {
                        num = 0;
                    } else {
                        num += 1;
                    }
                }
            }
            change();
        },
        showImg(index) {
            this.imgIndex = index;
            this.imgShow = true;
        },
        changeShow(val) {
            this.imgShow = val;
        },
    }
})