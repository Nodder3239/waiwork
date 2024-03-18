const $tabCtrl = function(tabDiv, tabOption) {
    let self = this;
    //let curTabId = null;
    let tabsElem = null;
    this.tabs = [];
    this.curOnTab = -1;
    this.icons = null;
    this.onAddTab = null;
    this.onChanging = null;
    this.onClosing = null;
    this.onContext = null;
    // this.maxTabCnt = 18;

    function init() {
        //console.log('tabDiv --> ', tabDiv);

        tabDiv.classList.add('main-tab');
        tabDiv.innerHTML = `<div class="nav_container">` +
                           `   <ul class="tabs"></ul>` +
                           `</div>`;

        tabDiv.addEventListener("wheel", e => {
            e.preventDefault();
            let navContainer = $('.nav_container');
            let scrollX = navContainer[0].scrollLeft;
            navContainer[0].scrollTo(scrollX + e.deltaY, 0);
        });

        tabsElem = tabDiv.querySelector('.tabs');

        if (tabOption) {
            self.icons = tabOption.icons ?? null;
            self.onAddTab = tabOption.onAddTab ?? null;
            self.onChanging = tabOption.onChanging ?? null;
            self.onCloseIcon = tabOption.onCloseIcon ?? null;
            self.onContext = tabOption.onContext ?? null;
            self.onClosing = tabOption.onClosing ?? null;
        }
    }

    this.addTab = function(option) {
        // console.log('option --> ', option);
        /*
        if (self.tabs.length >= self.maxTabCnt) {
            let delTab = self.tabs.find(tab => tab.isLocked == false);
            if (delTab) {
                self.unSelectAllTab();
                closeTab(delTab.id, true);
            } else {
                ShowInfoDialog(`You have exceeded the number of tabs that can be opened. (maximum ${self.maxTabCnt})\nPlease close the open tab and then open a new tab.`);
                return;
            }
        }
        */

        if (self.tabs.find(tab => tab.id == option.id)) {
            console.log('A tab with the same id exists.');
            return;
        }

        const newTabElem = document.createElement('li');
        newTabElem.classList.add('tab-link');
        newTabElem.innerHTML = `<span class="lockBtn unlock"></span>` +
                               `<span class="menuName">${option.text}</span>` +
                               `<span class="close"></span>`;
        
        newTabElem.addEventListener('mousedown', function(e) {
            if (e.button == 0) {
                // console.log('event -> ', e)
                let shiftX = e.clientX - newTabElem.getBoundingClientRect().left;
                let shiftY = e.clientY - newTabElem.getBoundingClientRect().top;
                // console.log('mouseDown -> ', e.clientX, e.clientY, shiftX, shiftY);
            
                let orgPos = newTabElem.style.position;
                let orgIdx = newTabElem.style.zIndex;
                let orgBb = newTabElem.style.borderBottom;
    
                let dummyElem = null;
                // let areaElem = null;
    
                let nextL = 0; 
                let prevR = 0;
                if (newTabElem.nextSibling) {
                    nextL = newTabElem.nextSibling.offsetLeft - newTabElem.nextSibling.offsetWidth;
                }
                if (newTabElem.previousSibling) {
                    prevR = newTabElem.previousSibling.offsetLeft + (newTabElem.previousSibling.offsetWidth / 2);
                }
                
                // moveAt(event.pageX, event.pageY);
                
                function moveAt(pageX, pageY) {
                    const moveX = pageX - shiftX;
                    const moveY = pageY - shiftY;
    
                    // console.log('left -> ', tabDiv.getBoundingClientRect().left, '~', tabDiv.getBoundingClientRect().left + tabDiv.offsetWidth);
                    // console.log('top -> ', tabDiv.getBoundingClientRect().top, '~', tabDiv.getBoundingClientRect().top + tabDiv.offsetHeight - 5);
                    if ((pageX < tabDiv.getBoundingClientRect().left || pageX > tabDiv.getBoundingClientRect().left + tabDiv.offsetWidth) ||
                        (pageY < tabDiv.getBoundingClientRect().top || pageY > tabDiv.getBoundingClientRect().top + tabDiv.offsetHeight - 5)) {
                        // console.log('--------- move end!!');
                        moveEnd();
                    } else {
                        newTabElem.style.left = moveX + 'px';
                        // newTabElem.style.top = moveY + 'px';
                        // console.log('moveX -> ', moveX);
                        // console.log('nextL -> ', nextL);
                        // console.log('prevR -> ', prevR);
                        if (dummyElem.nextSibling) {
                            // console.log('nextL -> ', nextL, newTabElem.parentElement.parentElement.scrollLeft, '<', moveX);
                            if (nextL < moveX + newTabElem.parentElement.parentElement.scrollLeft) {
                                // console.log('--------- move R');
                                dummyElem.before(dummyElem.nextSibling);
                                updateDummyInfo();
                            }
                        }
                        if (dummyElem.previousSibling) {
                            if (dummyElem.previousSibling == newTabElem.parentElement.firstElementChild
                                && newTabElem.parentElement.firstElementChild == newTabElem) {
                                return;
                            }
                            // console.log('prevR -> ', moveX, newTabElem.parentElement.parentElement.scrollLeft, '<', prevR);
                            if (moveX + newTabElem.parentElement.parentElement.scrollLeft < prevR) {
                                // console.log('--------- move L');
                                dummyElem.after(dummyElem.previousSibling);
                                updateDummyInfo();
                            }
                        }
                    }
    
                    function updateDummyInfo() {
                        const nextElem = dummyElem.nextSibling == newTabElem ? newTabElem.nextSibling : dummyElem.nextSibling;
                        const prevElem = dummyElem.previousSibling == newTabElem ? newTabElem.previousSibling : dummyElem.previousSibling;
                        if (nextElem) {
                            nextL = nextElem.offsetLeft - nextElem.offsetWidth;
                        } else {
                            nextL = moveX;
                        }
                        if (prevElem) {
                            prevR = prevElem.offsetLeft + (prevElem.offsetWidth / 2);
                        } else {
                            prevR = moveX;
                        }
                    }
                }
                
                function onMouseMove(event) {
                    if (Math.abs(e.pageX - event.pageX) > 3) {
                        if (dummyElem == null) {
                            dummyElem = document.createElement('li');
                            dummyElem.style.width = newTabElem.offsetWidth + 'px';
                            // dummyElem.style.backgroundColor = 'black';
                            dummyElem.style.backgroundColor = 'transparent';
                            newTabElem.after(dummyElem);
                        }
                        // if (areaElem == null) {
                        //     areaElem = document.createElement('div');
                        //     areaElem.style.position = 'absolute';
                        //     areaElem.style.zIndex = 999999;
                        //     areaElem.style.top = (tabDiv.getBoundingClientRect().top + tabDiv.offsetHeight) + 'px';
                        //     areaElem.style.height = tabDiv.offsetHeight + 'px';
                        //     areaElem.style.width = tabDiv.offsetWidth + 'px';
                        //     tabDiv.after(areaElem);
                        // }
    
                        newTabElem.style.position = 'absolute';
                        newTabElem.style.zIndex = 999999;
                        newTabElem.style.height = '33px';
                        newTabElem.style.borderBottom = '0px';
                        if (newTabElem.parentElement?.firstElementChild == newTabElem) {
                            newTabElem.parentElement.style.paddingLeft = '10px';
                        }
                        moveAt(event.pageX, event.pageY);
                    }
                }
                
                document.addEventListener('mousemove', onMouseMove);
                
                newTabElem.onmouseup = function() {
                    moveEnd();
                };
    
                function moveEnd() {
                    document.removeEventListener('mousemove', onMouseMove);
                    if (dummyElem) {
                        dummyElem.after(newTabElem);
                        tabsElem.removeChild(dummyElem);
                        dummyElem = null;
                    }
                    // if (areaElem) {
                    //     tabDiv.parentElement.removeChild(areaElem);
                    //     areaElem = null;
                    // }
                    newTabElem.onmouseup = null;
                    newTabElem.style.position = orgPos;
                    newTabElem.style.zIndex = orgIdx;
                    newTabElem.style.borderBottom = orgBb;
                    newTabElem.style.left = null;
                    newTabElem.style.height = null;
                    newTabElem.parentElement.style.paddingLeft = null;
                }
            } else if (e.button == 1) {
                e.preventDefault();
                const tabElem = self.tabs.find(elem => elem.text == option.text);
                if (tabElem) {
                    self.close(tabElem.id);
                }
            }
        });

        tabsElem.appendChild(newTabElem);
        
        const newTab = {
            id: option.id,
            text: option.text,
            img: option.img,
            data: option.data,
            pageElem: option.pageElem,
            tabElem: newTabElem,
            isLocked: false
        };

        newTab.tabElem.onclick = (e) => {
            /*
            if (curTabId !== newTab.id) {
                self.selectTab(newTab.id);
            }
            */
            if (self.tabs[self.curOnTab].id !== newTab.id) {
                self.selectTab(newTab.id);
            }
        };

        newTab.tabElem.oncontextmenu = (e) => {
            if (self.onContext) {
                self.onContext(e, newTab);
            }
            e.preventDefault();
        };

        newTab.tabElem.querySelector('.lockBtn').onclick = (e) => {
            if (newTab.tabElem.classList.contains('current')) {
                // console.log(newTab.tabElem.classList);
                let lockBtn = $(newTab.tabElem).find(".lock");
                let unlockBtn = $(newTab.tabElem).find(".unlock");
                let closeBtn = $(newTab.tabElem).find(".close");
                if (unlockBtn.length > 0) {
                    newTab.isLocked = true;
                    $(unlockBtn).removeClass('unlock');
                    $(unlockBtn).addClass('lock');
                    $(closeBtn).css('display', 'none');
                }
                if (lockBtn.length > 0) {
                    newTab.isLocked = false;
                    $(lockBtn).removeClass('lock');
                    $(lockBtn).addClass('unlock');
                    $(closeBtn).css('display', '');
                }
                e.stopPropagation();
            }
        };

        newTab.tabElem.querySelector('.close').onclick = (e) => {
            closeTab(newTab.id);
            e.stopPropagation();
        };

        self.tabs.push(newTab);

        if (self.onAddTab) {
            self.onAddTab(newTabElem);
        }

        self.selectTab(newTab.id);
    };

    this.getTab = function(tabId) {
        return self.tabs.find(elem => elem.id == tabId);
    };

    this.getCurrentTab = function(win) {
        let tab = null;
        if (win) {
            tab = self.tabs.find(elem => elem.pageElem?.contentWindow == win);
        } else {
            tab = self.tabs[self.curOnTab];
        }
        return tab;
    };

    this.selectTab = function(tabId) {
        //const oldTab = self.tabs.find(elem => elem.id == curTabId) ?? null;
        //const newTab = self.tabs.find(elem => elem.id == tabId) ?? null;
        const oldTab = self.tabs[self.curOnTab] ?? null;
        const newTabIdx = self.tabs.findIndex(elem => elem.id == tabId);
        const newTab = self.tabs[newTabIdx] ?? null;

        if (oldTab) {
            oldTab.tabElem.classList.remove('current');
            oldTab.pageElem.style.display = 'none';
        }

        if (newTab) {
            newTab.tabElem.classList.add('current');
            newTab.pageElem.style.display = '';
            //curTabId = newTab.id;
            self.curOnTab = newTabIdx;
            if (self.onChanging) {
                self.onChanging(oldTab, newTab);
            }
        }

        // scrollTo
        const navContainer = $('.nav_container');
        const scrollX = navContainer[0].scrollLeft;
        const navRect = navContainer[0].getBoundingClientRect();
        const navW = navRect.width;
        const target = newTab.tabElem;
        const targetRect = target.getBoundingClientRect();
        const targetLeft = targetRect.left;
        const targetW = targetRect.width;
        if (targetLeft + targetW > navW) {
            navContainer[0].scrollTo(targetLeft, 0);
        }
    };

    this.unSelectAllTab = function() {
        let el = self.tabs.find(elem => elem.tabElem.className.indexOf('current') > -1);
        el.tabElem.classList.remove('current');
        el.pageElem.style.display = 'none';
    };

    function closeTab(tabId, bFix = false) {
        //tab.tabElem.remove();
        //tab.pageElem.remove();
        
        const tabIdx = self.tabs.findIndex(elem => elem.id == tabId);
        self.tabs[tabIdx].tabElem.remove();
        self.tabs[tabIdx].pageElem.remove();
        self.tabs.splice(tabIdx, 1);

        if (!bFix) {
            const nextTab = self.tabs[tabIdx];
            if (nextTab) {
                self.selectTab(nextTab.id);
            } else {
                const prevTab = self.tabs[tabIdx - 1];
                if (prevTab) {
                    self.selectTab(prevTab.id);
                } else {
                    self.curOnTab = -1;
                }
            }
        }

        if (self.onClosing) {
            self.onClosing();
        }
    }

    this.close = function(tabId) {
        const tgtTabIdx = self.tabs.findIndex(elem => elem.id == tabId);
        if (tgtTabIdx > -1) {
            const tgtTab = self.tabs[tgtTabIdx];
            if (!tgtTab.isLocked) {
                const curTab = self.tabs[self.curOnTab];
                if (curTab) {
                    if (tgtTab == curTab) {
                        closeTab(tabId, false);
                    } else {
                        closeTab(tabId, true);
                        self.curOnTab = self.tabs.findIndex(elem => elem.id == curTab.id);
                    }
                }
            }
        }
    }

    this.closeCurrent = function() {
        const curTab = self.tabs[self.curOnTab];
        if (curTab.isLocked == false) closeTab(curTab.id);
    };

    this.closeOther = function() {
        const curTab = self.tabs[self.curOnTab];
        // const arrTabId = self.tabs.map(tab => tab.id).filter(tabId => (tabId !== curTab.id);
        const arrTabId = self.tabs.filter(tab => (tab.id !== curTab.id && tab.isLocked == false)).map(tab => tab.id);
        arrTabId.forEach(tabId => {
            closeTab(tabId, true);
        });
        self.curOnTab = self.tabs.findIndex(elem => elem.id == curTab.id);
    };

    this.closeAll = function() {
        // const arrTabId = self.tabs.map(tab => tab.id);
        const arrTabId = self.tabs.filter(tab => (tab.isLocked == false)).map(tab => tab.id);
        arrTabId.forEach(tabId => {
            closeTab(tabId, false);
        });
        // self.curOnTab = -1;
    };

    if (tabDiv) {
        init();
    }
};
