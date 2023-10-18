import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import * as notiflix from "notiflix";

const gallery = new SimpleLightbox(".gallery a");

let page = 1;
let currentSearchQuery = "";


const searchForm = document.getElementById("search-form");
const galleryDiv = document.querySelector(".gallery");
const loadMoreButton = document.querySelector(".load-more");

searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const searchQuery = e.target.searchQuery.value;
    if (searchQuery.trim() === "") return;

    currentSearchQuery = searchQuery;
    page = 1;
    galleryDiv.innerHTML = ""; 
    loadMoreButton.style.display = "none"; 

    const images = await fetchImages(searchQuery, page);

    if (images.length === 0) {
        showNoResultsNotification();
    } else {
        displayImages(images);
        showTotalHitsNotification(images.totalHits);
    }
});


loadMoreButton.addEventListener("click", async () => {
    page++;
    const images = await fetchImages(currentSearchQuery, page);

    if (images.length === 0) {
        loadMoreButton.style.display = "none"; 
    } else {
        displayImages(images);
        scrollPageSmoothly();
    }
});

async function fetchImages(searchQuery, page) {
    const apiKey = "40031682-6a854cf7fc8c583574a8ce0da"; 
    const perPage = 40; 
    const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}

function displayImages(images) {
    images.hits.forEach((image) => {
        const photoCard = document.createElement("div");
        photoCard.className = "photo-card";
        photoCard.innerHTML = `
            <a href="${image.largeImageURL}" class="image-link">
                <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
                <div class="info">
                    <p class="info-item"><b>Likes:</b> ${image.likes}</p>
                    <p class="info-item"><b>Views:</b> ${image.views}</p>
                    <p class="info-item"><b>Comments:</b> ${image.comments}</p>
                    <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
                </div>
            </a>
        `;

        galleryDiv.appendChild(photoCard);
    });


    gallery.refresh();
}


function showNoResultsNotification() {
    notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
}


function showTotalHitsNotification(totalHits) {
    notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}


function scrollPageSmoothly() {
    const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });
}
