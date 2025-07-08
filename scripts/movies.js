// Movie display and interaction functionality
let currentFilter = 'all';
let currentMovies = [];

function initMovies() {
    // Load initial movies
    loadMovies();
    
    // Load kids movies
    loadKidsMovies();
}

function loadMovies() {
    const moviesGrid = document.getElementById('movies-grid');
    if (!moviesGrid) return;
    
    // Get movies based on current filter
    currentMovies = getMoviesByGenre(currentFilter);
    
    // Filter based on user age if logged in
    if (userData.isLoggedIn && !userData.user.isAdult) {
        currentMovies = currentMovies.filter(movie => movie.isKidsMovie);
    }
    
    // Clear existing content
    moviesGrid.innerHTML = '';
    
    // Create movie cards
    currentMovies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        moviesGrid.appendChild(movieCard);
    });
    
    // Add fade-in animation
    setTimeout(() => {
        moviesGrid.classList.add('fade-in');
    }, 100);
}

function loadKidsMovies() {
    const kidsMoviesGrid = document.getElementById('kids-movies-grid');
    if (!kidsMoviesGrid) return;
    
    const kidsMovies = getKidsMovies();
    
    // Clear existing content
    kidsMoviesGrid.innerHTML = '';
    
    // Create movie cards
    kidsMovies.forEach(movie => {
        const movieCard = createMovieCard(movie, true);
        kidsMoviesGrid.appendChild(movieCard);
    });
    
    // Add fade-in animation
    setTimeout(() => {
        kidsMoviesGrid.classList.add('fade-in');
    }, 100);
}

function createMovieCard(movie, isKidsZone = false) {
    const movieCard = document.createElement('div');
    movieCard.className = `movie-card ${isKidsZone ? 'movie-card-kids' : ''}`;
    movieCard.setAttribute('data-movie-id', movie.id);
    
    // Check if user can access this movie
    const canAccess = !userData.isLoggedIn || userData.user.isAdult || movie.isKidsMovie;
    
    movieCard.innerHTML = `
        <div class="movie-poster-container">
            <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
            <div class="age-rating">${movie.ageRating}</div>
            ${!canAccess ? '<div class="adult-content-overlay"><div class="adult-content-message"><h3>18+ Content</h3><p>This content is restricted to viewers 18 and above.</p></div></div>' : ''}
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${movie.title}</h3>
            <div class="movie-genre">${movie.genre.join(', ')}</div>
            <div class="movie-rating">
                <span class="stars">${generateStars(movie.rating)}</span>
                <span>${movie.rating}/10</span>
            </div>
            <p class="movie-description">${movie.description}</p>
            <div class="movie-actions">
                <button class="btn-watch" onclick="watchMovie(${movie.id})" ${!canAccess ? 'disabled' : ''}>
                    ${canAccess ? 'Watch' : 'Restricted'}
                </button>
                <button class="btn-book ${!canAccess || (!userData.isLoggedIn || !userData.user.isAdult) ? 'btn-disabled' : ''}" 
                        onclick="bookMovie(${movie.id})"
                        ${!canAccess || (!userData.isLoggedIn || !userData.user.isAdult) ? 'disabled' : ''}>
                    ${(!userData.isLoggedIn || !userData.user.isAdult) ? 'Book (18+)' : 'Book Tickets'}
                </button>
            </div>
        </div>
    `;
    
    // Add click event to show movie details
    movieCard.addEventListener('click', (e) => {
        // Don't trigger if clicking on buttons
        if (e.target.tagName === 'BUTTON') return;
        
        if (canAccess) {
            showMovieModal(movie);
        } else {
            showAgeRestrictionModal();
        }
    });
    
    return movieCard;
}

function filterMovies(genre) {
    currentFilter = genre;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    event.target.classList.add('active');
    
    // Reload movies with new filter
    loadMovies();
}

