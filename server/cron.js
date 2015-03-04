SyncedCron.add({
  name: 'Randomize Profile Random Sorter',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('every 2 hours');
  }, 
  job: function() {
    Profiles.find({}).forEach(function(profile){
      Profiles.update({_id:profile._id},{$set:{
            randomSorter:Math.floor(Math.random()*10000)
        }});
    });
  }
});

SyncedCron.options = {
  //Log job run details to console
  log: true,

  //Name of collection to use for synchronisation and logging
  collectionName: 'cronHistory',

  //Default to using localTime
  utc: true, 

  //TTL in seconds for history records in collection to expire
  //NOTE: Unset to remove expiry but ensure you remove the index from 
  //mongo by hand
  collectionTTL: 172800
};

SyncedCron.start();
