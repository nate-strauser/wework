Users = Meteor.users;

Users.allow({
  insert: function(userId, doc) {
    return false;
  },
  update: function(userId, doc, fieldNames, modifier) {
    return !_.contains(fieldNames, 'roles') && userId && doc && userId === doc.userId;
  },
  remove: function(userId, doc) {
    return Roles.userIsInRole(userId, ['admin']);
  },
  fetch: ['userId']
});
