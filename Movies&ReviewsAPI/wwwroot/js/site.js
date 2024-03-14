const API_BASE_URL = "https://localhost:7034/";

const ENDPOINTS = {
    movies: API_BASE_URL + "api/movies",
    updateMovie: API_BASE_URL + "api/movies/id",
    updateReview: API_BASE_URL + "api/reviews/id",
    reviews: API_BASE_URL + "api/reviews",
    login: API_BASE_URL + "login",
    register: API_BASE_URL + "register"
};

const API = {
    async fetchWithAuth(endpoint, options = {}) {
        const token = localStorage.getItem("userToken");
        if (token) {
            options.headers = {
                ...options.headers,
                Authorization: `Bearer ${token}`
            };
        }

        const response = await fetch(endpoint, options);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "An error occurred");
        }
        return response.json();
    },

    async login(email, password) {
        return this.fetchWithAuth(ENDPOINTS.login, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
    },

    async registerUser(email, password) {
        return this.fetchWithAuth(ENDPOINTS.register, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
    }
};

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("login-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        try {
            const email = document.getElementById("login-username").value;
            const password = document.getElementById("login-password").value;
            const data = await API.login(email, password);

            if (data.accessToken) {
                localStorage.setItem("userToken", data.accessToken);
                window.location.href = 'homepage.html';
            }
        } catch (error) {
            console.error(error);
            document.getElementById("output").textContent = error.message;
        }
    });

    document.getElementById("register-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        try {
            const email = document.getElementById("register-email").value;
            const password = document.getElementById("register-password").value;
            const data = await API.registerUser(email, password);

            if (data.accessToken) {
                localStorage.setItem("userToken", data.accessToken);
                console.log("Registration successful, user logged in");
                window.location.href = "index.html";
            }
        } catch (error) {
            console.error(error);
            document.getElementById("output").textContent = error.message;
        }
    });
});

function toggleForms() {
    const loginSection = document.getElementById("login-section");
    const registerSection = document.getElementById("register-section");

    if (loginSection.style.display === "none" || loginSection.style.display === "") {
        loginSection.style.display = "block";
        registerSection.style.display = "none";
    } else {
        loginSection.style.display = "none";
        registerSection.style.display = "block";
    }
}