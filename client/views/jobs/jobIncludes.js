Template.jobExpiredAlert.helpers({
  expired: function() {
    if (this.userId === Meteor.userId()) {
      if ((this.createdAt < daysUntilExpiration()) && (this.updatedAt < daysUntilExpiration())) {
        return true;
      } else if ((this.createdAt < daysUntilExpiration()) && (this.updatedAt === undefined)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
});

Template.jobStatusToggle.helpers({
  "statuses": function() {
    return STATUSES;
  }
});

Template.jobLabels.helpers({
  "new": function(){
    if (this.createdAt < daysAsNew()) {
      return true;
    } else {
      return false;
    }
  }
});

Template.jobStatusToggle.events({
  "click .set-status": function() {
    Jobs.update({
      _id: Router.current().params._id
    }, {
      $set: {
        status: String(this)
      }
    });
  }
});
