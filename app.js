const BASE_URL =
  "https://strangers-things.herokuapp.com/api/2102-CPU-RM-WEB-PT/";

const fetchPosts = async () => {
  try {
    const response = await fetch(`${BASE_URL}posts`);
    const { data } = await response.json();
    const { posts } = data;
    return renderPosts(posts);
  } catch (error) {
    console.error(error);
  }
};

const renderPosts = (posts) => {
  posts.forEach((post) => {
    const postElement = createPostHTML(post);
    $("#posts").append(postElement);
  });
};

const createPostHTML = (post) => {
  const { title, description, price, author, location } = post;

  return `<div class="card">
  <div class="card-body">
    <h1 class="card-title">${title}</h1>
    <p class="card-text">${description}</p>
    <p>${price}</p>
    <p>${author}</p>
    <p>${location}</p>
  </div>
</div>`;
};

const registerUser = async (usernameValue, passwordValue) => {
  const url = `${BASE_URL}users/register`;

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

const loginUser = async (usernameValue, passwordValue) => {
  const url = `${BASE_URL}users/login`;

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

const hideRegistration = () => {
  const token = localStorage.getItem("token");

  if (token) {
    $(".register").css("display", "none");
  } else {
    console.log("Nothing to hide!");
  }
};

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

(async () => {
  const posts = await fetchPosts();
  fetchPosts(posts);
})();
