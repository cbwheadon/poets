Answers = new Meteor.Collection("answers");
Games = new Meteor.Collection("games");

function drawChart(ngrams){
    var data = {
	labels : ['1800','1820','1840','1860','1880','1900','1920','1940','1960','1980','2000'],
	datasets : [
	    {
		fillColor : "rgba(151,187,205,0.5)",
		strokeColor : "rgba(151,187,205,1)",
		pointColor : "rgba(151,187,205,1)",
		pointStrokeColor : "#fff",
		scaleShowLabels : false,
		data : ngrams
	    }
	]
    }
    var options = {
	pointDot: false,
	scaleSteps:4,
	animation:false,
    }
    //Get context with jQuery - using jQuery's .get() method.
    var ctx = $("#myChart").get(0).getContext("2d");
    //This will get the first returned node in the jQuery collection.
    var myNewChart = new Chart(ctx);
    new Chart(ctx).Line(data,options);

}

Meteor.startup(function () {
    var game_id = Games.insert({halflife:2.5});
    Session.set('game_id',game_id);
    Deps.autorun(function () {
	  if (Session.get('game_id')) {
	      Meteor.subscribe('games', game_id);
	      Meteor.call("getNextQuestion", Session.get('game_id'));
	  }
    });
});

Template.chart.rendered = function(){
    var game = Games.findOne({_id:Session.get('game_id')});
    if (game && game.hasOwnProperty('ngrams')){
	var ngrams = game['ngrams'];
	drawChart(ngrams);
    }
}

Template.board.game = function () {
    var game = Games.findOne({_id:Session.get('game_id')});
    return game;
};

Template.page.game = function(){
    var game = Games.findOne({_id:Session.get('game_id')});
    return game;
};

Template.scratchpad.events({
    'click .btn, keyup input' : function (evt) {
	var textbox = $('#scratchpad response');
	if (evt.type === "click" || (evt.type === "keyup" && evt.which === 13)) {
	    $('#response').val("");
	    Meteor.call("getNextQuestion",Session.get('game_id'), Session.get('halflife'));
	    textbox.val('');
	    textbox.focus();
	}
    },
    'keyup' : function(){
	wd = $('#response').val();
	Meteor.call('hint',Session.get('game_id'),wd);
    }
});


