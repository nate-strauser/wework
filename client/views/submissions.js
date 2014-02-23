var getAndSetHoursOffset = function(){
  var hoursOffset = parseInt($("#hoursOffset").val(), 10);
  if(isNaN(hoursOffset) || hoursOffset < 0)
    hoursOffset = 0;
  $("#hoursOffset").val(hoursOffset);
  Session.set('hoursOffset', hoursOffset);
  return hoursOffset;
};

var startSimulation = function(){
  Session.set('auto-prog-message', 'Starting simulation...');
  Session.set('auto-prog-running', true);
};

var endSimulation = function(){
  Session.set('auto-prog-message', 'Simulation complete...');
  Meteor.setTimeout(function(){
    Session.set('auto-prog-running', false);
  },1500);
};

Template.submit.events({
    'click #newSubmission' : function () {
      console.log('new submission');
      var hoursOffset = getAndSetHoursOffset();
      Meteor.call('performSubmit', hoursOffset, function(error, result){
        if(error)
                console.error(error);
        //console.log(result);
        Meteor.call('processAchievements', result, hoursOffset, function(error, result){
            if(error)
                console.error(error);
            if(result && result.length > 0)
              console.log('you just earned achievements ' + JSON.stringify(result));
        });
      });
    },
    'click #newSession' : function () {
      console.log('new session');
      var hoursOffset = getAndSetHoursOffset();
      Meteor.call('startNewSession', hoursOffset, function(error, result){
          if(error)
              console.error(error);
      });
    },
    'submit #submitForm' : function(e){
      //console.log('preventing submit');
      e.preventDefault();
      e.stopImmediatePropagation();
      return false;
    },
    'click #auto-3-days-in-row' : function(e){
      e.preventDefault();
      e.stopImmediatePropagation();
      startSimulation();
      var days = 3, currentDay = 0;
      var interval;
      $("#newSession").click();
      $("#newSubmission").click();
      interval = setInterval(function(){
        Session.set('auto-prog-message', 'Simulating day ' + (currentDay+1));
        $("#hoursOffset").val(currentDay * 24);
        $("#newSession").click();
        $("#newSubmission").click();
        currentDay++;
        if(currentDay >= days){
          clearInterval(interval);
          endSimulation();
        }
      }, 50);
    },
    'click #auto-10-days-in-row' : function(e){
      e.preventDefault();
      e.stopImmediatePropagation();
      startSimulation();
      var days = 10, currentDay = 0;
      var interval;
      $("#newSession").click();
      $("#newSubmission").click();
      interval = setInterval(function(){
         Session.set('auto-prog-message', 'Simulating day ' + (currentDay+1));
        $("#hoursOffset").val(currentDay * 24);
        $("#newSession").click();
        $("#newSubmission").click();
        currentDay++;
        if(currentDay >= days){
          clearInterval(interval);
          endSimulation();
        }
      }, 50);
    },
    'click #auto-50-submits-1-session' : function(e){
      e.preventDefault();
      e.stopImmediatePropagation();
      startSimulation();
      var submissions = 50, currentSubmission = 0;
      var interval;
      $("#newSession").click();
      interval = setInterval(function(){
        Session.set('auto-prog-message', 'Simulating submit ' + (currentSubmission+1));
        $("#newSubmission").click();
        currentSubmission++;
        if(currentSubmission >= submissions){
          clearInterval(interval);
          endSimulation();
        }
      }, 50);
    },
    'click #auto-100-submits-1-session' : function(e){
      e.preventDefault();
      e.stopImmediatePropagation();
      startSimulation();
      var submissions = 100, currentSubmission = 0;
      var interval;
      $("#newSession").click();
      interval = setInterval(function(){
        Session.set('auto-prog-message', 'Simulating submit ' + (currentSubmission+1));
        $("#newSubmission").click();
        currentSubmission++;
        if(currentSubmission >= submissions){
          clearInterval(interval);
          endSimulation();
        }
      }, 50);
    },
    'click #auto-200-submits-1-session' : function(e){
      e.preventDefault();
      e.stopImmediatePropagation();
      startSimulation();
      var submissions = 200, currentSubmission = 0;
      var interval;
      $("#newSession").click();
      interval = setInterval(function(){
        Session.set('auto-prog-message', 'Simulating submit ' + (currentSubmission+1));
        $("#newSubmission").click();
        currentSubmission++;
        if(currentSubmission >= submissions){
          clearInterval(interval);
          endSimulation();
        }
      }, 50);
    },
    'click #auto-1000-submits-1-session' : function(e){
      e.preventDefault();
      e.stopImmediatePropagation();
      startSimulation();
      var submissions = 1000, currentSubmission = 0;
      var interval;
      $("#newSession").click();
      interval = setInterval(function(){
        Session.set('auto-prog-message', 'Simulating submit ' + (currentSubmission+1));
        $("#newSubmission").click();
        currentSubmission++;
        if(currentSubmission >= submissions){
          clearInterval(interval);
          endSimulation();
        }
      }, 50);
    },
    'click #auto-1000-submits-random-sessions' : function(e){
      e.preventDefault();
      e.stopImmediatePropagation();
      startSimulation();
      var submissions = 1000, currentSubmission = 0;
      var interval;
      $("#newSession").click();
      interval = setInterval(function(){
        Session.set('auto-prog-message', 'Simulating submit ' + (currentSubmission+1));
        if(Math.random() < 0.2){
          $("#newSession").click();
          Session.set('auto-prog-message', 'Creating new session');
        }
          
        $("#newSubmission").click();
        currentSubmission++;
        if(currentSubmission >= submissions){
          clearInterval(interval);
          endSimulation();
        }
      }, 50);
    }
});