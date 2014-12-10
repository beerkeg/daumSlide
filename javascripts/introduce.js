(function(exports) {
    'use strict';

    var loader = new exports.SearchImageLoader('고흐');
    var numbers = [];
    for(var i=0; i<10; i+=1) {
        numbers.push({
            id: i,
            toHTML: function (panel, slide) {
                return '<div class="number">' + (this.id + 1) + '</div>';
            }
        });
    }

    function launchDefaultCase(elFrame, elPrev, elNext) {
        var ds = new slide.DataSource(numbers);
        var sl = new slide.Slide(elFrame, ds);

        elPrev.addEventListener('click', function() {
            sl.prev();
        });
        elNext.addEventListener('click', function() {
            sl.next();
        });
    }

    function launchDividedCase(elFrame, elPrev, elNext) {
        var ds = new slide.DataSource(numbers);
        var sl = new slide.Slide(elFrame, ds, {
            panelsToShow: 3
        });

        elPrev.addEventListener('click', function() {
            sl.prev();
        });
        elNext.addEventListener('click', function() {
            sl.next();
        });
    }

    function launchFixedCase(elFrame, elPrev, elNext) {
        var ds = new slide.DataSource(numbers);
        var sl = new slide.Slide(elFrame, ds, {
            panelType: slide.FIXED,
            panelWidth: 150
        });

        elPrev.addEventListener('click', function() {
            sl.prev();
        });
        elNext.addEventListener('click', function() {
            sl.next();
        });
    }

    function launchDividedCenterCase(elFrame, elPrev, elNext) {
        var ds = new slide.DataSource(numbers);
        var sl = new slide.Slide(elFrame, ds, {
            panelsToShow: 2,
            isCenterAligned: true
        });

        elPrev.addEventListener('click', function() {
            sl.prev();
        });
        elNext.addEventListener('click', function() {
            sl.next();
        });
    }

    function launchFixedCenterCase(elFrame, elPrev, elNext) {
        var ds = new slide.DataSource(numbers);
        var sl = new slide.Slide(elFrame, ds, {
            panelType: slide.FIXED,
            panelWidth: 150,
            isCenterAligned: true
        });

        elPrev.addEventListener('click', function() {
            sl.prev();
        });
        elNext.addEventListener('click', function() {
            sl.next();
        });
    }

    function launchInfiniteCase(elFrame, elPrev, elNext) {
        var ds = new slide.InfiniteDataSource(numbers);
        var sl = new slide.Slide(elFrame, ds, {
            panelsToShow: 3
        });

        elPrev.addEventListener('click', function() {
            sl.prev();
        });
        elNext.addEventListener('click', function() {
            sl.next();
        });
    }

    function launchAppendCase(elFrame, elPrev, elNext) {
        loader.load(function(builded) {
            var ds = new slide.DataSource(builded, {
                index: 3,
                delegate: {
                    willQueryEndOfDataDelegate: function (callback) {
                        var self = this;
                        loader.load(function (builded) {
                            self.addNextData(builded);
                            callback(true);
                        });
                    }
                }
            });
            var sl = new slide.Slide(elFrame, ds, {
                panelType: slide.FIXED,
                panelWidth: 150
            });
            elPrev.addEventListener('click', function() {
                sl.prev();
            });
            elNext.addEventListener('click', function() {
                sl.next();
            });
        });
    }

    function launchCustomEventCase(elFrame, elPrev, elNext) {
        var ds = new slide.InfiniteDataSource(numbers);
        var sl = new slide.Slide(elFrame, ds, {
            panelsToShow: 3
        });

        var timeId = 0;
        var elText = document.querySelector('.firing_event');
        function setEventText(event) {
            window.clearTimeout(timeId);
            elText.classList.add('fire');
            elText.innerHTML = event;

            timeId = window.setTimeout(function() {
                elText.classList.remove('fire');
                elText.innerHTML = 'idle';
            }, 500);
        }

        sl.on('prev:before', function() {
            setEventText('prev:before');
        });
        sl.on('prev', function() {
            setEventText('prev');
        });
        sl.on('next:before', function() {
            setEventText('next:before');
        });
        sl.on('next', function() {
            setEventText('next');
        });
        sl.on('cancel', function() {
            setEventText('cancel');
        });
        sl.on('click', function() {
            setEventText('click');
        });
        sl.on('resize', function() {
            setEventText('resize');
        });

        elPrev.addEventListener('click', function() {
            sl.prev();
        });
        elNext.addEventListener('click', function() {
            sl.next();
        });
    }

    function launchCustomAnimationCase(elFrame, elPrev, elNext) {
        var ds = new slide.InfiniteDataSource(numbers);
        var sl = new slide.Slide(elFrame, ds, {
            delegate: {
                updateBasePosition: function(movedOffset) {
                    var position = this.getPositionByOffset(movedOffset);
                    this.basePosition.deg -= position.deg;
                },
                getPositionByOffset: function(offset) {
                    return {
                        deg: offset * 90
                    };
                },
                getPositionByGesture: function(deltaX, deltaY) {
                    var panelWidth = this.slide.panelWidth;
                    var gestureRatio = this.slide.gestureRatio;
                    return {
                        deg: (deltaX*gestureRatio/panelWidth)*90
                    };
                },
                movePanelPosition: function (panelIndex, position) {
                    var panel = this.slide.container.getPanel(panelIndex);
                    var _deg = position.deg - this.basePosition.deg;
                    panel.setTransform('rotateY(' + _deg +
                    'deg) translate3d(0px, 0px, ' +
                    this.slide.perspectiveFactor + 'px)');
                },
                moveSlidePosition: function (position) {
                    var _deg = position.deg + this.basePosition.deg;
                    this.slide.container.setTransform('translate3d(0px, 0px, -' +
                    this.slide.perspectiveFactor + 'px) rotateY(' +
                    _deg + 'deg)');
                },
                resizePanels: function() {
                    var _slide = this.slide;
                    var frameEl = this.slide.frameEl;
                    frameEl.style[slide.PERSPECTIVE] = '1000px';
                    frameEl.style[slide.TRANSFORM_STYLE] = 'preserve-3d';

                    _slide.container.setStyle(slide.TRANSFORM_STYLE, 'preserve-3d');
                    _slide.perspectiveFactor = this.slide.frameWidth / 2;
                    _slide.container.setPanelStyle('width', _slide.panelWidth + 'px');
                    this.animator.setDefaultSlidePosition();
                }
            }
        });

        elPrev.addEventListener('click', function() {
            sl.prev();
        });
        elNext.addEventListener('click', function() {
            sl.next();
        });
    }

    exports.onload = function initislize() {
        var elCase = document.querySelectorAll('.wrapper .slide_frame');
        var elPrev = document.querySelectorAll('.wrapper .prev');
        var elNext = document.querySelectorAll('.wrapper .next');


        launchDefaultCase(elCase[0], elPrev[0], elNext[0]);
        launchDividedCase(elCase[1], elPrev[1], elNext[1]);
        launchFixedCase(elCase[2], elPrev[2], elNext[2]);
        launchDividedCenterCase(elCase[3], elPrev[3], elNext[3]);
        launchFixedCenterCase(elCase[4], elPrev[4], elNext[4]);
        launchInfiniteCase(elCase[5], elPrev[5], elNext[5]);
        launchAppendCase(elCase[6], elPrev[6], elNext[6]);
        launchCustomEventCase(elCase[7], elPrev[7], elNext[7]);
        launchCustomAnimationCase(elCase[8], elPrev[8], elNext[8]);
    }
}(window));