"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories(currentUser);//
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */


function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  //hides button if no user is logged in
  let anchorTagClass = "favorite";
  if (currentUser === undefined) {
    anchorTagClass = "hidden";
  }

  let favoriteCSSClass = checkForFavorite(story) ? "fas" : "far";


  return $(`
      <li id="${story.storyId}">
        <a class="${anchorTagClass}" href="#"><i class="${favoriteCSSClass} fa-star"></i></a>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

//TODO
//remove duplication here
// let favoritedStoryId = $(e.target).closest("li").attr("id");
//   let story = storyList.stories.find((story) => story.storyId === favoritedStoryId);

// callback function to add to click listener to change icon from favorite to not favorite
async function unfavoriteStory(e) {
  console.log("unfavoriteStory");
  let unfavoritedStoryId = $(e.target).closest("li").attr("id");
  let story = storyList.stories.find((story) => story.storyId === unfavoritedStoryId);
  await currentUser.unfavoriteStory(story);
  $(e.target).removeClass("fas");
  $(e.target).addClass("far");
}

// callback function to add to click listener to change icon from not favorite to favorite
async function favoriteStory(e) {
  console.log("favoriteStory");
  let favoritedStoryId = $(e.target).closest("li").attr("id");
  let story = storyList.stories.find((story) => story.storyId === favoritedStoryId);
  await currentUser.favoriteStory(story);
  $(e.target).removeClass("far");
  $(e.target).addClass("fas");
}
//

// checks to see if a story is in the user's favorites (returns true or false)
function checkForFavorite(story) {
  let favoritesIDs = currentUser.favorites.map(story => story.storyId);
  if (favoritesIDs.includes(story.storyId)) {
    console.log('checkForFavorite', true);
    return true;
  }
  console.log('checkForFavorite', false)
  return false;
}



/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}


/** submitStoryAndAddToPage will put an event listener on the story
 * form and call .addStory with the values from the form
 * hide the page components
 * then call putStoriesOnPage
*/
async function submitStoryAndAddToPage(e) {
  e.preventDefault();
  console.debug("submitStoryAndAddToPage-->", "submit clicked")

  //get form values and create a newStory obj
  let title = $('#title').val();
  let author = $('#author').val();
  let url = $('#url').val();
  let newStory = { title, author, url }

  //call addStory to POST request the form values
  let submittedStory = await storyList.addStory(currentUser, newStory);

  console.log("after submit --->", submittedStory)

  let addedStory = generateStoryMarkup(submittedStory);
  $allStoriesList.prepend(addedStory);


  // storyList = await StoryList.getStories();
  // dont reassign story list, add 1 story.
  //use generateStoryMarkup

  //clear form values
  $('#title').val("");
  $('#author').val("");
  $('#url').val("");
}

$storyForm.on("submit", submitStoryAndAddToPage)

//click listener for favorites icons to favorite and unfavorite story
$body.on("click", ".fas.fa-star", unfavoriteStory);
$body.on("click", ".far.fa-star", favoriteStory);


/*called on click to generate a list of faves from user's favorites*/
function generateFavoriteStoriesList() {
  $favoriteStoriesList.show();
  for (let story of currentUser.favorites) {
    let addedStory = generateStoryMarkup(story);
    $favoriteStoriesList.append(addedStory);
  }
}