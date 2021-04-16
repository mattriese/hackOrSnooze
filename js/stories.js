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
  let icon = checkForFavorite(story) ? "fa fa-star" : "far fa-star";
  return $(`
      <li id="${story.storyId}">
      <a class="favorite" href="#"><i class="${icon}"></i></a>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}



/* click listener for favorite & unfavorite */
$(".favorite").on("click", function (e) {
  console.log(e.target)
});



// checks to see if a story is in the user's favorites (returns true or false)
// if user is not logged in, return false
function checkForFavorite(story) {
  if (currentUser === undefined) {
    return false;
  }
  else {
    let favoritesIDs = currentUser.favorites.map(story => story.storyId);
    if (favoritesIDs.includes(story.storyId)) {
      console.log('checkForFavorite', true);
      return true;
    }
    console.log('checkForFavorite', false)
    return false;
  }
}
// OLD CODE
// const stories = response.data.stories.map(story => {
//   if(user === null){
//     return new Story(story);
//   }
//   let newStory = new Story(story);
//   if(favoritesIDs.includes(newStory.storyId)){
//       newStory.favorite = true;
//     }
//   return newStory;
// })



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
