Template.profiles.onCreated(function() {
  this.query = new ReactiveVar({});
  this.infiniteScroll({
    perPage: 40,
    collection: Profiles,
    publication: 'profiles',
    query: this.query
  });
});

Template.profiles.helpers({
  "profiles": function() {
    var query = Template.instance().query.get();
    var options = {
      sort: {
        randomSorter: 1
      }
    };
    if(query && query.text)
      options.sort = {"score":-1}

    return Profiles.find({}, options);
  },
  "queryActive": function() {
    return !_.isEqual({}, Template.instance().query.get());
  }
})

var updateTextQuery = _.debounce(function(text, reactivevar){
  var query = reactivevar.get();
  if(!_.isEmpty(text))
    query.text = text;
  else
    delete query.text;
  reactivevar.set(query);
},250);

Template.profiles.events({
  "keyup #search": function(event, template) {
    updateTextQuery($(event.currentTarget).val(), template.query);
  },
  "change #type": function(event, template) {
    var query = template.query.get();
    var type = $(event.currentTarget).val();

    if(type !== "All")
        query.type = type;
    else
      delete query.type;

    template.query.set(query);
  },
  "change #availableForHire": function(event, template) {
    var query = template.query.get();
    var availableForHire = $(event.currentTarget).is(':checked');

    if(availableForHire)
        query.availableForHire = true;
    else
      delete query.availableForHire;

    template.query.set(query);
  }
});
