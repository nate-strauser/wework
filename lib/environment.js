Meteor.startup(function(){
    // AccountsTemplates.addField({
    //     _id: 'name',
    //     type: 'text',
    //     placeholder: "Full Name",
    //     displayName: "Full Name",
    //     required: true,
    //     minLength: 4
    // });

    AccountsTemplates.removeField('email');
    AccountsTemplates.addFields([
      {
          _id: "username",
          type: "text",
          displayName: "username",
          required: true,
          minLength: 5,
      },
      {
          _id: 'email',
          type: 'email',
          required: true,
          displayName: "email",
          re: /.+@(.+){2,}\.(.+){2,}/,
          errStr: 'Invalid email',
      },
      {
          _id: 'username_and_email',
          type: 'text',
          required: true,
          displayName: "Login",
          placeholder: "Username or email"
      }
    ]);


    AccountsTemplates.configureRoute("forgotPwd");
    AccountsTemplates.configureRoute("resetPwd");
    AccountsTemplates.configureRoute("signIn", {
        name: 'signIn',
        path: '/sign-in',
        redirect: '/',
    });
    AccountsTemplates.configureRoute("signUp", {
        name: 'signUp',
        path: '/sign-up',
        redirect: '/',
    });
    AccountsTemplates.configureRoute("verifyEmail");



    AccountsTemplates.configure({
        // Behaviour
        confirmPassword: true,
        enablePasswordChange: true,
        forbidClientAccountCreation: false,
        overrideLoginErrors: true,
        sendVerificationEmail: false,

        // Appearance
        //showAddRemoveServices: false,
        showForgotPasswordLink: true,
        showLabels: false,
        showPlaceholders: true,

        // Client-side Validation
        continuousValidation: true,
        negativeFeedback: false,
        negativeValidation: true,
        positiveValidation: false,
        positiveFeedback: false,

        // Privacy Policy and Terms of Use
        // privacyUrl: 'privacy',
        // termsUrl: 'terms',

        // Redirects
        homeRoutePath: '/',
        redirectTimeout: 4000,

        // Texts
        // buttonText: {
        //     signUp: "Create Account"
        // },
        // title: {
        //     forgotPwd: "Recover Your Password"
        // },
    });


    AccountsTemplates.init();
});
