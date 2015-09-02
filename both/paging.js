Pages = new Meteor.Pagination(Profiles,{
	perPage:20,
	sort:{
		randomSorter:1
	},
	templateName: "profiles",
	itemTemplate: "profileSmall",
	infinite:true,
	infiniteTrigger: 0.7
});