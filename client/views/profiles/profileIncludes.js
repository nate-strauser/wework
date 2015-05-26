Template.profileLabels.helpers({
  "new": function(){
    if (this.createdAt < daysAsNew()) {
      return true;
    } else {
      return false;
    }
  }
});
