const API_URL = "https://api.github.com/users/";
const form = document.getElementById("form");
const searchInput = document.getElementById("search");
const resultDiv = document.getElementById("result");

form.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = searchInput.value.trim();

    if (username !== "") {
        getUser(username);
    } else {
        alert("Please enter a GitHub username");
    }
});

async function getUser(username) {
    try {
        const response = await fetch(API_URL + username);
        if (!response.ok) {
            throw new Error(`User not found. Status: ${response.status}`);
        }
        const userData = await response.json();
        displayUser(userData);
        getRepos(username);
    } catch (error) {
        console.error(error);
        resultDiv.innerHTML = `<p class="error">${error.message}</p>`;
    }
}

async function getRepos(username) {
    try {
        const response = await fetch(API_URL + username + "/repos");
        if (!response.ok) {
            throw new Error(`Failed to fetch repositories. Status: ${response.status}`);
        }
        const reposData = await response.json();
        displayRepos(reposData);
    } catch (error) {
        console.error(error);
        resultDiv.innerHTML = `<p class="error">${error.message}</p>`;
    }
}

function displayUser(user) {
    resultDiv.innerHTML = `
        <div class="card">
            <div>
                <img class="avatar" src="${user.avatar_url}" alt="${user.login} Avatar">
            </div>
            <div class="user-info">
                <h2>${user.name || user.login}</h2>
                <p>${user.bio || ""}</p>

                <ul class="info">
                    <li>${user.followers}<strong>Followers</strong></li>
                    <li>${user.following}<strong>Following</strong></li>
                    <li>${user.public_repos}<strong>Repos</strong></li>
                </ul>

                <div class="repo-list" id="repo-list"></div>
            </div>
        </div>
    `;
}

function displayRepos(repos) {
    const repoListDiv = document.getElementById("repo-list");
    repoListDiv.innerHTML = "<h3>Repositories:</h3>";

    if (repos.length > 0) {
        const repoLinks = repos.map(repo => `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`).join("");
        repoListDiv.innerHTML += repoLinks;
    } else {
        repoListDiv.innerHTML += "<p>No repositories found.</p>";
    }
}
