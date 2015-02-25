Migrations.add({
  version: 1,
  name: 'Adds emailHash for all existing users',
  up: function(){
  	Users.find({}).forEach(function(user){
  		var email = getUserEmail(user);
		if(email)
		  Users.update({_id:user._id},{$set:{emailHash:CryptoJS.MD5(email.trim().toLowerCase()).toString()}});
  	});
  },
  down: function() {}
});

Migrations.add({
  version: 2,
  name: 'Adds isDeveloper for all existing users',
  up: function(){
  	var expertUserIds = _.pluck(Experts.find().fetch(),'userId');
  	Users.update({_id:{$in:expertUserIds}},{$set:{isDeveloper:true}},{multi:true});
  	Users.update({_id:{$nin:expertUserIds}},{$set:{isDeveloper:false}},{multi:true});
  },
  down: function() {}
});

Migrations.add({
  version: 3,
  name: 'Adds randomSorter for all developers',
  up: function(){
  	Experts.find({}).forEach(function(expert){
      Experts.update({_id:expert._id},{$set:{
            randomSorter:Math.floor(Math.random()*10000)
        }});
    });
  },
  down: function() {}
});

Migrations.migrateTo('latest');
