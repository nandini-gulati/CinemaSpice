// Booking functionality
let selectedShowtime = null;
let selectedCity = null;
let selectedTheatre = null;
let selectedSeats = [];
let selectedMeals = [];
let totalPrice = 0;
let mealTotal = 0;
let currentMovie = null;

function showBookingModal(movie) {
    // Ensure userData is available
    if (typeof window.userData === 'undefined') {
        window.userData = {
            isLoggedIn: false,
            user: null,
            bookings: []
        };
    }
    
    if (!window.userData.isLoggedIn) {
        showToast('Please login to book tickets', 'warning');
        showSection('auth');
        return;
    }
    
    if (!window.userData.user.isAdult) {
        showBookingRestrictionModal();
        return;
    }
    
    currentMovie = movie;
    const modal = document.getElementById('booking-modal');
    const modalBody = document.getElementById('booking-modal-body');
    
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
            
            <div class="booking-steps">
                <div class="step active" id="step-1">
                    <h3>1. Select City</h3>
                    <div class="cities-grid">
                        ${getCitiesList().map(city => `
                            <div class="city-card" onclick="selectCity(${city.id})">
                                <div class="city-name">${city.name}</div>
                                <div class="city-state">${city.state}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="step" id="step-2" style="display: none;">
                    <h3>2. Select Theatre</h3>
                    <div class="theatres-grid" id="theatres-grid">
                        <!-- Theatres will be populated here -->
                    </div>
                </div>
                
                <div class="step" id="step-3" style="display: none;">
                    <h3>3. Select Showtime</h3>
                    <div class="showtimes-grid" id="showtimes-grid">
                        <!-- Showtimes will be populated here -->
                    </div>
                </div>
                
                <div class="step" id="step-4" style="display: none;">
                    <h3>4. Select Seats</h3>
                    <div class="seat-selection">
                        <div class="screen">SCREEN</div>
                        <div class="seats-grid" id="seats-grid">
                            <!-- Seats will be generated here -->
                        </div>
                        <div class="seat-legend">
                            <div class="legend-item">
                                <div class="seat available"></div>
                                <span>Available</span>
                            </div>
                            <div class="legend-item">
                                <div class="seat selected"></div>
                                <span>Selected</span>
                            </div>
                            <div class="legend-item">
                                <div class="seat occupied"></div>
                                <span>Occupied</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="step" id="step-5" style="display: none;">
                    <h3>5. Add Meals (Optional)</h3>
                    <div class="meals-selection" id="meals-selection">
                        <!-- Meals will be populated here -->
                    </div>
                </div>
                
                <div class="step" id="step-6" style="display: none;">
                    <h3>6. Confirm Booking</h3>
                    <div class="booking-summary" id="booking-summary">
                        <!-- Summary will be generated here -->
                    </div>
                </div>
            </div>
            
            <div class="booking-actions">
                <button class="btn btn-secondary" onclick="closeBookingModal()">Cancel</button>
                <button class="btn btn-primary" id="next-step-btn" onclick="nextStep()" style="display: none;">Next</button>
                <button class="btn btn-primary" id="confirm-booking-btn" onclick="confirmBooking()" style="display: none;">Confirm Booking</button>
            </div>
        </div>
    `;
    
    // Add booking modal styles
    addBookingModalStyles();
    
    modal.style.display = 'block';
    
    // Reset booking state
    selectedCity = null;
    selectedTheatre = null;
    selectedShowtime = null;
    selectedSeats = [];
    selectedMeals = [];
    totalPrice = 0;
    mealTotal = 0;
}

function selectCity(cityId) {
    selectedCity = getCityById(cityId);
    
    // Highlight selected city
    document.querySelectorAll('.city-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.target.closest('.city-card').classList.add('selected');
    
    // Show theatres for selected city
    showTheatres();
    
    // Move to next step
    document.getElementById('step-1').style.display = 'none';
    document.getElementById('step-2').style.display = 'block';
    document.getElementById('step-1').classList.remove('active');
    document.getElementById('step-2').classList.add('active');
}

function selectTheatre(theatreId) {
    selectedTheatre = getTheatreById(theatreId);
    
    // Highlight selected theatre
    document.querySelectorAll('.theatre-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.target.closest('.theatre-card').classList.add('selected');
    
    // Show showtimes for selected theatre
    showShowtimes();
    
    // Move to next step
    document.getElementById('step-2').style.display = 'none';
    document.getElementById('step-3').style.display = 'block';
    document.getElementById('step-2').classList.remove('active');
    document.getElementById('step-3').classList.add('active');
}

function selectShowtime(showtimeId) {
    selectedShowtime = showTimesData.find(st => st.id === showtimeId);
    
    // Highlight selected showtime
    document.querySelectorAll('.showtime-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.target.closest('.showtime-card').classList.add('selected');
    
    // Show seat selection
    showSeatSelection();
    
    // Move to next step
    document.getElementById('step-3').style.display = 'none';
    document.getElementById('step-4').style.display = 'block';
    document.getElementById('step-3').classList.remove('active');
    document.getElementById('step-4').classList.add('active');
    
    // Hide next button until seats are selected
    document.getElementById('next-step-btn').style.display = 'none';
}

function showTheatres() {
    const theatresGrid = document.getElementById('theatres-grid');
    const theatres = getTheatresByCity(selectedCity.id);
    
    if (theatres.length === 0) {
        theatresGrid.innerHTML = `
            <div class="no-theatres">
                <p>No theatres available in ${selectedCity.name} for this movie.</p>
            </div>
        `;
        return;
    }
    
    theatresGrid.innerHTML = theatres.map(theatre => `
        <div class="theatre-card" onclick="selectTheatre(${theatre.id})">
            <div class="theatre-name">${theatre.name}</div>
            <div class="theatre-type">${theatre.type}</div>
            <div class="theatre-screens">${theatre.screens} Screens</div>
            <div class="theatre-halls">
                ${theatre.halls.slice(0, 2).map(hall => `
                    <span class="hall-feature">${hall.features[0] || 'Digital Sound'}</span>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function showShowtimes() {
    const showtimesGrid = document.getElementById('showtimes-grid');
    const showtimes = getShowTimesByMovieAndCity(currentMovie.id, selectedCity.id)
        .filter(st => st.theatreId === selectedTheatre.id);
    
    if (showtimes.length === 0) {
        showtimesGrid.innerHTML = `
            <div class="no-showtimes">
                <p>No showtimes available for this movie at ${selectedTheatre.name}.</p>
            </div>
        `;
        return;
    }
    
    // Group showtimes by date
    const showtimesByDate = {};
    showtimes.forEach(showtime => {
        if (!showtimesByDate[showtime.date]) {
            showtimesByDate[showtime.date] = [];
        }
        showtimesByDate[showtime.date].push(showtime);
    });
    
    let showtimesHTML = '';
    Object.keys(showtimesByDate).forEach(date => {
        showtimesHTML += `
            <div class="date-section">
                <h4>${formatDate(date)}</h4>
                <div class="date-showtimes">
                    ${showtimesByDate[date].map(showtime => `
                        <div class="showtime-card" onclick="selectShowtime(${showtime.id})">
                            <div class="showtime-hall">${showtime.hallName}</div>
                            <div class="showtime-hall-type">${showtime.hallType}</div>
                            <div class="showtime-features">${showtime.hallFeatures.slice(0, 2).join(', ')}</div>
                            <div class="showtime-time">${showtime.time}</div>
                            <div class="showtime-price">${formatIndianPrice(showtime.price)}</div>
                            <div class="showtime-seats">${showtime.availableSeats} seats available</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    showtimesGrid.innerHTML = showtimesHTML;
}

function showSeatSelection() {
    const seatsGrid = document.getElementById('seats-grid');
    const hall = getHallById(selectedShowtime.hallId);
    
    if (!hall) {
        seatsGrid.innerHTML = '<p>Unable to load seat layout</p>';
        return;
    }
    
    // Generate seat layout based on hall capacity
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const seatsPerRow = Math.ceil(hall.capacity / rows.length);
    
    seatsGrid.innerHTML = '';
    
    rows.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'seat-row';
        
        // Add row label
        const rowLabel = document.createElement('div');
        rowLabel.className = 'row-label';
        rowLabel.textContent = row;
        rowDiv.appendChild(rowLabel);
        
        for (let i = 1; i <= seatsPerRow; i++) {
            const seat = document.createElement('div');
            const seatId = `${row}${i}`;
            seat.className = 'seat available';
            seat.textContent = i;
            seat.setAttribute('data-seat', seatId);
            seat.onclick = () => toggleSeat(seatId, seat);
            
            // Randomly make some seats occupied for demo
            if (Math.random() < 0.2) {
                seat.className = 'seat occupied';
                seat.onclick = null;
            }
            
            rowDiv.appendChild(seat);
        }
        
        seatsGrid.appendChild(rowDiv);
    });
}

function showMealsSelection() {
    const mealsSelection = document.getElementById('meals-selection');
    const mealCategories = getMealsByCategory();
    
    let mealsHTML = '';
    Object.keys(mealCategories).forEach(category => {
        mealsHTML += `
            <div class="meal-category">
                <h4>${category}</h4>
                <div class="category-meals">
                    ${mealCategories[category].map(meal => `
                        <div class="meal-card">
                            <div class="meal-image">${meal.image}</div>
                            <div class="meal-info">
                                <h5>${meal.name}</h5>
                                <p class="meal-price">${formatIndianPrice(meal.price)}</p>
                                <div class="meal-quantity">
                                    <button onclick="updateMealQuantity(${meal.id}, -1)">-</button>
                                    <span id="meal-${meal.id}-qty">0</span>
                                    <button onclick="updateMealQuantity(${meal.id}, 1)">+</button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    mealsSelection.innerHTML = mealsHTML;
}

function updateMealQuantity(mealId, change) {
    const qtyElement = document.getElementById(`meal-${mealId}-qty`);
    let currentQty = parseInt(qtyElement.textContent);
    currentQty = Math.max(0, currentQty + change);
    qtyElement.textContent = currentQty;
    
    // Update selected meals array
    const existingMealIndex = selectedMeals.findIndex(meal => meal.id === mealId);
    const mealData = mealsData.find(m => m.id === mealId);
    
    if (existingMealIndex !== -1) {
        if (currentQty === 0) {
            selectedMeals.splice(existingMealIndex, 1);
        } else {
            selectedMeals[existingMealIndex].quantity = currentQty;
        }
    } else if (currentQty > 0) {
        selectedMeals.push({ ...mealData, quantity: currentQty });
    }
    
    // Update meal total
    mealTotal = selectedMeals.reduce((total, meal) => total + (meal.price * meal.quantity), 0);
}

function toggleSeat(seatId, seatElement) {
    if (seatElement.classList.contains('occupied')) return;
    
    if (seatElement.classList.contains('selected')) {
        // Deselect seat
        seatElement.classList.remove('selected');
        seatElement.classList.add('available');
        selectedSeats = selectedSeats.filter(seat => seat !== seatId);
    } else {
        // Select seat (max 10 seats)
        if (selectedSeats.length >= 10) {
            showToast('Maximum 10 seats can be selected', 'warning');
            return;
        }
        
        seatElement.classList.remove('available');
        seatElement.classList.add('selected');
        selectedSeats.push(seatId);
    }
    
    // Update total price
    totalPrice = selectedSeats.length * selectedShowtime.price;
    
    // Show/hide next button based on seat selection
    if (selectedSeats.length > 0) {
        document.getElementById('next-step-btn').style.display = 'inline-block';
        document.getElementById('next-step-btn').onclick = () => {
            // Move to meals selection
            document.getElementById('step-4').style.display = 'none';
            document.getElementById('step-5').style.display = 'block';
            document.getElementById('step-4').classList.remove('active');
            document.getElementById('step-5').classList.add('active');
            showMealsSelection();
        };
    } else {
        document.getElementById('next-step-btn').style.display = 'none';
    }
}

function showBookingSummary() {
    const summaryDiv = document.getElementById('booking-summary');
    const ticketTotal = selectedSeats.length * selectedShowtime.price;
    const convenienceFee = Math.round(ticketTotal * 0.02); // 2% convenience fee
    const grandTotal = ticketTotal + mealTotal + convenienceFee;
    
    summaryDiv.innerHTML = `
        <div class="summary-card">
            <div class="summary-movie">
                <img src="${currentMovie.poster}" alt="${currentMovie.title}" class="summary-poster">
                <div class="summary-details">
                    <h4>${currentMovie.title}</h4>
                    <p><strong>Theatre:</strong> ${selectedTheatre.name}</p>
                    <p><strong>City:</strong> ${selectedCity.name}</p>
                    <p><strong>Hall:</strong> ${selectedShowtime.hallName} (${selectedShowtime.hallType})</p>
                    <p><strong>Date:</strong> ${formatDate(selectedShowtime.date)}</p>
                    <p><strong>Time:</strong> ${selectedShowtime.time}</p>
                    <p><strong>Seats:</strong> ${selectedSeats.join(', ')}</p>
                </div>
            </div>
            
            <div class="summary-pricing">
                <div class="price-breakdown">
                    <div class="price-item">
                        <span>Tickets (${selectedSeats.length} × ${formatIndianPrice(selectedShowtime.price)})</span>
                        <span>${formatIndianPrice(ticketTotal)}</span>
                    </div>
                    ${selectedMeals.length > 0 ? `
                        <div class="price-item">
                            <span>Meals</span>
                            <span>${formatIndianPrice(mealTotal)}</span>
                        </div>
                        <div class="meal-details">
                            ${selectedMeals.map(meal => `
                                <div class="meal-summary">
                                    <span>${meal.name} × ${meal.quantity}</span>
                                    <span>${formatIndianPrice(meal.price * meal.quantity)}</span>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                    <div class="price-item">
                        <span>Convenience Fee</span>
                        <span>${formatIndianPrice(convenienceFee)}</span>
                    </div>
                    <div class="price-item total">
                        <span><strong>Total Amount</strong></span>
                        <span><strong>${formatIndianPrice(grandTotal)}</strong></span>
                    </div>
                </div>
            </div>
            
            <div class="payment-options">
                <h4>Select Payment Method</h4>
                <div class="payment-methods">
                    <div class="payment-method">
                        <input type="radio" id="upi" name="payment" value="upi" checked>
                        <label for="upi">UPI</label>
                    </div>
                    <div class="payment-method">
                        <input type="radio" id="card" name="payment" value="card">
                        <label for="card">Credit/Debit Card</label>
                    </div>
                    <div class="payment-method">
                        <input type="radio" id="netbanking" name="payment" value="netbanking">
                        <label for="netbanking">Net Banking</label>
                    </div>
                    <div class="payment-method">
                        <input type="radio" id="wallet" name="payment" value="wallet">
                        <label for="wallet">Digital Wallet</label>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Hide next button, show confirm button
    document.getElementById('next-step-btn').style.display = 'none';
    document.getElementById('confirm-booking-btn').style.display = 'inline-block';
}

function confirmBooking() {
    if (!selectedShowtime || selectedSeats.length === 0) {
        showToast('Invalid booking data', 'error');
        return;
    }
    
    const ticketTotal = selectedSeats.length * selectedShowtime.price;
    const convenienceFee = Math.round(ticketTotal * 0.02);
    const grandTotal = ticketTotal + mealTotal + convenienceFee;
    
    // Get selected payment method
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || 'upi';
    
    // Create booking
    const booking = {
        id: Date.now().toString(),
        userId: userData.user.id,
        movieId: currentMovie.id,
        movieTitle: currentMovie.title,
        showtimeId: selectedShowtime.id,
        theatreId: selectedTheatre.id,
        theatreName: selectedTheatre.name,
        cityId: selectedCity.id,
        cityName: selectedCity.name,
        hallName: selectedShowtime.hallName,
        hallType: selectedShowtime.hallType,
        date: selectedShowtime.date,
        time: selectedShowtime.time,
        seats: [...selectedSeats],
        meals: [...selectedMeals],
        ticketPrice: selectedShowtime.price,
        ticketTotal: ticketTotal,
        mealTotal: mealTotal,
        convenienceFee: convenienceFee,
        totalPrice: grandTotal,
        paymentMethod: paymentMethod,
        bookingDate: new Date().toISOString(),
        status: 'confirmed'
    };
    
    // Simulate payment processing
    showToast('Processing payment...', 'info');
    
    setTimeout(() => {
        // Save booking
        const existingBookings = JSON.parse(localStorage.getItem('cinemaspice_bookings') || '[]');
        existingBookings.push(booking);
        localStorage.setItem('cinemaspice_bookings', JSON.stringify(existingBookings));
        
        // Update available seats
        selectedShowtime.availableSeats -= selectedSeats.length;
        
        // Show success message
        showToast('Booking confirmed successfully!', 'success');
        
        // Close modal
        closeBookingModal();
        
        // Show bookings section
        setTimeout(() => {
            showSection('bookings');
        }, 1000);
    }, 2000);
}

function closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    modal.style.display = 'none';
    
    // Reset booking state
    selectedCity = null;
    selectedTheatre = null;
    selectedShowtime = null;
    selectedSeats = [];
    selectedMeals = [];
    totalPrice = 0;
    mealTotal = 0;
    currentMovie = null;
    
    // Remove dynamic styles
    const dynamicStyles = document.querySelectorAll('style[data-booking-modal]');
    dynamicStyles.forEach(style => style.remove());
}

function nextStep() {
    const currentStep = document.querySelector('.step.active');
    if (!currentStep) return;
    
    const stepNumber = parseInt(currentStep.id.split('-')[1]);
    
    if (stepNumber === 5) {
        // Move from meals to summary
        currentStep.style.display = 'none';
        document.getElementById('step-6').style.display = 'block';
        currentStep.classList.remove('active');
        document.getElementById('step-6').classList.add('active');
        showBookingSummary();
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

function addBookingModalStyles() {
    const style = document.createElement('style');
    style.setAttribute('data-booking-modal', 'true');
    style.textContent = `
        .booking-modal-content {
            padding: 2rem;
            max-height: 80vh;
            overflow-y: auto;
        }
        
        .movie-booking-info {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
            align-items: center;
            padding: 1rem;
            background: var(--bg-primary);
            border-radius: 10px;
        }
        
        .booking-movie-poster {
            width: 80px;
            height: 120px;
            object-fit: cover;
            border-radius: 8px;
        }
        
        .booking-details h3 {
            color: var(--accent-primary);
            margin-bottom: 0.5rem;
        }
        
        .booking-steps {
            margin-bottom: 2rem;
        }
        
        .step {
            margin-bottom: 2rem;
        }
        
        .step h3 {
            color: var(--accent-primary);
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid var(--border-color);
        }
        
        .step.active h3 {
            border-bottom-color: var(--accent-primary);
        }
        
        .cities-grid, .theatres-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }
        
        .city-card, .theatre-card {
            background: var(--bg-primary);
            border: 2px solid var(--border-color);
            border-radius: 10px;
            padding: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
        }
        
        .city-card:hover, .theatre-card:hover,
        .city-card.selected, .theatre-card.selected {
            border-color: var(--accent-primary);
            transform: translateY(-2px);
            background: rgba(229, 9, 20, 0.1);
        }
        
        .city-name, .theatre-name {
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 0.5rem;
        }
        
        .city-state, .theatre-type {
            color: var(--text-secondary);
            font-size: 0.9rem;
        }
        
        .theatre-screens {
            color: var(--accent-primary);
            font-size: 0.9rem;
            margin: 0.5rem 0;
        }
        
        .theatre-halls {
            display: flex;
            gap: 0.5rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .hall-feature {
            background: var(--accent-primary);
            color: white;
            padding: 0.2rem 0.5rem;
            border-radius: 10px;
            font-size: 0.7rem;
        }
        
        .date-section {
            margin-bottom: 1.5rem;
        }
        
        .date-section h4 {
            color: var(--text-primary);
            margin-bottom: 1rem;
            font-size: 1.1rem;
        }
        
        .date-showtimes {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }
        
        .showtime-card {
            background: var(--bg-primary);
            border: 2px solid var(--border-color);
            border-radius: 10px;
            padding: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
        }
        
        .showtime-card:hover, .showtime-card.selected {
            border-color: var(--accent-primary);
            transform: translateY(-2px);
            background: rgba(229, 9, 20, 0.1);
        }
        
        .no-theatres, .no-showtimes {
            text-align: center;
            color: var(--text-muted);
            padding: 2rem;
            background: var(--bg-primary);
            border-radius: 10px;
            border: 1px solid var(--border-color);
        }
        
        .seat-selection {
            text-align: center;
        }
        
        .screen {
            background: var(--accent-primary);
            color: white;
            padding: 1rem;
            margin-bottom: 2rem;
            border-radius: 10px;
            font-weight: 600;
            letter-spacing: 2px;
        }
        
        .seats-grid {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            margin-bottom: 2rem;
        }
        
        .seat-row {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            align-items: center;
        }
        
        .row-label {
            width: 30px;
            font-weight: 600;
            color: var(--text-secondary);
        }
        
        .seat {
            width: 35px;
            height: 35px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .seat.available {
            background: var(--bg-primary);
            border: 2px solid var(--border-color);
            color: var(--text-primary);
        }
        
        .seat.available:hover {
            border-color: var(--accent-primary);
            transform: scale(1.1);
        }
        
        .seat.selected {
            background: var(--accent-primary);
            border: 2px solid var(--accent-primary);
            color: white;
            transform: scale(1.1);
        }
        
        .seat.occupied {
            background: #6c757d;
            border: 2px solid #6c757d;
            color: white;
            cursor: not-allowed;
        }
        
        .seat-legend {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-top: 1rem;
        }
        
        .legend-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
        }
        
        .legend-item .seat {
            width: 20px;
            height: 20px;
            cursor: default;
        }
        
        .meal-category {
            margin-bottom: 2rem;
        }
        
        .meal-category h4 {
            color: var(--accent-primary);
            margin-bottom: 1rem;
        }
        
        .category-meals {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }
        
        .meal-card {
            background: var(--bg-primary);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            padding: 1rem;
            text-align: center;
        }
        
        .meal-image {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }
        
        .meal-info h5 {
            color: var(--text-primary);
            margin-bottom: 0.5rem;
        }
        
        .meal-price {
            color: var(--accent-primary);
            font-weight: 600;
            margin-bottom: 1rem;
        }
        
        .meal-quantity {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
        }
        
        .meal-quantity button {
            width: 30px;
            height: 30px;
            border: none;
            background: var(--accent-primary);
            color: white;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.2rem;
        }
        
        .meal-quantity span {
            min-width: 20px;
            text-align: center;
            font-weight: 600;
        }
        
        .summary-card {
            background: var(--bg-primary);
            border-radius: 10px;
            padding: 1.5rem;
        }
        
        .summary-movie {
            display: flex;
            gap: 1rem;
            margin-bottom: 1.5rem;
            align-items: center;
        }
        
        .summary-poster {
            width: 60px;
            height: 90px;
            object-fit: cover;
            border-radius: 5px;
        }
        
        .summary-details h4 {
            color: var(--accent-primary);
            margin-bottom: 0.5rem;
        }
        
        .summary-details p {
            margin-bottom: 0.3rem;
            color: var(--text-secondary);
        }
        
        .summary-pricing {
            border-top: 1px solid var(--border-color);
            padding-top: 1rem;
        }
        
        .price-breakdown {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .price-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .price-item.total {
            border-top: 1px solid var(--border-color);
            padding-top: 0.5rem;
            margin-top: 0.5rem;
            font-size: 1.1rem;
        }
        
        .meal-details {
            margin-left: 1rem;
            margin-top: 0.5rem;
        }
        
        .meal-summary {
            display: flex;
            justify-content: space-between;
            font-size: 0.9rem;
            color: var(--text-muted);
            margin-bottom: 0.3rem;
        }
        
        .booking-actions {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
            margin-top: 2rem;
        }
    `;
    
    document.head.appendChild(style);
}

// Export functions for global use
window.showBookingModal = showBookingModal;
window.selectCity = selectCity;
window.selectTheatre = selectTheatre;
window.selectShowtime = selectShowtime;
window.showTheatres = showTheatres;
window.showShowtimes = showShowtimes;
window.showSeatSelection = showSeatSelection;
window.showMealsSelection = showMealsSelection;
window.updateMealQuantity = updateMealQuantity;
window.toggleSeat = toggleSeat;
window.showBookingSummary = showBookingSummary;
window.confirmBooking = confirmBooking;
window.closeBookingModal = closeBookingModal;
window.nextStep = nextStep;
window.showBookingRestrictionModal = showBookingRestrictionModal;
window.closeBookingRestrictionModal = closeBookingRestrictionModal;
window.addBookingModalStyles = addBookingModalStyles;