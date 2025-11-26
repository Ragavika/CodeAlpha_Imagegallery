const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const caption = document.getElementById('lightbox-caption');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const filterButtons = document.querySelectorAll('.filter-btn');

let currentIndex = 0;
let currentGallery = Array.from(galleryItems); // Stores the currently visible images

// --- Lightbox Functions ---

/**
 * Opens the lightbox with the clicked image.
 * @param {Element} imageElement - The image clicked in the gallery.
 * @param {number} index - The index of the image in the currentGallery array.
 */
function openLightbox(imageElement, index) {
    currentIndex = index;
    updateLightboxContent(imageElement);
    lightbox.classList.add('visible');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
}

/**
 * Closes the lightbox.
 * @param {Event} event - The click event (used to close only when clicking outside content or on 'X').
 */
function closeLightbox(event) {
    // Close only if clicking the background or the close button
    if (event.target === lightbox || event.target.classList.contains('close-btn')) {
        lightbox.classList.remove('visible');
        document.body.style.overflow = '';
    }
}

/**
 * Updates the image and caption in the lightbox.
 * @param {Element} imageElement - The image element to display.
 */
function updateLightboxContent(imageElement) {
    lightboxImg.src = imageElement.src;
    caption.textContent = imageElement.alt;
}

// --- Navigation Functions ---

function navigate(direction) {
    let newIndex = currentIndex + direction;

    if (newIndex >= currentGallery.length) {
        newIndex = 0; // Loop to the first image
    } else if (newIndex < 0) {
        newIndex = currentGallery.length - 1; // Loop to the last image
    }

    currentIndex = newIndex;
    const nextImage = currentGallery[currentIndex];
    updateLightboxContent(nextImage);
}

// --- Event Listeners ---

// 1. Gallery Items (Open Lightbox)
galleryItems.forEach((item, originalIndex) => {
    item.addEventListener('click', () => {
        // Find the index of the clicked item within the currently filtered/visible set
        const visibleIndex = currentGallery.findIndex(img => img === item);
        if (visibleIndex !== -1) {
            openLightbox(item, visibleIndex);
        }
    });
});

// 2. Navigation Buttons (Next/Prev)
prevBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent the lightbox background click listener from firing
    navigate(-1);
});

nextBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent the lightbox background click listener from firing
    navigate(1);
});

// 3. Keyboard Navigation (Escape to close, Arrows for navigation)
document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('visible')) {
        if (e.key === 'Escape') {
            lightbox.classList.remove('visible');
            document.body.style.overflow = '';
        } else if (e.key === 'ArrowLeft') {
            navigate(-1);
        } else if (e.key === 'ArrowRight') {
            navigate(1);
        }
    }
});

// --- Image Filtering (Bonus) ---

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        
        // Update active class for buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Apply filter to images
        currentGallery = []; // Reset the visible gallery array

        galleryItems.forEach(item => {
            if (filter === 'all' || item.classList.contains(filter)) {
                item.classList.remove('hidden');
                currentGallery.push(item); // Add to visible array
            } else {
                item.classList.add('hidden');
            }
        });
    });
});