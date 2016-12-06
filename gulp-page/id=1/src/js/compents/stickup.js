  var Stickup = (function($node){
    var _Stickup = function($node){
      this.$cur = $node,//$('#nav'),
      this.offsetTop = this.$cur.offset().top,
      this.offsetLeft = this.$cur.offset().left,
      this.curH = this.$cur.height(),
      this.scrollTop,
      this.curW = this.$cur.width();//记录并保存初始位置和长宽大小
      this.init();
      this.bind();
    }
    _Stickup.prototype = {
      init:function(){
          this.$curClone = this.$cur.clone().css({opacity: 0})//仍然占据高度，设为none
                        .insertBefore(this.$cur)//在$cur外层添加
                        .hide();//这个克隆元素只在show的时候占据文档流
      },
      bind:function(){
        var _this = this;
        $(window).on('scroll', function(){
          _this.scrollTop = $(this).scrollTop();
          if (_this.scrollTop >= _this.offsetTop) {
            if (!_this.isFixed()) {
              _this.setFixed();
            }
          } else if (_this.scrollTop < _this.offsetTop) {
            if (_this.isFixed()) {
              _this.unsetFixed();
              console.log('执行unsetFixed');
            }
          }
        });
      },
      isFixed:function(){
        return !!this.$cur.data('data-fixed');//强制转化为布尔值
      },
      setFixed: function(){
        this.$cur.data('data-fixed', true).css({
          position: 'fixed',
          top: 0,
          left: 'offsetLeft',
          width: this.curW,
          'z-index': 999
        });
        this.$curClone.show();//显示出来并占据文档流
      },
      unsetFixed: function(){
        this.$cur.data('data-fixed', false).removeAttr('style');
        this.$curClone.hide();
      }
    }
    return {
      init: function($node){
        $node.each(function(index, node){
          new _Stickup($(node));
        })
      }
    }
  })()
  Stickup.init($('.head'));
  var $head = $('.head').eq(1);
  $(window).on('scroll', function(){
    if($(this).scrollTop() > 300){
      $head.css("background-color","#000")
    } else {
      $head.css("background-color", "")
    }
  })

