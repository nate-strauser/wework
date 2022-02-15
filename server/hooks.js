// Profiles.after.insert(function(userId, doc) {
//   Users.update({
//     _id: doc.userId
//   }, {
//     $set: {
//       isDeveloper: true
//     }
//   });
//   var admin = Users.findOne({ roles: "admin" });
//   Email.send({
//     to: getUserEmail(admin),
//     from: FROM_EMAIL,
//     subject: "New Profile Posted - " + doc.title,
//     text: "Profile needs to be approved before it is live:\n\n" + Meteor.absoluteUrl("profiles/" + doc._id) + "\n\n\n\n\n\n"
//   });
// });

// Profiles.after.remove(function(userId, doc) {
//   Users.update({
//     _id: doc.userId
//   }, {
//     $set: {
//       isDeveloper: false
//     }
//   });
// });

Jobs.after.insert(function(userId, doc) {
  var admin = Users.findOne({ roles: "admin" });
  Email.send({
    to: getUserEmail(admin),
    from: FROM_EMAIL,
    subject: "New Job Posted - " + doc.title,
    text: "Job needs to be approved before it is live:\n\n" + Meteor.absoluteUrl("jobs/" + doc._id) + "\n\n\n\n\n\n Posted by user:" + userId
  });
});
