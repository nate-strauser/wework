## We Work Meteor
http://www.weworkmeteor.com/

# Meteor Job Board and Expert Directory

We are a new job board and community space for users of the Meteor framework.  The goal of this site is to provide a complete listing of positions requiring the Meteor skill set, as well as to provide contact info for technology subject matter experts for hire. The site is not all the way there yet, but the plan is in motion , so bear with us as new features are added.

If you have a project or problem you need help with, you can post a job or contact an expert.

If you are a developer, you can apply to jobs or offer your services for hire.


## Features / Plans
* upgrade to 0.9.0
* use subsmanager
* Charge for posting
* Pull in postings from other sites (elance, stackoverflow, angellist, twitter 'meteorjs hiring', authentic jobs, etc)
* expire postings after 90? days, only send down non-expired to client
* auto generate for multiple languages/communities
* add logging
* add metrics
* add filtering / sorting
* alerts / subscriptions
* job salary
* job equity
* type of need or offering - one-off help, hourly, term contract, full time employment
* sample data loading for testing (fire on empty collection startup)
* add license - MIT ? CC ?
* split up subscriptions, send down less fields
* https://github.com/XpressiveCode/iron-router-active for nav menu
* item not found page for deleted experts/jobs
* rework away from session vars for view/edit - use iron router context instead (eg Router.current().params._id)
* add remove confirmation via hooks
```
AutoForm.addHooks(['ID'], {
    before:{
    	remove:function(docId){
    		return confirm('Are you sure?');
    	}
    }
  });
```


## Settings
This app does need a settings file to run - see `settings-example.json` for the supoprted values.  The actual settings used for wework.meteor.com are kept private

## Contributing
If anyone wants to improve on this, please submit a pull request w/ your changes.
