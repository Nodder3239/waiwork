var $popupCtrl = null;
(function(){
    var _defPopupOpt = {
        'modal'      : true,
        'title'      : '',
        'url'        : 'about:blink',
        'preLoad'   : true,
        'moveable'  : true,
        'resize'    : false,
        'scroll'    : true, //false,
        'width'     : 600,
        'height'    : 450,
        'center'    : true,
        'left'      : 0,
        'top'       : 0,
        // Events

        'onLoaded' : null,
        'onShow' : null,
        'onHide' : null
    };

    var _innerPopupCtrl = function() {
        var self = this;
        var zIndex = 9000000;
        var mvZIdx = 9999999;
        var Popups = [];
        var Stacks = [];
        var BGElem = document.createElement('div');
        var MVElem = document.createElement('div');
        var showed = false;
        var focusPop = null;

        $(BGElem).addClass('popupCtrlBgDiv');
        $(MVElem).addClass('popupCtrlMvDiv');

        BGElem.style.display = 'none';
        BGElem.style.zIndex = zIndex;
        MVElem.style.display = 'none';
        MVElem.style.zIndex = mvZIdx;

        $(document.body).append(BGElem);
        $(document.body).append(MVElem);

        this.addPopup = function( WIP ) {
            Popups.push( WIP );
            Stacks.push( WIP );
        };
        this.delPopup = function( WIP ) {
            var idx = Popups.indexOf( WIP );
            if (idx >= 0) {
                Popups.splice(idx, 1);
            }
            idx = Stacks.indexOf( WIP );
            if (idx >= 0) {
                Stacks.splice(idx, 1);
            }

            if ( WIP.focused ) {
                if (Stacks.length > 0) {
                    for (var i=Stacks.length-1;i>=0;i--) {
                        if (Stacks[i].showed) {
                            self.popupFocus(Stacks[i]);
                            break;
                        }
                    }
                }
                focusPop = null;
            } else {

            }

            if (Popups.length == 0) {
                showedBG(false);
            }
        };

        this.popupShowed = function(popObj) {
            if (!showed) showedBG(true);
            self.popupFocus(popObj);
        };
        this.popupHided = function(popObj) {
            popObj.focused = false;
            var focus = null;

            for (var i=Stacks.length-1;i>=0;i--) {
                if (Stacks[i].showed) {
                    focus = Stacks[i];
                    break;
                }
            }

            if (focus !== null) {
                self.popupFocus(focus);
            } else {
                showedBG(false);
            }
        };
        this.popupFocus = function(popObj) {
            for (var i=0;i<Popups.length;i++) {
                if (Popups[i] === popObj) {
                    Popups[i].focused = true;
                } else {
                    if ( Popups[i].showed ) Popups[i].focused = false;
                }
            }
            resetZIndex(popObj);
            focusPop = popObj;
        };
        function showedBG(v) {
            if (v) {
                BGElem.style.display = '';
            } else {
                BGElem.style.display = 'none';
            }
            showed = v;
        }
        function resetZIndex( focusPop ) {
            var idx = Stacks.indexOf( focusPop );
            Stacks.splice(idx,1);
            Stacks.push( focusPop );

            for (var i=0;i<Stacks.length;i++) {
                Stacks[i].zIndex = zIndex+(i+1);
            }
        }

        function doMouseMove(evt) {
            if (popupMoving) {
                focusPop.moveTo(evt.clientX,evt.clientY);
            }
        }
        function doMouseUp(evt) {
            if (popupMoving) {
                self.popupMoving = false;
                focusPop.moveEnd();
            }
        }
        $(MVElem).bind('mousemove',doMouseMove);
        $(MVElem).bind('mouseup',doMouseUp);
        $(MVElem).bind('mouseleave',doMouseUp);

        var popupMoving = false;
        Object.defineProperty(this, "showBG", {get: function () { return showed; },set: function (v) { showedBG(v); }});
        Object.defineProperty(this, "popupBgElem", {get: function () { return BGElem; }});
        Object.defineProperty(this, "popupMvElem", {get: function () { return MVElem; }});
        Object.defineProperty(this, "popupMoving", {get: function () { return popupMoving; },set: function (v) {
            popupMoving = v;
            if (popupMoving) {
                MVElem.style.display = '';
            } else {
                MVElem.style.display = 'none';
            }
        }});
    };
    var WIPBack = null;// _innerPopupCtrl();
    // $(document).ready(function(){
    //     WIPBack = new _innerPopupCtrl();
    // });

    function boolYesNo(value) {
        return (value) ? 'auto' : 'no';
    }

    var _innerPopup = function(popupOpt) {
        WIPBack = new _innerPopupCtrl();

        var self = this;

        var Opt = JSON.parse( JSON.stringify( _defPopupOpt ));
        for (var x in popupOpt) { if (Opt[x] !== undefined) Opt[x] = popupOpt[x]; }

        var inBound = true;
        var boundSize = 100;
        var parElem = null;
        var rootModal = null;
        var rootElem = null;
        var closeElem = null;
        var popupTable = null;
        var titleElem = null;
        var iframe = null;
        var titleText = null;
        var moveInfo = { 'x':0,'y':0, 'ox':0,'oy':0 };
        var dialogArg = null;

        this.initPopup = function() {
            parElem = WIPBack.popupBgElem;

            if (Opt.modal) {
                rootModal = document.createElement('div');
            }
            rootElem = document.createElement('div');

            $(rootElem).addClass('popupCtrlRootDiv');

            if (Opt.modal) {
                $(rootModal).addClass('popupCtrlRootModal');
                $(rootModal).append(rootElem);
            } else {
                rootModal = rootElem;
            }
            $(parElem).append(rootModal);

            if (Opt.center) {
                Opt.left = Math.floor( (document.body.offsetWidth - Opt.width)/2 );
                Opt.top = Math.floor( (document.body.offsetHeight - Opt.height)/2 );
            }
            rootElem.style.cssText =
                'position:absolute;'+
                'width:'+Opt.width+'px;'+
                'height:'+Opt.height+'px;'+
                'left:'+Opt.left+'px;'+
                'top:'+Opt.top+'px;';
            rootModal.style.display = 'none';

            var ifStyle = (Opt.scroll == false) ? 'overflow:hidden;' : '';
            var popupHtml =
                '<table cellspacing=0 cellpadding=0 class="popupCtrlTable" style="">'+
                '<tr><td class="popupCtrlTitle">' +
                '<table cellspacing="0" cellpadding="0" class="popupCtrlTitleTable">' +
                '<tr>' +
                '<td class="moveableTD" width="1%" style="padding-left:8px;padding-right:8px;"><img src="/frame/images/hana_logo_white_small.png" style="width: 12px; height: 12px;"></td>'+
                '<td class="moveableTD" width="98%" style="text-align: left"><label class="titleText"></label></td>'+
                '<td width="1%"><div class="popupCtrlCloseBtn">X</div></td>'+
                '</tr>'+
                '</table>'+
                '</td></tr>'+
                /*'<tr><td class="popupCtrlFrame"><iframe src="about:blink" frameborder="0" scrolling="'+boolYesNo(Opt.scroll)+'" class="popupCtrlIframe" style="'+ifStyle+'"></iframe></td></tr>'+*/
                '<tr><td class="popupCtrlFrame"><iframe src="" frameborder="0" scrolling="'+boolYesNo(Opt.scroll)+'" class="popupCtrlIframe" style="'+ifStyle+'"></iframe></td></tr>'+
                '</table>';

            $(rootElem).append(popupHtml);
            titleElem = $(rootElem).find('.popupCtrlTitleTable');
            popupTable = $(rootElem).find('.popupCtrlTable')[0];
            closeElem = $(rootElem).find('.popupCtrlCloseBtn')[0];
            iframe = $(rootElem).find('.popupCtrlIframe')[0];
            titleText = $(rootElem).find('.titleText')[0];
            if (Opt.title !== '') {
                titleText.innerText = Opt.title;
            }

            $(iframe).bind('load',self.iframeLoaded);
            if (Opt.preLoad) {
                iframe.contentWindow.location.replace(Opt.url);
            }

            $(rootElem).bind('mousedown',self.rootMouseDown);
            $(rootElem).bind('mouseup',self.rootMouseUp);
            if (titleElem.length > 0) {
                titleElem = titleElem[0];
            }

            var MVTD = $(titleElem).find('.moveableTD');
            $(MVTD).bind('mousedown',self.titleMouseDown);

            $(closeElem).bind('click',self.clickCloseBtn);
            WIPBack.addPopup(self);

            // console.log('rootElem = ',rootElem);
            // console.log('titleElem',titleElem);
        }

        var iframeWnd = null;
        this.iframeLoaded = function(evt) {
            var Wnd = iframe.contentWindow;
            iframeWnd = Wnd;
            Wnd['popupWindow'] = self;

            if (Opt.title == '') {
                titleText.innerText = Wnd.document.title;
            }

            $(Wnd.document).bind('mousedown',self.rootMouseDown);
            // $(Wnd.document).bind('keydown',function(evt){
            //     switch(evt.keyCode) {
            //         case ( 27) : // ESC
            //             self.hide();
            //             if (window['dialogHideFocus'] !== undefined) {
            //                 window['dialogHideFocus'](evt,self);
            //             }
            //             break;
            //     }
            // });

            if (Opt.onLoaded !== null) {
                Opt.onLoaded(self);
            }

            /*
            if ((!Opt.preLoad)&&(iframe.contentWindow.initDialog !== undefined)) {
                iframe.contentWindow.initDialog( showEvtOpt );
            }
            */

            iframe.focus();
        };
        this.rootMouseDown = function(evt) {
            if (focused) return;
            self.focused = true;
            WIPBack.popupFocus( self );
        };
        this.titleMouseDown = function(evt) {
            $(popupTable).removeClass('popupCtrlTable');
            $(popupTable).addClass('popupCtrlTableChange');

            moveInfo.x = evt.clientX;
            moveInfo.y = evt.clientY;
            moveInfo.ox = rootElem.offsetLeft;
            moveInfo.oy = rootElem.offsetTop;

            WIPBack.popupMoving = true;
        };
        this.moveTo = function( x,y ){
            if (!WIPBack.popupMoving) return;
            var ix = moveInfo.ox + (x - moveInfo.x);
            var iy = moveInfo.oy + (y - moveInfo.y);
            if (inBound) {
                if ((parElem.offsetWidth - (ix + rootElem.offsetWidth)) < 0) {
                    ix = parElem.offsetWidth - rootElem.offsetWidth;
                } else if (ix < 0) {
                    ix = 0;
                }

                if ((parElem.offsetHeight - (iy + rootElem.offsetHeight)) < 0) {
                    iy = parElem.offsetHeight - rootElem.offsetHeight;
                } else if (iy < 0) {
                    iy = 0;
                }
            } else {
                if ((parElem.offsetWidth - ix) < boundSize) {
                    ix = parElem.offsetWidth - boundSize;
                } else if ((rootElem.offsetWidth + ix) < boundSize) {
                    ix = (rootElem.offsetWidth-boundSize) * (-1);
                }

                if ((parElem.offsetHeight - iy) < boundSize) {
                    iy = parElem.offsetHeight - boundSize;
                } else if (iy < 0) {
                    iy = 0;
                }
            }
            rootElem.style.left = ix+'px';
            rootElem.style.top = iy+'px';
        };
        this.moveEnd = function() {
            $(popupTable).addClass('popupCtrlTable');
            $(popupTable).removeClass('popupCtrlTableChange');
        };
        this.clickCloseBtn = function(evt) {
            iframe.contentWindow.close();
        };
        this.clickClose = function() {
            self.hide();
            if (WIPBack.popupBgElem) {
                $(WIPBack.popupBgElem).remove();
            }
            if (WIPBack.popupMvElem) {
                $(WIPBack.popupMvElem).remove();
            }
        };
        this.setDialogArg = function(dArg) {
            dialogArg = dArg;
        };

        var focused = false;
        var showed = false;

        var showEvtOpt = null;
        this.show = function( evtOpt ) {
            if (!Opt.preLoad) {
                showEvtOpt = evtOpt;
                iframe.contentWindow.location.replace(Opt.url);
            } else {
                showEvtOpt = null;
            }

            adjPosize();

            showed = true;
            rootModal.style.display = '';
            WIPBack.popupShowed(self);

            if (Opt.onShow !== null) {
                Opt.onShow(self);
            }
            if ((Opt.preLoad)&&(iframe.contentWindow.initDialog !== undefined)) {
                iframe.contentWindow.initDialog( evtOpt );
            }
            iframe.focus();
        };
        var backupCss = '';
        function adjPosize() {
            var chn = false;
            var vLeft = Math.floor( (document.body.offsetWidth - Opt.width)/2 );
            var vTop  = Math.floor( (document.body.offsetHeight - Opt.height)/2 );
            var vWidth = Opt.width;
            var vHeight = Opt.height;

            if (vLeft < 0) {
                vLeft = 0;
                if (Opt.width > document.body.offsetWidth) {
                    vWidth = document.body.offsetWidth-20;
                    vLeft = 10;
                }
                chn = true;
            }
            if (vTop < 0) {
                vTop = 0;
                if (Opt.height > document.body.offsetHeight) {
                    vHeight = document.body.offsetHeight-20;
                    vTop = 10;
                }
                chn = true;
            }

            if (!Opt.scroll) {
                if (chn) {
                    $(iframe).css('overflow','auto');
                    $(iframe).attr('scrolling',boolYesNo(true));
                } else {
                    $(iframe).css('overflow','hidden');
                    $(iframe).attr('scrolling',boolYesNo(false));
                }
            }

            var curCss = 'position:absolute;'+
                'width:'+vWidth+'px;'+
                'height:'+vHeight+'px;'+
                'left:'+vLeft+'px;'+
                'top:'+vTop+'px;';
            rootElem.style.cssText = curCss;
        }
        this.hide = function() {
            showed = false;
            rootModal.style.display = 'none';
            WIPBack.popupHided(self);
            if (Opt.onHide !== null) {
                Opt.onHide(self);
            }

            if (!Opt.preLoad) {
                showEvtOpt = null;
                iframe.contentWindow.location.replace('about:blink');
            } else {
                showEvtOpt = null;
            }
        };

        Object.defineProperty(this, "focused", {
            get: function () { return focused; },
            set: function (v) {
                if (v) {
                    $(titleElem).removeClass('popupCtrlTitle');
                    $(titleElem).addClass('popupCtrlTitleFocus');
                    $(closeElem).removeClass('popupCtrlCloseBtn');
                    $(closeElem).addClass('popupCtrlCloseBtnFocus');
                } else {
                    $(titleElem).removeClass('popupCtrlTitleFocus');
                    $(titleElem).addClass('popupCtrlTitle');
                    $(closeElem).removeClass('popupCtrlCloseBtnFocus');
                    $(closeElem).addClass('popupCtrlCloseBtn');
                }
                focused = v;
            }
        });
        Object.defineProperty(this, "showed", {get: function () { return showed; }});
        Object.defineProperty(this, "zIndex", {
            get: function () { return rootModal.style.zIndex; },
            set: function (v) {
                rootModal.style.zIndex = v;
            }
        });
        Object.defineProperty(this, "iframe", {get: function () { return iframe; }});
        Object.defineProperty(this, "window", {get: function () { return iframeWnd; }});

        //initPopup();
    };

    $popupCtrl = _innerPopup;
})();