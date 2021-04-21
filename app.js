// user password ------- username and password to test

const BASE_URL =
  "https://strangers-things.herokuapp.com/api/2102-CPU-RM-WEB-PT";

// fetches posts from database and returns renderPosts
const fetchPosts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/posts`);
    const { data } = await response.json();
    const { posts } = data;
    console.log(posts);
    return posts;
  } catch (error) {
    console.error(error);
  }
};

const fetchMe = async () => {
  const token = JSON.parse(localStorage.getItem("token"));

  try {
    const response = await fetch(`${BASE_URL}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    console.log(data);
    return data.data;
  } catch (error) {
    console.error(error);
  }
};

const fetchAndRender = async () => {
  const posts = await fetchPosts();
  renderPosts(posts.data.posts);
};

// createPostHTML appends on #posts on html page
const renderPosts = (posts, me) => {
  console.log(me);
  posts.forEach((post) => {
    const postElement = createPostHTML(post, me);
    $("#posts").append(postElement);
  });
};

const postBlogEntry = async (requestBody) => {
  console.log(requestBody);
  const token = JSON.parse(localStorage.getItem("token"));
  try {
    const request = await fetch(`${BASE_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });
    const result = await request.json();
    console.log(result);
    return result;
  } catch (e) {
    console.error(e);
  }
};

// creates a card with keys from post
const createPostHTML = (post, me) => {
  const { title, description, price, author, location } = post;
  const author_id = author._id;

  console.log(me._id, author_id);

  return $(`<div class="card">
  <div class="card-body">
    ${title ? `<h3 class="card-title">${title}</h3>` : ""}
    ${description ? `<p class="card-text1">${description}</p>` : ""}
    ${price ? `<p>${price}</p>` : ""}
    ${author ? `<p class="card-text1"/>${author}</p>` : ""}
    ${location ? `<p>${location}</p>` : ""}
    ${
      me._id === author_id
        ? `<svg class="svg-icon" viewBox="0 0 20 20">
        <path d="M18.303,4.742l-1.454-1.455c-0.171-0.171-0.475-0.171-0.646,0l-3.061,3.064H2.019c-0.251,0-0.457,0.205-0.457,0.456v9.578c0,0.251,0.206,0.456,0.457,0.456h13.683c0.252,0,0.457-0.205,0.457-0.456V7.533l2.144-2.146C18.481,5.208,18.483,4.917,18.303,4.742 M15.258,15.929H2.476V7.263h9.754L9.695,9.792c-0.057,0.057-0.101,0.13-0.119,0.212L9.18,11.36h-3.98c-0.251,0-0.457,0.205-0.457,0.456c0,0.253,0.205,0.456,0.457,0.456h4.336c0.023,0,0.899,0.02,1.498-0.127c0.312-0.077,0.55-0.137,0.55-0.137c0.08-0.018,0.155-0.059,0.212-0.118l3.463-3.443V15.929z M11.241,11.156l-1.078,0.267l0.267-1.076l6.097-6.091l0.808,0.808L11.241,11.156z"></path>
    </svg>`
        : ""
    }
  </div>
</div>`).data("post", post);
};

// registers user with username and password
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
    console.log(response);
    const {
      data: { token },
    } = await response.json();
    console.log(token);
    localStorage.setItem("token", JSON.stringify(token));
    hideRegistration();
  } catch (error) {
    console.error(error);
  }
};

// logs in users that have accounts with username and password
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
    console.log(response);
    const {
      data: { token },
    } = await response.json();
    console.log(token);
    localStorage.setItem("token", JSON.stringify(token));
    hideLogin();
  } catch (error) {
    console.error(error);
  }
};

// hides the registration form when user registers
const hideRegistration = () => {
  const token = localStorage.getItem("token");

  if (token) {
    $(".register").css("display", "none");
  } else {
    console.log("Nothing to hide!");
  }
};

// hides login when user logs in
const hideLogin = () => {
  const token = localStorage.getItem("token");

  if (token) {
    $(".login").css("display", "none");
  } else {
    console.log("Nothing to hide!");
  }
};

$(".register form").on("submit", (event) => {
  event.preventDefault();
  const username = $("#registerUsername").val();
  const password = $("#registerPassword").val();
  console.log(username, password);
  registerUser(username, password);
});

$(".login form").on("submit", (event) => {
  event.preventDefault();
  const username = $("#loginUsername").val();
  const password = $("#loginPassword").val();
  console.log(username, password);
  loginUser(username, password);
});

// submit function on form
$(".form-submit").on("submit", async (e) => {
  e.preventDefault();

  const blogTitle = $("#blog-title").val();
  const blogDescription = $("#blog-description").val();
  const blogPrice = $("#blog-price").val();
  const blogAuthor = $("#blog-author").val();
  const blogLocation = $("#blog-location").val();

  const requestBody = {
    post: {
      title: blogTitle,
      description: blogDescription,
      price: blogPrice,
      author: blogAuthor,
      location: blogLocation,
    },
  };

  try {
    console.log(requestBody);
    await postBlogEntry(requestBody);
    ///// fetchandrender goies here
    fetchAndRender();

    // clear form after submit
    $("form").trigger("reset");
  } catch (error) {
    console.error(error);
  }
});

// MODAL section---------------------------------------------------------------
// Get the modal
const modal = document.getElementById("myModal");

// Get the button that opens the modal
const btn = document.getElementById("myBtn");

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

(async () => {
  const posts = await fetchPosts();
  const me = await fetchMe();
  renderPosts(posts, me);
})();
