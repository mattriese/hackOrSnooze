"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);


/** Show submit new story form on click of submit nav link */

function showStorySubmitForm(evt) {
  console.debug("showStorySubmitForm", evt);
  $storyForm.show();
}

$body.on("click", "#nav-submit", showStorySubmitForm);

/** Show favorite stories list */
function showFavoriteStories(evt) {
  console.debug("showFavoriteStories", evt);
  hidePageComponents();
  generateFavoriteStoriesList();
}

$body.on("click", "#nav-favorites", showFavoriteStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);



/** When a user first logins in, update the navbar to reflect that. */
//MO --- update this function in nav.js to show
// links to submit favorites my stories
// when username is clicked, page updates to user profile

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");

  //MO -- create main-nav-links for "submit" "favorites" "my stories"
  $(".main-nav-links").show();

  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
