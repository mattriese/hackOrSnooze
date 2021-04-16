"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
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
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
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