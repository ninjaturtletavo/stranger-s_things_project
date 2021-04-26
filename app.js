// user password ------- username and password to test

const BASE_URL =
  "https://strangers-things.herokuapp.com/api/2102-CPU-RM-WEB-PT";

// Fetches posts from database and displays
const fetchPosts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/posts`);
    const { data } = await response.json();
    const { posts } = data;
    return posts;
  } catch (e) {
    console.error(e);
  }
};

// Fetches logged in users post information
const fetchMe = async () => {
  const token = JSON.parse(localStorage.getItem("token"));

  if (token) {
    try {
      const response = await fetch(`${BASE_URL}/users/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      return result.data; // If I remove .data, my edit and delete buttons disappear!
    } catch (e) {
      console.error(e);
    }
  }
};

// Renders posts and user data
const fetchAndRender = async () => {
  const posts = await fetchPosts();
  const user = await fetchMe();
  renderPosts(posts, user);
};

// createPostHTML appends on #posts on html page
const renderPosts = (posts, me) => {
  $("#posts").empty();
  posts.forEach((post) => {
    const postElement = createPostHTML(post, me);
    $("#posts").append(postElement);
  });
};

//Creates a post
const createPost = async (requestBody) => {
  const token = JSON.parse(localStorage.getItem("token"));

  try {
    const response = await fetch(`${BASE_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });
    const result = await response.json();
    return result;
  } catch (e) {
    console.error(e);
  }
};

// Edit a post belonging to user logged in
const editPost = async (requestBody, postId) => {
  const token = JSON.parse(localStorage.getItem("token"));

  try {
    const response = await fetch(`${BASE_URL}/posts/${postId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });
    const result = await response.json();
    return result;
  } catch (e) {
    console.error(e);
  }
};

// Delete post belonging to user logged in
const deletePost = async (postId) => {
  const token = JSON.parse(localStorage.getItem("token"));
  try {
    const response = await fetch(`${BASE_URL}/posts/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
  } catch (e) {
    console.error(e);
  }
};

//
const createMessage = async (messages, postId) => {
  const {
    post: { _id },
  } = postId;

  const token = JSON.parse(localStorage.getItem("token"));

  try {
    const response = await fetch(`${BASE_URL}/posts/${_id}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(messages),
    });
    const result = await response.json();
    return result;
  } catch (e) {
    console.error(e);
  }
};

// createMessageHTML appends on .message-card on html page
const renderMessages = ({ messages } = post) => {
  $(".message-card").empty();

  if (messages.length === 0)
    return $(".message-card").append("<h5>No messages to Show</h5>");

  messages.forEach((message) => {
    const messageElement = createMessageHTML(message);

    $(".message-card").append(messageElement);
  });
};

// Creates a card with keys from post
const createPostHTML = (post, me) => {
  const { title, description, price, author, location, willDeliver } = post;

  return $(`<div class="card">
  <div class="card-body">
    ${title ? `<h3 class="card-title">${title}</h3>` : ""}
    ${description ? `<p class="card-description">${description}</p>` : ""}
    ${price ? `<p class="card-price">${price}</p>` : ""}
    ${author.username ? `<p class="card-author">${author.username}</p>` : ""}
    ${location ? `<p class="card-location">${location}</p>` : ""}
    ${
      willDeliver === true
        ? `<p class="card-location">YES</p>`
        : `<p class="card-location">NO</p>`
    }
    ${
      me._id === author._id
        ? `
        <button class="edit-container">
        <svg class="edit-icon" viewBox="0 0 20 20">
        <path d="M18.303,4.742l-1.454-1.455c-0.171-0.171-0.475-0.171-0.646,0l-3.061,3.064H2.019c-0.251,0-0.457,0.205-0.457,0.456v9.578c0,0.251,0.206,0.456,0.457,0.456h13.683c0.252,0,0.457-0.205,0.457-0.456V7.533l2.144-2.146C18.481,5.208,18.483,4.917,18.303,4.742 M15.258,15.929H2.476V7.263h9.754L9.695,9.792c-0.057,0.057-0.101,0.13-0.119,0.212L9.18,11.36h-3.98c-0.251,0-0.457,0.205-0.457,0.456c0,0.253,0.205,0.456,0.457,0.456h4.336c0.023,0,0.899,0.02,1.498-0.127c0.312-0.077,0.55-0.137,0.55-0.137c0.08-0.018,0.155-0.059,0.212-0.118l3.463-3.443V15.929z M11.241,11.156l-1.078,0.267l0.267-1.076l6.097-6.091l0.808,0.808L11.241,11.156z"></path>
      </svg>
      </button>
      <button class="delete-container">
      <svg class="delete-icon" viewBox="0 0 20 20">
      <path d="M17.114,3.923h-4.589V2.427c0-0.252-0.207-0.459-0.46-0.459H7.935c-0.252,0-0.459,0.207-0.459,0.459v1.496h-4.59c-0.252,0-0.459,0.205-0.459,0.459c0,0.252,0.207,0.459,0.459,0.459h1.51v12.732c0,0.252,0.207,0.459,0.459,0.459h10.29c0.254,0,0.459-0.207,0.459-0.459V4.841h1.511c0.252,0,0.459-0.207,0.459-0.459C17.573,4.127,17.366,3.923,17.114,3.923M8.394,2.886h3.214v0.918H8.394V2.886z M14.686,17.114H5.314V4.841h9.372V17.114z M12.525,7.306v7.344c0,0.252-0.207,0.459-0.46,0.459s-0.458-0.207-0.458-0.459V7.306c0-0.254,0.205-0.459,0.458-0.459S12.525,7.051,12.525,7.306M8.394,7.306v7.344c0,0.252-0.207,0.459-0.459,0.459s-0.459-0.207-0.459-0.459V7.306c0-0.254,0.207-0.459,0.459-0.459S8.394,7.051,8.394,7.306"></path>
    </svg>
    </button>`
        : ""
    }
  </div>
</div>`).data("post", post);
};

