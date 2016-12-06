// define(function(){
  var Carousel = (function($node){
    var _Carousel = function ($node){
      this.$carousel = $node;
      this.init();
      this.bind();

    }
    _Carousel.prototype = {
      init:function(){
            var $ct = this.$ct = this.$carousel.find('.img-ct'),
            $items = this.$items = $ct.children(),
            imgCount = this.imgCount = $items.size(),
            imgWidth = this.imgWidth = $items.width(),
            $bullet = this.$bullet = this.$carousel.siblings('.bullet'),
            $next = this.$next = this.$carousel.siblings('.next'),
            $pre = this.$pre = this.$carousel.siblings('.pre');

            this.clock;
            this.curIdx = 0;
            this.isAnimate = false;

          this.autoPlay();
          this.bullet();
          $ct.prepend($items.last().clone());
          $ct.append($items.first().clone());
          imgRealCount = this.imgRealCount = $ct.children().size();
          this.$itemsReal = $ct.children();
          this.setBg();
          $ct.css({left: 0 - imgWidth, width: imgRealCount * imgWidth});
      },
      bind:function(){

          var _this = this;
          this.$next.on('click', function(){
            _this.playNext();
          });
          this.$pre.on('click', function(){
            _this.playPre();
          });
          this.$bullet.on('click', 'li', function(){
            var idx = $(this).index();
            if (idx > _this.curIdx) {
              _this.playNext(idx - _this.curIdx);
            } else if (idx < _this.curIdx) {
              _this.playPre(_this.curIdx - idx);
            }
          });
      },
      playNext:function(skip){
        var _this = this;
            var skip = skip || 1;
            if (!this.isAnimate) {
              this.isAnimate = true;
              this.$ct.animate({left: '-=' + (this.imgWidth * skip)}, function(){
              _this.curIdx = (_this.curIdx + skip) % _this.imgCount;
              if (_this.curIdx == 0) {
                _this.$ct.css({left: 0 - _this.imgWidth});
              }
              _this.isAnimate = false;
                _this.setBullet();
              })

            }
      },
      playPre:function(skip){
        console.log('pre');
        var _this = this;
            var skip = skip || 1;
            if (!this.isAnimate) {
              this.isAnimate = true;
              this.$ct.animate({left: '+=' + (this.imgWidth * skip)}, function(){
                _this.curIdx = (_this.imgCount + _this.curIdx - skip) % _this.imgCount;
                if (_this.curIdx == (_this.imgCount - 1)) {
                  _this.$ct.css({left: 0 - _this.imgWidth * _this.imgCount});
                }
                _this.isAnimate = false;
                _this.setBullet();
              })
            }
      },
      bullet:function(){
        console.log(this.$bullet)
            for(var i = 0; i < this.imgCount; i ++){
              this.$bullet.append('<li></li>');
            }
            this.$bullet.children().first().addClass('active');
          },

      autoPlay:function(){
          var _this = this;
            clock = setInterval(function(){
              _this.playNext();
            }, 3000);
      },
      setBullet:function(){
            this.$bullet.children().removeClass('active')
                .eq(this.curIdx).addClass('active');
      },
      setBg:function(){
        console.log(this.$itemsReal);
        for(var i = 0; i < this.imgRealCount; i ++){
          this.$itemsReal.eq(i).css({'background': 'url(' + this.$itemsReal.eq(i).attr('data-bg') + ')' + ' no-repeat center', 'background-size': 'cover'});
        }
      }
    };
    return {
      init: function($node){
        $node.each(function(index, node){
          new _Carousel($(node));
        })
      }
    }
  })();
Carousel.init($('.carousel'));
