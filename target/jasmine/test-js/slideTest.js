describe("greetings", function() {
	it("say hi", function() {
		expect(greetings.sayHi()).toEqual("hi");
	});

	it("say goodbye", function() {
		expect(greetings.sayGoodBye()).toEqual("goodbye");
	});

});


describe('Test with dom', function() {
	beforeEach(function() {
		$('#fixture').remove();
		$('body').append('<div id="fixture">hi</div>');
	});

	it('should say hi in dom', function() {
		var hi = $('#fixture').text();
		expect(greetings.sayHi()).toEqual(hi);
	});

	it('goodbye say is not hi in dom', function() {
		var hi = $('#fixture').text();
		expect(greetings.sayGoodBye()).toNotEqual(hi);
	});
	
});

