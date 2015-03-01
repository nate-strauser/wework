Jobs = new Mongo.Collection("jobs");

Jobs.attachSchema(
	new SimpleSchema({
        title: {
            type: String,
            label: "Job Title",
            max: 128
        },
        company: {
            type: String,
            label: "Company",
            max: 128,
			optional: true
        },
        location: {
            type: String,
            label: "Location",
            max: 128,
			optional: true
        },
        url: {
            type: String,
            label: "URL",
            max: 256,
			optional: true,
            regEx:SimpleSchema.RegEx.Url
        },
        contact: {
            type: String,
            label: "Contact Info",
            max: 128
        },
        jobtype: {
            type: String,
            label: "Job Type",
            allowedValues: ["Full Time", "Hourly Contract", "Term Contract", "Mentoring", "Bounty", "Open Source", "Volunteer", "Other"]
        },
        remote: {
            type: Boolean,
            label: "This is a remote position."
        },
        userId: {
            type: String,
            label: "User Id",
            autoValue: function() {
				if (this.isInsert) {
					return Meteor.userId();
				} else if (this.isUpsert) {
					return {$setOnInsert: Meteor.userId()};
				} else {
					this.unset();
				}
			},
			denyUpdate: true
        },
        userName: {
            type: String,
            label: "User Name",
            autoValue: function() {
				if (this.isUpsert) {
					return {$setOnInsert: getUserName(Meteor.user())};
				} else {
					return getUserName(Meteor.user());
				}
			}
        },
        description: {
            type: String,
            label: "Job Description",
            max: 4096
        },
        // Force value to be current date (on server) upon insert
		// and prevent updates thereafter.
		createdAt: {
			type: Date,
			autoValue: function() {
				if (this.isInsert) {
					return new Date();
				} else if (this.isUpsert) {
					return {$setOnInsert: new Date()};
				} else {
					this.unset();
				}
			},
			denyUpdate: true
		},
		// Force value to be current date (on server) upon update
		// and don't allow it to be set upon insert.
		updatedAt: {
			type: Date,
			autoValue: function() {
				if (this.isUpdate) {
					return new Date();
				}
			},
			denyInsert: true,
			optional: true
		},
		// Automatically set HTML content based on markdown content
		// whenever the markdown content is set.
		htmlDescription: {
			type: String,
			optional: true,
			autoValue: function(doc) {
				var markdownContent = this.field("description");
				if (Meteor.isServer && markdownContent.isSet) {
					return marked(markdownContent.value);
				}
			}
		}
    })
);

Jobs.allow({
  insert: function(userId, doc) {
    return userId && doc && userId === doc.userId;
  },
  update: function(userId, doc, fieldNames, modifier) {
    return userId && doc && userId === doc.userId;
  },
  remove: function(userId, doc) {
    return userId && doc && userId === doc.userId;
  },
  fetch: ['userId']
});
