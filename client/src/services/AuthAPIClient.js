import User from "./models/user";

export async function loginUser(email, password) {
  const response = await fetch("/survey-manager/apis/sessions/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: email,
      password: password,
    }),
  });

  let responseBody;
  if (response.status === 200 || response.status === 401) {
    responseBody = await response.json();
  }

  switch (response.status) {
    case 422:
      throw new Error("Validation error occurred. Check your submission.");
    case 401:
      throw new Error(responseBody.error);
    case 200:
      return User.fromJSON(responseBody);
    default:
      throw new Error("An error occurred during user login. Please retry.");
  }
}

export async function getCurrentUser() {
  const response = await fetch("/survey-manager/apis/sessions/current", {
    method: "GET",
  });

  let responseBody;
  if (response.status === 200) {
    responseBody = await response.json();
  }

  switch (response.status) {
    case 200:
      return !responseBody.currentUser
        ? null
        : User.fromJSON(responseBody.currentUser);
    default:
      throw new Error(
        "An error occurred retrieving currently logged user. Please refresh."
      );
  }
}

export async function logoutUser() {
  const response = await fetch("/survey-manager/apis/sessions/current", {
    method: "DELETE",
  });

  if (response.status !== 204) {
    throw new Error("An error occurred during user logout. Please retry.");
  }
}