// Creates a card with keys from message
const createMessageHTML = (message) => {
  const {
    content,
    fromUser: { username },
  } = message;

  return $(`<div class="message-card">
  <div class="message-body">
    ${username ? `<h3 class="message-title">${username}</h3>` : ""}
    ${content ? `<p>${content}</p>` : ""}
  </div>
</div>`);
};

// Registers user with username and password
const registerUser = async (usernameValue, passwordValue) => {
  const url = `${BASE_URL}/users/register`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: {
          username: usernameValue,
          password: passwordValue,
        },
      }),
    });
    const {
      data: { token },
    } = await response.json();
    localStorage.setItem("token", JSON.stringify(token));
    hideRegistration();
  } catch (e) {
    console.error(e);
  }
};

// Logs in user with a an account
const loginUser = async (usernameValue, passwordValue) => {
  const url = `${BASE_URL}/users/login`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: {
          username: usernameValue,
          password: passwordValue,
        },
      }),
    });
    const {
      data: { token },
    } = await response.json();
    localStorage.setItem("token", JSON.stringify(token));
    // $('loggedInUser').html(usernameValue) work on it for iusername
    hideLogin();
    hideRegistration();
    showLogout();
  } catch (error) {
    console.error(error);
  }
};

// Hides the registration form when user registers
const hideRegistration = () => {
  const token = localStorage.getItem("token");

  if (token) {
    $(".register").css("display", "none");
    $("#new-post").css("visibility", "visible");
    $("#openMessages").css("visibility", "visible");
    $("#viewMessages").css("visibility", "visible");
    fetchAndRender();
  }
};

// Hides login when user logs in
const hideLogin = () => {
  const token = localStorage.getItem("token");

  if (token) {
    $(".login").css("display", "none");
  } else {
    console.log("Nothing to hide!");
  }
};

// Logs user out
const userLogout = () => {
  localStorage.removeItem("token");

  $("#login").show(); // will show button
  $("#logout").css("display", "none");
  $("#new-post").css("visibility", "hidden");
  $("#openMessages").css("visibility", "hidden");
  $("#viewMessages").css("visibility", "hidden");
};

// If a user is logged in, shows logout button
const showLogout = () => {
  const token = localStorage.getItem("token");

  if (token) {
    $("#logout").show(); // will show button
    $("#login").css("display", "none");
  }
};

$("#home-btn").on("click", () => {
  location.reload();
});

$("#search").on("submit", async (event) => {
  event.preventDefault();

  const searchString = $("#search input").val().toUpperCase();
  console.log(searchString);
  const posts = await fetchPosts();
  const me = await fetchMe();

  const searchPostsArray = posts.filter((post) =>
    post.title.toUpperCase().includes(searchString)
  );
  renderPosts(searchPostsArray, me);
});

$(".register form").on("submit", (event) => {
  event.preventDefault();
  const username = $("#registerUsername").val();
  const password = $("#registerPassword").val();
  registerUser(username, password);
});

$(".login form").on("submit", (event) => {
  event.preventDefault();
  const username = $("#loginUsername").val();
  const password = $("#loginPassword").val();
  loginUser(username, password);
});

$("#logout").on("click", () => {
  userLogout();
});

