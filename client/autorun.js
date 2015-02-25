Session.setDefault('isExpert', false);

Meteor.startup(function(){
	Tracker.autorun(function(){
		if(Meteor.user()){
			var expert = Experts.findOne({userId:Meteor.userId()});
			Session.set('isExpert', expert !== undefined);
		}else{
			Session.set('isExpert', false);
		}
	});
});

Tracker.autorun(function () {
  var current = Router.current();

  Tracker.afterFlush(function () {
    $('.content-inner').scrollTop(0);
    $(window).scrollTop(0);
  });
});