function watchMovie(movieId) {
    const movie = getMovieById(movieId);
    if (!movie) return;
    
    // Check if user can access this movie
    if (userData.isLoggedIn && !userData.user.isAdult && !movie.isKidsMovie) {
        showAgeRestrictionModal();
        return;
    }
    
    // Show movie modal
    showMovieModal(movie);
}

function bookMovie(movieId) {
    // Check if user is logged in
    if (!userData.isLoggedIn) {
        showToast('Please login to book tickets', 'warning');
        showSection('auth');
        return;
    }
    
    // Check if user is adult
    if (!userData.user.isAdult) {
        showBookingRestrictionModal();
        return;
    }
    
    const movie = getMovieById(movieId);
    if (!movie) return;
    
    // Check if this is an adult movie
    if (!movie.isKidsMovie || movie.ageRating === 'R' || movie.ageRating === 'PG-13') {
        if (!userData.user.isAdult) {
            showBookingRestrictionModal();
            return;
        }
    }
    
    // Show booking modal
    showBookingModal(movie);
}

function showMovieModal(movie) {
    const modal = document.getElementById('movie-modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <div class="movie-modal-content">
            <div class="movie-modal-poster-container">
                <img src="${movie.backdrop}" alt="${movie.title}" class="movie-modal-poster">
            </div>
            <div class="movie-modal-info">
                <h2>${movie.title}</h2>
                <div class="movie-modal-details">
                    <div class="detail-item">
                        <span class="detail-label">Genre</span>
                        <span class="detail-value">${movie.genre.join(', ')}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Duration</span>
                        <span class="detail-value">${movie.duration}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Rating</span>
                        <span class="detail-value">${movie.rating}/10</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Age Rating</span>
                        <span class="detail-value">${movie.ageRating}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Release Date</span>
                        <span class="detail-value">${formatDate(movie.releaseDate)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Category</span>
                        <span class="detail-value">${movie.isKidsMovie ? 'Kids & Family' : 'General Audience'}</span>
                    </div>
                </div>
                <p>${movie.description}</p>
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="closeModal()">Close</button>
                    <button class="btn btn-secondary" onclick="playTrailer(${movie.id})">
                        <i class="fas fa-play"></i> Watch Trailer
                    </button>
                    <button class="btn btn-secondary" onclick="bookMovie(${movie.id})" 
                            ${!userData.isLoggedIn || !userData.user.isAdult ? 'disabled' : ''}>
                        ${!userData.isLoggedIn || !userData.user.isAdult ? 'Book (18+)' : 'Book Tickets'}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

function showBookingModal(movie) {
    const modal = document.getElementById('movie-modal');
    const modalBody = document.getElementById('modal-body');
    
    const showTimes = getShowTimesByMovieId(movie.id);
    
    modalBody.innerHTML = `
        <div class="booking-modal-content">
            <h2>Book Tickets - ${movie.title}</h2>
            <div class="movie-booking-info">
                <img src="${movie.poster}" alt="${movie.title}" class="booking-movie-poster">
                <div class="booking-details">
                    <h3>${movie.title}</h3>
                    <p><strong>Genre:</strong> ${movie.genre.join(', ')}</p>
                    <p><strong>Duration:</strong> ${movie.duration}</p>
                    <p><strong>Rating:</strong> ${movie.ageRating}</p>
                </div>
            </div>
            <div class="showtimes-container">
                <h3>Select Showtime</h3>
                <div class="showtimes-grid">
                    ${showTimes.map(showTime => `
                        <div class="showtime-card" onclick="selectShowtime(${showTime.id})">
                            <div class="showtime-theater">${showTime.theater}</div>
                            <div class="showtime-date">${formatDate(showTime.date)}</div>
                            <div class="showtime-time">${showTime.time}</div>
                            <div class="showtime-price">$${showTime.price}</div>
                            <div class="showtime-seats">${showTime.availableSeats} seats available</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            </div>
        </div>
    `;
    
    // Add styles for booking modal
    const style = document.createElement('style');
    style.textContent = `
        .booking-modal-content {
            padding: 2rem;
        }
        
        .movie-booking-info {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
            align-items: center;
        }
        
        .booking-movie-poster {
            width: 100px;
            height: 150px;
            object-fit: cover;
            border-radius: 8px;
        }
        
        .booking-details h3 {
            color: #e50914;
            margin-bottom: 0.5rem;
        }
        
        .showtimes-container h3 {
            color: #e50914;
            margin-bottom: 1rem;
        }
        
        .showtimes-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }
        
        .showtime-card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
        }
        
        .showtime-card:hover {
            background: rgba(229, 9, 20, 0.1);
            border-color: #e50914;
            transform: translateY(-2px);
        }
        
        .showtime-theater {
            font-weight: 600;
            color: #e50914;
            margin-bottom: 0.5rem;
        }
        
        .showtime-date {
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 0.5rem;
        }
        
        .showtime-time {
            font-size: 1.2rem;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 0.5rem;
        }
        
        .showtime-price {
            font-size: 1.1rem;
            font-weight: 600;
            color: #22c55e;
            margin-bottom: 0.5rem;
        }
        
        .showtime-seats {
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.6);
        }
    `;
    
    document.head.appendChild(style);
    modal.style.display = 'block';
}

function selectShowtime(showtimeId) {
    const showtime = showTimesData.find(st => st.id === showtimeId);
    if (!showtime) return;
    
    const movie = getMovieById(showtime.movieId);
    
    // Create booking
    const booking = {
        id: Date.now().toString(),
        userId: userData.user.id,
        movieId: movie.id,
        showtimeId: showtimeId,
        movieTitle: movie.title,
        theater: showtime.theater,
        date: showtime.date,
        time: showtime.time,
        price: showtime.price,
        seats: ['A1', 'A2'], // Demo seats
        totalPrice: showtime.price * 2, // Demo: 2 tickets
        bookingDate: new Date().toISOString(),
        status: 'confirmed'
    };
    
    // Save booking
    const existingBookings = JSON.parse(localStorage.getItem('myshowz_bookings') || '[]');
    existingBookings.push(booking);
    localStorage.setItem('myshowz_bookings', JSON.stringify(existingBookings));
    
    // Update user data
    userData.bookings = existingBookings;
    
    // Show success message
    showToast('Booking confirmed successfully!', 'success');
    
    // Close modal
    closeModal();
    
    // Show bookings section
    showSection('bookings');
}

function showAgeRestrictionModal() {
    const modal = document.getElementById('age-restriction-modal');
    modal.style.display = 'block';
}

function closeAgeRestrictionModal() {
    const modal = document.getElementById('age-restriction-modal');
    modal.style.display = 'none';
    
    // Navigate to kids zone if user is logged in and is a minor
    if (userData.isLoggedIn && !userData.user.isAdult) {
        showSection('kids-zone');
    }
}

function showBookingRestrictionModal() {
    const modal = document.getElementById('booking-restriction-modal');
    modal.style.display = 'block';
}

function closeBookingRestrictionModal() {
    const modal = document.getElementById('booking-restriction-modal');
    modal.style.display = 'none';
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    
    // Remove dynamically added styles
    const dynamicStyles = document.querySelectorAll('style');
    dynamicStyles.forEach(style => {
        if (style.textContent.includes('.booking-modal-content')) {
            style.remove();
        }
    });
}

// Initialize movies when DOM is loaded
document.addEventListener('DOMContentLoaded', initMovies);

// Export functions for global use
window.filterMovies = filterMovies;
window.watchMovie = watchMovie;
window.bookMovie = bookMovie;
window.showMovieModal = showMovieModal;
window.showAgeRestrictionModal = showAgeRestrictionModal;
window.closeAgeRestrictionModal = closeAgeRestrictionModal;
window.showBookingRestrictionModal = showBookingRestrictionModal;
window.closeBookingRestrictionModal = closeBookingRestrictionModal;
window.closeModal = closeModal;
window.selectShowtime = selectShowtime;