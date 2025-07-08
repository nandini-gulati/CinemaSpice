// Main application functionality
let currentSection = 'auth';

function initApp() {
    // Set up navigation
    setupNavigation();
    
    // Set up mobile menu
    setupMobileMenu();
    
    // Set up modal close handlers
    setupModalHandlers();
    
    // Load bookings if user is logged in
    if (userData.isLoggedIn) {
        loadBookings();
    }
}

function setupNavigation() {
    // Add smooth scrolling to navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
        });
    });
}

function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

function toggleMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

function setupModalHandlers() {
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal();
            closeBookingModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeBookingModal();
        }
    });
}

function showSection(sectionId) {
    // Check if user is minor and trying to access restricted sections
    if (userData.isLoggedIn && !userData.user.isAdult) {
        if (sectionId === 'movies' || sectionId === 'bookings') {
            showToast('This section is only available for adult users', 'warning');
            return;
        }
    }
    
    // Hide all sections
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
        currentSection = sectionId;
        
        // Update URL hash
        window.history.pushState({}, '', `#${sectionId}`);
        
        // Load section-specific content
        loadSectionContent(sectionId);
    }
}

function loadSectionContent(sectionId) {
    switch (sectionId) {
        case 'movies':
            loadMovies();
            break;
        case 'kids-zone':
            loadKidsMovies();
            break;
        case 'bookings':
            loadBookings();
            break;
        case 'home':
            updateHomeSection();
            break;
    }
}

function updateHomeSection() {
    // Update hero content based on user status
    if (userData.isLoggedIn) {
        if (userData.user.isAdult) {
            updateHeroForAdults();
        } else {
            updateHeroForKids();
        }
    }
}

function loadBookings() {
    const bookingsList = document.getElementById('bookings-list');
    if (!bookingsList) return;
    
    // Check if user is logged in and is an adult
    if (!userData.isLoggedIn || !userData.user.isAdult) {
        bookingsList.innerHTML = `
            <div class="no-bookings">
                <h3>🎫 Bookings Not Available</h3>
                <p>Ticket booking is only available for users 18 and above.</p>
                <button class="btn btn-primary" onclick="showSection('kids-zone')">
                    Go to Kids Zone
                </button>
            </div>
        `;
        return;
    }
    
    // Load bookings from localStorage
    const bookings = JSON.parse(localStorage.getItem('cinemaspice_bookings') || '[]');
    const userBookings = bookings.filter(booking => booking.userId === userData.user.id);
    
    if (userBookings.length === 0) {
        bookingsList.innerHTML = `
            <div class="no-bookings">
                <p>No bookings yet. Start exploring movies!</p>
                <button class="btn btn-primary" onclick="showSection('movies')">
                    Browse Movies
                </button>
            </div>
        `;
        return;
    }
    
    // Display bookings
    bookingsList.innerHTML = userBookings.map(booking => `
        <div class="booking-card">
            <div class="booking-info">
                <h3>${booking.movieTitle}</h3>
                <div class="booking-details">
                    <p><strong>Theater:</strong> ${booking.theater}</p>
                    <p><strong>Date:</strong> ${formatDate(booking.date)}</p>
                    <p><strong>Time:</strong> ${booking.time}</p>
                    <p><strong>Seats:</strong> ${booking.seats.join(', ')}</p>
                    <p><strong>Total:</strong> $${booking.totalPrice.toFixed(2)}</p>
                </div>
            </div>
            <div class="booking-status ${booking.status}">
                <span class="status-${booking.status}">${booking.status.toUpperCase()}</span>
            </div>
        </div>
    `).join('');
}

function searchMovies(query) {
    if (!query) {
        loadMovies();
        return;
    }
    
    let filteredMovies = moviesData.filter(movie => 
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.description.toLowerCase().includes(query.toLowerCase()) ||
        movie.genre.some(g => g.toLowerCase().includes(query.toLowerCase()))
    );
    
    // Apply age restrictions
    if (userData.isLoggedIn && !userData.user.isAdult) {
        filteredMovies = filteredMovies.filter(movie => movie.isKidsMovie);
    }
    
    displayMovies(filteredMovies);
}

function displayMovies(movies) {
    const moviesGrid = document.getElementById('movies-grid');
    if (!moviesGrid) return;
    
    moviesGrid.innerHTML = '';
    
    if (movies.length === 0) {
        moviesGrid.innerHTML = `
            <div class="no-movies">
                <h3>No movies found</h3>
                <p>Try adjusting your search or filters.</p>
            </div>
        `;
        return;
    }
    
    movies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        moviesGrid.appendChild(movieCard);
    });
}

function addToWatchlist(movieId) {
    if (!userData.isLoggedIn) {
        showToast('Please login to add movies to your watchlist', 'warning');
        return;
    }
    
    const movie = getMovieById(movieId);
    if (!movie) return;
    
    // Check if movie is already in watchlist
    if (userData.user.watchlist.includes(movieId)) {
        showToast('Movie already in your watchlist', 'info');
        return;
    }
    
    // Add to watchlist
    userData.user.watchlist.push(movieId);
    
    // Save to localStorage
    localStorage.setItem('cinemaspice_user', JSON.stringify(userData.user));
    localStorage.setItem(`user_${userData.user.email}`, JSON.stringify(userData.user));
    
    showToast(`${movie.title} added to your watchlist!`, 'success');
}

function removeFromWatchlist(movieId) {
    if (!userData.isLoggedIn) return;
    
    const movie = getMovieById(movieId);
    if (!movie) return;
    
    // Remove from watchlist
    userData.user.watchlist = userData.user.watchlist.filter(id => id !== movieId);
    
    // Save to localStorage
    localStorage.setItem('cinemaspice_user', JSON.stringify(userData.user));
    localStorage.setItem(`user_${userData.user.email}`, JSON.stringify(userData.user));
    
    showToast(`${movie.title} removed from your watchlist`, 'info');
}

function handleUrlHash() {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        showSection(hash);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    handleUrlHash();
});

// Handle browser back/forward buttons
window.addEventListener('popstate', handleUrlHash);

// Export functions for global use
window.showSection = showSection;
window.toggleMobileMenu = toggleMobileMenu;
window.searchMovies = searchMovies;
window.addToWatchlist = addToWatchlist;
window.removeFromWatchlist = removeFromWatchlist;