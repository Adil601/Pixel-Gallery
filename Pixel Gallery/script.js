const accessKey = 'EPaacMtQG6dZ1ONOoHHUIDk2i_XCRVFM2BUD_9jEHwU'; 

document.getElementById("fetchBtn").addEventListener("click", fetchImages);
document.getElementById("themeToggle").addEventListener("click", toggleTheme);

let query = '';
let page = 1;
const imageContainer = document.getElementById("imageContainer");
const loading = document.getElementById("loading");
const favoritesContainer = document.getElementById("favoritesContainer");
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function fetchImages() {
    query = document.getElementById("searchQuery").value.trim();
    if (!query) return alert("Enter a keyword!");

    loading.style.display = "block";
    imageContainer.innerHTML = "";
    page = 1;

    loadMoreImages();
}


window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        loadMoreImages();
    }
});

function loadMoreImages() {
    fetch(`https://api.unsplash.com/search/photos?query=${query}&client_id=${accessKey}&page=${page}&per_page=9`)
        .then(res => res.json())
        .then(data => {
            loading.style.display = "none";
            data.results.forEach(photo => createImageElement(photo));
            page++;
        })
        .catch(() => loading.innerHTML = "Error fetching images");
}

function createImageElement(photo) {
    const img = document.createElement("img");
    img.src = photo.urls.small;
    img.alt = photo.alt_description;

    
    const downloadBtn = document.createElement("button");
    downloadBtn.classList.add("download-btn");
    downloadBtn.innerHTML = "<i class='fas fa-download'></i>";
    downloadBtn.onclick = () => downloadImage(photo.urls.full);

    const imageWrapper = document.createElement("div");
    imageWrapper.classList.add("image-wrapper");
    imageWrapper.appendChild(img);
    imageWrapper.appendChild(downloadBtn);

    img.onclick = () => addToFavorites(photo.urls.small);
    imageContainer.appendChild(imageWrapper);
}


function addToFavorites(url) {
    if (!favorites.includes(url)) {
        favorites.push(url);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        updateFavorites();
    }
}


function updateFavorites() {
    favoritesContainer.innerHTML = "";
    favorites.forEach(url => {
        const img = document.createElement("img");
        img.src = url;
        img.onclick = () => removeFromFavorites(url);
        favoritesContainer.appendChild(img);
    });
}

function removeFromFavorites(url) {
    favorites = favorites.filter(fav => fav !== url);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    updateFavorites();
}


function toggleTheme() {
    document.body.classList.toggle("light-mode");
}


function downloadImage(url) {
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", "image.jpg");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}


updateFavorites();
