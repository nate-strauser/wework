Template.profiles.onCreated(function() {
    this.infiniteScroll({
        perPage: 40,
        subManager: subs,
        collection: Profiles,
        publication: 'profiles'
    });
});

Template.profiles.helpers({
    "profiles": function() {
        return Profiles.find({}, {
            sort: {
                randomSorter: 1
            }
        });
    }
})
