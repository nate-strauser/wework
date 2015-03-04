Profiles.after.insert(function(userId, doc) {
  Users.update({
    _id: doc.userId
  }, {
    $set: {
      isDeveloper: true
    }
  });
});

Profiles.after.remove(function(userId, doc) {
  Users.update({
    _id: doc.userId
  }, {
    $set: {
      isDeveloper: false
    }
  });
});
