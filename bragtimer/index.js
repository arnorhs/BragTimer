
exports.setupEveryAuth = function(everyauth){
    everyauth.password
      .getLoginPath('/login') // Uri path to the login page
      .postLoginPath('/login') // Uri path that your login form POSTs to
      .loginView('login_page')
      .authenticate( function (login, password) {
        // Either, we return a user or an array of errors if doing sync auth.
        // Or, we return a Promise that can fulfill to promise.fulfill(user) or promise.fulfill(errors)
        // `errors` is an array of error message strings
        //
        // e.g., 
        // Example 1 - Sync Example
        // if (usersByLogin[login] && usersByLogin[login].password === password) {
        //   return usersByLogin[login];
        // } else {
        //   return ['Login failed'];
        // }
        //
        // Example 2 - Async Example
        // var promise = this.Promise()
        // YourUserModel.find({ login: login}, function (err, user) {
        //   if (err) return promise.fulfill([err]);
        //   promise.fulfill(user);
        // }
        // return promise;
      })
      .loginSuccessRedirect('/') // Where to redirect to after a login

        // If login fails, we render the errors via the login view template,
        // so just make sure your loginView() template incorporates an `errors` local.
        // See './example/views/login.jade'

      .getRegisterPath('/signup') // Uri path to the registration page
      .postRegisterPath('/signup') // The Uri path that your registration form POSTs to
      .registerView('signup_page')
      .validateRegistration( function (newUserAttributes) {
        // Validate the registration input
        // Return undefined, null, or [] if validation succeeds
        // Return an array of error messages (or Promise promising this array)
        // if validation fails
        //
        // e.g., assuming you define validate with the following signature
        // var errors = validate(login, password, extraParams);
        // return errors;
        //
        // The `errors` you return show up as an `errors` local in your jade template
      })
      .registerUser( function (newUserAttributes) {
        // This step is only executed if we pass the validateRegistration step without
        // any errors.
        //
        // Returns a user (or a Promise that promises a user) after adding it to
        // some user store.
        //
        // As an edge case, sometimes your database may make you aware of violation
        // of the unique login index, so if this error is sent back in an async
        // callback, then you can just return that error as a single element array
        // containing just that error message, and everyauth will automatically handle
        // that as a failed registration. Again, you will have access to this error via
        // the `errors` local in your register view jade template.
        // e.g.,
        // var promise = this.Promise();
        // User.create(newUserAttributes, function (err, user) {
        //   if (err) return promise.fulfill([err]);
        //   promise.fulfill(user);
        // });
        // return promise;
        //
        // Note: Index and db-driven validations are the only validations that occur 
        // here; all other validations occur in the `validateRegistration` step documented above.
      })
      .registerSuccessRedirect('/'); // Where to redirect to after a successful registration
};
