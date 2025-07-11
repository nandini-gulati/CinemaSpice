// Enhanced Booking System with Full Functionality
class BookingManager {
    constructor() {
        this.currentBooking = null;
        this.selectedSeats = [];
        this.selectedMeals = [];
        this.currentStep = 1;
        this.totalSteps = 4;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadBookings();
    }

    setupEventListeners() {
        // Close booking modal
        document.addEventListener('click', (e) => {
            if (e.target.id === 'booking-modal') {
                this.closeBookingModal();
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeBookingModal();
            }
        });
    }

    showBookingModal(movie) {
        if (!window.userData.isLoggedIn) {
            window.showToast && window.showToast('Please login to book tickets', 'warning');
            window.showSection && window.showSection('auth');
            return;
        }

        if (!window.userData.user.isAdult) {
            this.showBookingRestrictionModal();
            return;
        }

        this.currentBooking = {
            movie: movie,
            showtime: null,
            seats: [],
            meals: [],
            totalPrice: 0
        };

        this.currentStep = 1;
        this.selectedSeats = [];
        this.selectedMeals = [];
        
        this.renderBookingModal();
        document.getElementById('booking-modal').style.display = 'block';
    }

    renderBookingModal() {
        const modalBody = document.getElementById('booking-modal-body');
        if (!modalBody) return;

        modalBody.innerHTML = `
            <div class="booking-container">
                <div class="booking-header">
                    <h2>Book Tickets - ${this.currentBooking.movie.title}</h2>
                    <div class="booking-progress">
                        ${this.renderProgressSteps()}
                    </div>
                </div>
                <div class="booking-content">
                    ${this.renderCurrentStep()}
                </div>
            </div>
        `;
    }