// submit function on form
$(".form-submit").on("submit", async (e) => {
  e.preventDefault();

  const postTitle = $("#post-title").val();
  const postDescription = $("#post-description").val();
  const postPrice = $("#post-price").val();
  const postAuthor = $("#post-author").val();
  const postLocation = $("#post-location").val();
  const postwillDeliver = $("#post-willDeliver").val();

  const requestBody = {
    post: {
      title: postTitle,
      description: postDescription,
      price: postPrice,
      author: postAuthor,
      location: postLocation,
      willDeliver: postwillDeliver,
    },
  };

  try {
    console.log(requestBody);
    await createPost(requestBody);
    fetchAndRender();

    // clear form after submit
    $("form").trigger("reset");
  } catch (error) {
    console.error(error);
  }
});

$(".edit-form-submit").on("submit", async (event) => {
  event.preventDefault();

  const { card } = $(".edit-form-submit").data();
  console.log(card);
  console.log($(".edit-form-submit").data());

  const postTitle = $("#edit-title").val();
  const postDescription = $("#edit-description").val();
  const postPrice = $("#edit-price").val();
  const postAuthor = $("#edit-author").val();
  const postLocation = $("#edit-location").val();
  const postwillDeliver = $("#edit-willDeliver").val();

  const requestBody = {
    post: {
      title: postTitle,
      description: postDescription,
      price: postPrice,
      // author: postAuthor,
      // location: postLocation,
      // willDeliver: postwillDeliver,
    },
  };

  try {
    console.log(requestBody);
    const result = await editPost(requestBody, card.post._id);
    fetchAndRender();

    // clear form after submit
    $("form").trigger("reset");
  } catch (error) {
    console.error(error);
  }
});

$(".message-form").on("submit", async (event) => {
  event.preventDefault();

  const cardId = $(".message-form").data("card");
  console.log(cardId);

  const messageData = {
    message: {
      content: $(".message-body").val(),
    },
  };

  if ($(".message-body").val() === "") return;

  try {
    const result = await sendMessage(messageData, cardId);
    console.log(result);
    $("#message-body").val(null);
  } catch (e) {
    console.error(e);
    throw e;
  }
});

// Edits post by clicking edit icon
$("#posts").on("click", ".edit-icon", async (event) => {
  event.preventDefault();
  console.log("Let's Edit!!!!!");

  $(".form-submit").css("display", "none");
  $(".edit-form-submit").css("display", "block");

  const listingElement = $(event.target).closest(".card").data("post");
  console.log(listingElement);

  const parentElement = $(event.target).closest("#posts");
  console.log(parentElement);

  $(".edit-form-submit").data({ listingElement });
  $("#edit-title").val(listingElement.title);
  $("#edit-description").val(listingElement.description);
  $("#edit-price").val(listingElement.price);

  const post = $(".edit-form-submit").data();
  console.log(post);
});

// Deletes post if it belongs to user logged in
$("#posts").on("click", ".delete-icon", async (event) => {
  event.preventDefault();
  console.log("I am now deleting the post!");

  const listingElement = $(event.target).closest(".card");
  console.log(listingElement);
  const data = listingElement.data();
  console.log(data);
  const {
    post: { _id },
  } = data;
  console.log(_id);
  console.log("clicked");

  await deletePost(_id);
  fetchAndRender();
});

// MODAL section---------------------------------------------------------------
// Get the modal
const modal = document.getElementById("myModal");

// Get the button that opens the modal
const btn = document.getElementById("login");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = () => {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Get the modal for modalMessages------------------------------------------------------------
const modalMessages = document.getElementById("modalMessages");
// Get the button that opens the modal
const messageBtn = document.getElementById("openMessages");
//Get the span element that closes the modal
const closeMessageBtn = document.getElementsByClassName("close-message")[0];

messageBtn.onclick = () => {
  modalMessages.style.display = "block";
};

closeMessageBtn.onclick = function () {
  modalMessages.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modalMessages) {
    modalMessages.style.display = "none";
  }
};

// Get modal for modalViewMessages
const modalViewMessages = document.getElementById("modalViewMessages");
// Get the button that opens the modal
const messageViewBtn = document.getElementById("viewMessages");
//Get the span element that closes the modal
const closeViewMsgBtn = document.getElementsByClassName(
  "close-view-message"
)[0];

messageViewBtn.onclick = () => {
  modalViewMessages.style.display = "block";
};

closeViewMsgBtn.onclick = function () {
  modalViewMessages.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modalViewMessages) {
    modalViewMessages.style.display = "none";
  }
};
//------------------------------------------------------------------------------------------------

(async () => {
  const posts = await fetchPosts();
  const me = await fetchMe();
  renderPosts(posts, me);
})();
