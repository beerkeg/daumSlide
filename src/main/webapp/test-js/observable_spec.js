/*global describe: false, it: false, xit: false, expect: false,
 beforeEach: false, afterEach: false, jQuery: false, slide: false,
 waitsFor: false, runs: false, spyOn: false, jasmine: false */
describe('slide.js', function () {
    "use strict";

    describe('slide.Observable', function () {
        it('should call registered listener', function () {
            var listener = jasmine.createSpy();
            new slide.Observable()
                .on('event1', listener)
                .emit('event1');
            expect(listener).toHaveBeenCalled();
        });

        it('should call unregistered event. nothing happend', function () {
            new slide.Observable()
                .emit('unregistered event');
        });

        it('should call multiple listeners', function () {
            var listener1 = jasmine.createSpy(),
                listener2 = jasmine.createSpy();
            new slide.Observable()
                .on('event1', listener1)
                .on('event1', listener2)
                .emit('event1');
            expect(listener1).toHaveBeenCalled();
            expect(listener2).toHaveBeenCalled();
        });

        it('should call event with additional parameters. it should be passed to listener', function () {
            var listener = jasmine.createSpy();
            new slide.Observable()
                .on('event1', listener)
                .emit('event1', 'one', 'two');
            expect(listener).toHaveBeenCalledWith('one', 'two');
        });

        it('should not call removed listener', function () {
            var listener = jasmine.createSpy();
            new slide.Observable()
                .on('event1', listener)
                .off('event1', listener)
                .emit('event1');
            expect(listener).not.toHaveBeenCalled();
        });
    });
});