    renderProgressSteps() {
        const steps = ['Select Show', 'Choose Seats', 'Add Meals', 'Payment'];
        return `
            <div class="progress-steps">
                ${steps.map((step, index) => `
                    <div class="progress-step ${index + 1 <= this.currentStep ? 'active' : ''} ${index + 1 === this.currentStep ? 'current' : ''}">
                        <div class="step-number">${index + 1}</div>
                        <div class="step-label">${step}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderCurrentStep() {
        switch (this.currentStep) {
            case 1:
                return this.renderShowtimeSelection();
            case 2:
                return this.renderSeatSelection();
            case 3:
                return this.renderMealSelection();
            case 4:
                return this.renderPaymentStep();
            default:
                return '';
        }
    }

    renderShowtimeSelection() {
        const showTimes = window.getShowTimesByMovieId ? window.getShowTimesByMovieId(this.currentBooking.movie.id) : [];
        const cities = window.getCitiesList ? window.getCitiesList() : [];
        
        // Group showtimes by city and date
        const groupedShowtimes = {};
        showTimes.forEach(showtime => {
            const city = window.getCityById(showtime.cityId);
            const theatre = window.getTheatreById(showtime.theatreId);
            const hall = window.getHallById(showtime.hallId);
            
            if (!city || !theatre || !hall) return;
            
            const cityName = city.name;
            const date = showtime.date;
            
            if (!groupedShowtimes[cityName]) {
                groupedShowtimes[cityName] = {};
            }
            if (!groupedShowtimes[cityName][date]) {
                groupedShowtimes[cityName][date] = [];
            }
            
            groupedShowtimes[cityName][date].push({
                ...showtime,
                cityName: city.name,
                theatreName: theatre.name,
                hallName: hall.name,
                hallType: hall.type,
                features: hall.features
            });
        });

        return `
            <div class="step-content">
                <div class="movie-info-card">
                    <img src="${this.currentBooking.movie.poster}" alt="${this.currentBooking.movie.title}" class="booking-poster">
                    <div class="movie-details">
                        <h3>${this.currentBooking.movie.title}</h3>
                        <p><strong>Genre:</strong> ${this.currentBooking.movie.genre.join(', ')}</p>
                        <p><strong>Duration:</strong> ${this.currentBooking.movie.duration}</p>
                        <p><strong>Rating:</strong> ${this.currentBooking.movie.ageRating}</p>
                    </div>
                </div>
                
                <div class="showtimes-section">
                    <h3>Select City & Showtime</h3>
                    <div class="cities-showtimes">
                        ${Object.keys(groupedShowtimes).map(cityName => `
                            <div class="city-section">
                                <h4 class="city-name">${cityName}</h4>
                                ${Object.keys(groupedShowtimes[cityName]).map(date => `
                                    <div class="date-section">
                                        <h5 class="show-date">${window.formatDate ? window.formatDate(date) : date}</h5>
                                        <div class="showtimes-grid">
                                            ${groupedShowtimes[cityName][date].map(showtime => `
                                                <div class="showtime-card" onclick="bookingManager.selectShowtime(${showtime.id})">
                                                    <div class="theatre-info">
                                                        <div class="theatre-name">${showtime.theatreName}</div>
                                                        <div class="hall-info">${showtime.hallName} - ${showtime.hallType}</div>
                                                        <div class="hall-features">${showtime.features.join(', ')}</div>
                                                    </div>
                                                    <div class="show-time">${showtime.time}</div>
                                                    <div class="show-price">${window.formatIndianPrice ? window.formatIndianPrice(showtime.price) : '₹' + showtime.price}</div>
                                                    <div class="available-seats">${showtime.availableSeats} seats available</div>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="step-actions">
                    <button class="btn btn-secondary" onclick="bookingManager.closeBookingModal()">Cancel</button>
                </div>
            </div>
        `;
    }

    selectShowtime(showtimeId) {
        const showtime = window.showTimesData ? window.showTimesData.find(st => st.id === showtimeId) : null;
        if (!showtime) return;

        // Add additional details
        const city = window.getCityById(showtime.cityId);
        const theatre = window.getTheatreById(showtime.theatreId);
        const hall = window.getHallById(showtime.hallId);

        this.currentBooking.showtime = {
            ...showtime,
            cityName: city?.name || 'Unknown City',
            theatreName: theatre?.name || 'Unknown Theatre',
            hallName: hall?.name || 'Unknown Hall',
            hallType: hall?.type || 'Standard',
            features: hall?.features || [],
            totalSeats: hall?.capacity || 100
        };

        this.nextStep();
    }

    renderSeatSelection() {
        const showtime = this.currentBooking.showtime;
        const totalSeats = showtime.totalSeats;
        const availableSeats = showtime.availableSeats;
        
        // Generate seat layout (simplified grid)
        const rows = Math.ceil(totalSeats / 12);
        const seatsPerRow = 12;
        
        return `
            <div class="step-content">
                <div class="showtime-summary">
                    <h3>Select Seats</h3>
                    <div class="booking-summary-card">
                        <p><strong>${showtime.theatreName}</strong> - ${showtime.hallName}</p>
                        <p>${window.formatDate ? window.formatDate(showtime.date) : showtime.date} at ${showtime.time}</p>
                        <p>Price per seat: ${window.formatIndianPrice ? window.formatIndianPrice(showtime.price) : '₹' + showtime.price}</p>
                    </div>
                </div>
                
                <div class="seat-selection-container">
                    <div class="screen">SCREEN</div>
                    <div class="seats-grid">
                        ${this.generateSeatLayout(rows, seatsPerRow, availableSeats)}
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
                
                <div class="selected-seats-info">
                    <p>Selected Seats: <span id="selected-seats-display">None</span></p>
                    <p>Total: <span id="seats-total">₹0</span></p>
                </div>
                
                <div class="step-actions">
                    <button class="btn btn-secondary" onclick="bookingManager.previousStep()">Back</button>
                    <button class="btn btn-primary" onclick="bookingManager.nextStep()" id="seats-next-btn" disabled>Continue</button>
                </div>
            </div>
        `;
    }

    generateSeatLayout(rows, seatsPerRow, availableSeats) {
        let seatHTML = '';
        let seatNumber = 1;
        
        for (let row = 0; row < rows; row++) {
            const rowLetter = String.fromCharCode(65 + row); // A, B, C, etc.
            seatHTML += `<div class="seat-row" data-row="${rowLetter}">`;
            
            for (let seat = 1; seat <= seatsPerRow && seatNumber <= availableSeats + 20; seat++) {
                const seatId = `${rowLetter}${seat}`;
                const isOccupied = Math.random() < 0.3; // 30% chance of being occupied
                const seatClass = isOccupied ? 'seat occupied' : 'seat available';
                
                seatHTML += `
                    <div class="${seatClass}" 
                         data-seat-id="${seatId}" 
                         onclick="bookingManager.toggleSeat('${seatId}')"
                         ${isOccupied ? 'disabled' : ''}>
                        ${seatId}
                    </div>
                `;
                seatNumber++;
            }
            
            seatHTML += '</div>';
        }
        
        return seatHTML;
    }

    toggleSeat(seatId) {
        const seatElement = document.querySelector(`[data-seat-id="${seatId}"]`);
        if (!seatElement || seatElement.classList.contains('occupied')) return;

        if (seatElement.classList.contains('selected')) {
            // Deselect seat
            seatElement.classList.remove('selected');
            seatElement.classList.add('available');
            this.selectedSeats = this.selectedSeats.filter(seat => seat !== seatId);
        } else {
            // Select seat (max 6 seats)
            if (this.selectedSeats.length >= 6) {
                window.showToast && window.showToast('Maximum 6 seats can be selected', 'warning');
                return;
            }
            
            seatElement.classList.remove('available');
            seatElement.classList.add('selected');
            this.selectedSeats.push(seatId);
        }

        this.updateSeatSelection();
    }

    updateSeatSelection() {
        const selectedSeatsDisplay = document.getElementById('selected-seats-display');
        const seatsTotal = document.getElementById('seats-total');
        const nextBtn = document.getElementById('seats-next-btn');

        if (selectedSeatsDisplay) {
            selectedSeatsDisplay.textContent = this.selectedSeats.length > 0 ? this.selectedSeats.join(', ') : 'None';
        }

        const total = this.selectedSeats.length * this.currentBooking.showtime.price;
        if (seatsTotal) {
            seatsTotal.textContent = window.formatIndianPrice ? window.formatIndianPrice(total) : '₹' + total;
        }

        if (nextBtn) {
            nextBtn.disabled = this.selectedSeats.length === 0;
        }

        this.currentBooking.seats = this.selectedSeats;
        this.updateTotalPrice();
    }

    renderMealSelection() {
        const mealCategories = window.getMealsByCategory ? window.getMealsByCategory() : {};
        
        return `
            <div class="step-content">
                <h3>Add Food & Beverages (Optional)</h3>
                
                <div class="meals-section">
                    ${Object.keys(mealCategories).map(category => `
                        <div class="meal-category">
                            <h4 class="category-title">${category}</h4>
                            <div class="meals-grid">
                                ${mealCategories[category].map(meal => `
                                    <div class="meal-card">
                                        <div class="meal-info">
                                            <div class="meal-icon">${meal.image}</div>
                                            <div class="meal-details">
                                                <h5>${meal.name}</h5>
                                                <p class="meal-price">${window.formatIndianPrice ? window.formatIndianPrice(meal.price) : '₹' + meal.price}</p>
                                            </div>
                                        </div>
                                        <div class="meal-quantity">
                                            <button class="quantity-btn" onclick="bookingManager.updateMealQuantity(${meal.id}, -1)">-</button>
                                            <span class="quantity" id="meal-${meal.id}-qty">0</span>
                                            <button class="quantity-btn" onclick="bookingManager.updateMealQuantity(${meal.id}, 1)">+</button>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="meals-summary">
                    <h4>Food & Beverages Total: <span id="meals-total">₹0</span></h4>
                </div>
                
                <div class="step-actions">
                    <button class="btn btn-secondary" onclick="bookingManager.previousStep()">Back</button>
                    <button class="btn btn-primary" onclick="bookingManager.nextStep()">Continue</button>
                </div>
            </div>
        `;
    }

    updateMealQuantity(mealId, change) {
        const quantityElement = document.getElementById(`meal-${mealId}-qty`);
        if (!quantityElement) return;

        let currentQty = parseInt(quantityElement.textContent) || 0;
        let newQty = Math.max(0, Math.min(10, currentQty + change)); // Max 10 items

        quantityElement.textContent = newQty;

        // Update selected meals array
        const mealIndex = this.selectedMeals.findIndex(meal => meal.id === mealId);
        const mealData = window.mealsData ? window.mealsData.find(meal => meal.id === mealId) : null;

        if (newQty === 0) {
            if (mealIndex > -1) {
                this.selectedMeals.splice(mealIndex, 1);
            }
        } else {
            if (mealIndex > -1) {
                this.selectedMeals[mealIndex].quantity = newQty;
            } else if (mealData) {
                this.selectedMeals.push({
                    ...mealData,
                    quantity: newQty
                });
            }
        }

        this.updateMealsTotal();
    }

    updateMealsTotal() {
        const mealsTotal = this.selectedMeals.reduce((total, meal) => {
            return total + (meal.price * meal.quantity);
        }, 0);

        const mealsTotalElement = document.getElementById('meals-total');
        if (mealsTotalElement) {
            mealsTotalElement.textContent = window.formatIndianPrice ? window.formatIndianPrice(mealsTotal) : '₹' + mealsTotal;
        }

        this.currentBooking.meals = this.selectedMeals;
        this.updateTotalPrice();
    }

    renderPaymentStep() {
        const seatsTotal = this.selectedSeats.length * this.currentBooking.showtime.price;
        const mealsTotal = this.selectedMeals.reduce((total, meal) => total + (meal.price * meal.quantity), 0);
        const convenienceFee = Math.round(seatsTotal * 0.02); // 2% convenience fee
        const taxes = Math.round((seatsTotal + mealsTotal + convenienceFee) * 0.18); // 18% GST
        const grandTotal = seatsTotal + mealsTotal + convenienceFee + taxes;

        this.currentBooking.totalPrice = grandTotal;

        return `
            <div class="step-content">
                <h3>Payment & Booking Summary</h3>
                
                <div class="booking-summary">
                    <div class="summary-section">
                        <h4>Movie Details</h4>
                        <div class="summary-card">
                            <div class="summary-movie">
                                <img src="${this.currentBooking.movie.poster}" alt="${this.currentBooking.movie.title}" class="summary-poster">
                                <div class="summary-details">
                                    <h5>${this.currentBooking.movie.title}</h5>
                                    <p>${this.currentBooking.showtime.theatreName} - ${this.currentBooking.showtime.hallName}</p>
                                    <p>${window.formatDate ? window.formatDate(this.currentBooking.showtime.date) : this.currentBooking.showtime.date} at ${this.currentBooking.showtime.time}</p>
                                    <p>Seats: ${this.selectedSeats.join(', ')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    ${this.selectedMeals.length > 0 ? `
                        <div class="summary-section">
                            <h4>Food & Beverages</h4>
                            <div class="summary-card">
                                ${this.selectedMeals.map(meal => `
                                    <div class="meal-summary-item">
                                        <span>${meal.name} x ${meal.quantity}</span>
                                        <span>${window.formatIndianPrice ? window.formatIndianPrice(meal.price * meal.quantity) : '₹' + (meal.price * meal.quantity)}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    <div class="summary-section">
                        <h4>Price Breakdown</h4>
                        <div class="summary-card price-breakdown">
                            <div class="price-item">
                                <span>Tickets (${this.selectedSeats.length} x ${window.formatIndianPrice ? window.formatIndianPrice(this.currentBooking.showtime.price) : '₹' + this.currentBooking.showtime.price})</span>
                                <span>${window.formatIndianPrice ? window.formatIndianPrice(seatsTotal) : '₹' + seatsTotal}</span>
                            </div>
                            ${mealsTotal > 0 ? `
                                <div class="price-item">
                                    <span>Food & Beverages</span>
                                    <span>${window.formatIndianPrice ? window.formatIndianPrice(mealsTotal) : '₹' + mealsTotal}</span>
                                </div>
                            ` : ''}
                            <div class="price-item">
                                <span>Convenience Fee</span>
                                <span>${window.formatIndianPrice ? window.formatIndianPrice(convenienceFee) : '₹' + convenienceFee}</span>
                            </div>
                            <div class="price-item">
                                <span>Taxes (GST 18%)</span>
                                <span>${window.formatIndianPrice ? window.formatIndianPrice(taxes) : '₹' + taxes}</span>
                            </div>
                            <div class="price-item total">
                                <span><strong>Total Amount</strong></span>
                                <span><strong>${window.formatIndianPrice ? window.formatIndianPrice(grandTotal) : '₹' + grandTotal}</strong></span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="payment-section">
                    <h4>Payment Method</h4>
                    <div class="payment-methods">
                        <label class="payment-method">
                            <input type="radio" name="payment" value="upi" checked>
                            <span>💳 UPI Payment</span>
                        </label>
                        <label class="payment-method">
                            <input type="radio" name="payment" value="card">
                            <span>💳 Credit/Debit Card</span>
                        </label>
                        <label class="payment-method">
                            <input type="radio" name="payment" value="netbanking">
                            <span>🏦 Net Banking</span>
                        </label>
                        <label class="payment-method">
                            <input type="radio" name="payment" value="wallet">
                            <span>📱 Digital Wallet</span>
                        </label>
                    </div>
                </div>
                
                <div class="step-actions">
                    <button class="btn btn-secondary" onclick="bookingManager.previousStep()">Back</button>
                    <button class="btn btn-primary payment-btn" onclick="bookingManager.processPayment()">
                        Pay ${window.formatIndianPrice ? window.formatIndianPrice(grandTotal) : '₹' + grandTotal}
                    </button>
                </div>
            </div>
        `;
    }

    async processPayment() {
        const paymentBtn = document.querySelector('.payment-btn');
        const selectedPaymentMethod = document.querySelector('input[name="payment"]:checked')?.value || 'upi';
        
        if (paymentBtn) {
            paymentBtn.disabled = true;
            paymentBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        }

        try {
            // Simulate payment processing
            const paymentResult = await window.initiatePayment({
                amount: this.currentBooking.totalPrice,
                method: selectedPaymentMethod,
                booking: this.currentBooking
            });

            if (paymentResult.success) {
                // Create booking record
                const booking = {
                    id: Date.now().toString(),
                    userId: window.userData.user.id,
                    movieId: this.currentBooking.movie.id,
                    movieTitle: this.currentBooking.movie.title,
                    moviePoster: this.currentBooking.movie.poster,
                    showtime: this.currentBooking.showtime,
                    seats: this.selectedSeats,
                    meals: this.selectedMeals,
                    totalPrice: this.currentBooking.totalPrice,
                    paymentId: paymentResult.paymentId,
                    transactionId: paymentResult.transactionId,
                    paymentMethod: selectedPaymentMethod,
                    bookingDate: new Date().toISOString(),
                    status: 'confirmed'
                };

                // Save booking
                this.saveBooking(booking);
                
                // Show success and generate ticket
                this.showBookingSuccess(booking);
                
            } else {
                throw new Error('Payment failed');
            }
        } catch (error) {
            console.error('Payment error:', error);
            window.showToast && window.showToast('Payment failed. Please try again.', 'error');
            
            if (paymentBtn) {
                paymentBtn.disabled = false;
                paymentBtn.innerHTML = `Pay ${window.formatIndianPrice ? window.formatIndianPrice(this.currentBooking.totalPrice) : '₹' + this.currentBooking.totalPrice}`;
            }
        }
    }

    saveBooking(booking) {
        try {
            const existingBookings = JSON.parse(localStorage.getItem('cinemaspice_bookings') || '[]');
            existingBookings.push(booking);
            localStorage.setItem('cinemaspice_bookings', JSON.stringify(existingBookings));
            
            // Update global userData
            window.userData.bookings = existingBookings;
        } catch (error) {
            console.error('Error saving booking:', error);
        }
    }

    showBookingSuccess(booking) {
        const modalBody = document.getElementById('booking-modal-body');
        if (!modalBody) return;

        modalBody.innerHTML = `
            <div class="booking-success">
                <div class="success-header">
                    <div class="success-icon">✅</div>
                    <h2>Booking Confirmed!</h2>
                    <p>Your tickets have been booked successfully</p>
                </div>
                
                <div class="ticket">
                    <div class="ticket-header">
                        <h3>🎬 CinemaSpice E-Ticket</h3>
                        <div class="booking-id">Booking ID: ${booking.id}</div>
                    </div>
                    
                    <div class="ticket-content">
                        <div class="ticket-movie">
                            <img src="${booking.moviePoster}" alt="${booking.movieTitle}" class="ticket-poster">
                            <div class="ticket-details">
                                <h4>${booking.movieTitle}</h4>
                                <p><strong>Theatre:</strong> ${booking.showtime.theatreName}</p>
                                <p><strong>Screen:</strong> ${booking.showtime.hallName}</p>
                                <p><strong>Date & Time:</strong> ${window.formatDate ? window.formatDate(booking.showtime.date) : booking.showtime.date} at ${booking.showtime.time}</p>
                                <p><strong>Seats:</strong> ${booking.seats.join(', ')}</p>
                                <p><strong>Total Paid:</strong> ${window.formatIndianPrice ? window.formatIndianPrice(booking.totalPrice) : '₹' + booking.totalPrice}</p>
                            </div>
                        </div>
                        
                        <div class="ticket-qr">
                            <div class="qr-code">📱</div>
                            <p>Show this ticket at the theatre</p>
                        </div>
                    </div>
                    
                    <div class="ticket-footer">
                        <p><strong>Transaction ID:</strong> ${booking.transactionId}</p>
                        <p><strong>Payment Method:</strong> ${booking.paymentMethod.toUpperCase()}</p>
                        <p class="booking-note">Please arrive 15 minutes before showtime</p>
                    </div>
                </div>
                
                <div class="success-actions">
                    <button class="btn btn-primary" onclick="bookingManager.downloadTicket('${booking.id}')">
                        <i class="fas fa-download"></i> Download Ticket
                    </button>
                    <button class="btn btn-secondary" onclick="bookingManager.closeBookingModal(); window.showSection('bookings')">
                        View All Bookings
                    </button>
                    <button class="btn btn-secondary" onclick="bookingManager.closeBookingModal()">
                        Close
                    </button>
                </div>
            </div>
        `;

        // Show success toast
        window.showToast && window.showToast('Booking confirmed successfully! 🎉', 'success');
    }

    downloadTicket(bookingId) {
        // In a real app, this would generate a PDF
        window.showToast && window.showToast('Ticket download started!', 'success');
        
        // Simulate download
        const link = document.createElement('a');
        link.href = 'data:text/plain;charset=utf-8,CinemaSpice E-Ticket - Booking ID: ' + bookingId;
        link.download = `CinemaSpice-Ticket-${bookingId}.txt`;
        link.click();
    }

    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.renderBookingModal();
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.renderBookingModal();
        }
    }

    updateTotalPrice() {
        const seatsTotal = this.selectedSeats.length * (this.currentBooking.showtime?.price || 0);
        const mealsTotal = this.selectedMeals.reduce((total, meal) => total + (meal.price * meal.quantity), 0);
        this.currentBooking.totalPrice = seatsTotal + mealsTotal;
    }

    loadBookings() {
        const bookingsList = document.getElementById('bookings-list');
        if (!bookingsList) return;

        try {
            const bookings = JSON.parse(localStorage.getItem('cinemaspice_bookings') || '[]');
            const userBookings = bookings.filter(booking => 
                window.userData.isLoggedIn && booking.userId === window.userData.user.id
            );

            if (userBookings.length === 0) {
                bookingsList.innerHTML = `
                    <div class="no-bookings">
                        <h3>No Bookings Yet</h3>
                        <p>Start exploring movies and book your first show!</p>
                        <button class="btn btn-primary" onclick="window.showSection('movies')">Browse Movies</button>
                    </div>
                `;
                return;
            }

            bookingsList.innerHTML = `
                <div class="bookings-grid">
                    ${userBookings.map(booking => `
                        <div class="booking-card">
                            <div class="booking-poster">
                                <img src="${booking.moviePoster}" alt="${booking.movieTitle}">
                            </div>
                            <div class="booking-info">
                                <h3>${booking.movieTitle}</h3>
                                <p><strong>Theatre:</strong> ${booking.showtime.theatreName}</p>
                                <p><strong>Date:</strong> ${window.formatDate ? window.formatDate(booking.showtime.date) : booking.showtime.date}</p>
                                <p><strong>Time:</strong> ${booking.showtime.time}</p>
                                <p><strong>Seats:</strong> ${booking.seats.join(', ')}</p>
                                <p><strong>Total:</strong> ${window.formatIndianPrice ? window.formatIndianPrice(booking.totalPrice) : '₹' + booking.totalPrice}</p>
                            </div>
                            <div class="booking-status">
                                <span class="status-badge ${booking.status}">${booking.status.toUpperCase()}</span>
                                <button class="btn btn-sm btn-secondary" onclick="bookingManager.viewTicket('${booking.id}')">
                                    View Ticket
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } catch (error) {
            console.error('Error loading bookings:', error);
            bookingsList.innerHTML = `
                <div class="no-bookings">
                    <h3>Error Loading Bookings</h3>
                    <p>Please try refreshing the page.</p>
                </div>
            `;
        }
    }

    viewTicket(bookingId) {
        const bookings = JSON.parse(localStorage.getItem('cinemaspice_bookings') || '[]');
        const booking = bookings.find(b => b.id === bookingId);
        
        if (booking) {
            this.showBookingSuccess(booking);
            document.getElementById('booking-modal').style.display = 'block';
        }
    }

    closeBookingModal() {
        const modal = document.getElementById('booking-modal');
        if (modal) {
            modal.style.display = 'none';
        }
        
        // Reset booking state
        this.currentBooking = null;
        this.selectedSeats = [];
        this.selectedMeals = [];
        this.currentStep = 1;
    }

    showBookingRestrictionModal() {
        const modal = document.getElementById('booking-restriction-modal');
        if (modal) {
            modal.style.display = 'block';
        }
    }
}

// Initialize booking manager
const bookingManager = new BookingManager();

// Export for global use
window.bookingManager = bookingManager;
window.showBookingModal = (movie) => bookingManager.showBookingModal(movie);
window.closeBookingModal = () => bookingManager.closeBookingModal();
window.closeBookingRestrictionModal = () => {
    const modal = document.getElementById('booking-restriction-modal');
    if (modal) modal.style.display = 'none';
};