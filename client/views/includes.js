Template.header.helpers({
	expert:function(){
		return Experts.findOne({userId:Meteor.userId()});
	}
});

Template.header.events({
    'click .navbar-nav a':function() {
        var targetButton = document.getElementsByClassName('navbar-toggle')[0];
        if (window.innerWidth < 768){
            targetButton.click()
        }
    }
});