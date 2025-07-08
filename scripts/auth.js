// Authentication functionality
let currentUser = null;
let isAuthMode = 'signin'; // 'signin' or 'signup'

function initAuth() {
    // Check if user is already logged in (localStorage)
    const savedUser = localStorage.getItem('cinemaspice_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        userData.isLoggedIn = true;
        userData.user = currentUser;
        updateUIForLoggedInUser();
        
        // Navigate based on user age
        if (currentUser.isAdult) {
            showSection('home');
        } else {
            showSection('kids-zone');
        }
    }
    
    // Set up form submission
    document.getElementById('auth-form').addEventListener('submit', handleAuthSubmit);
}

function handleAuthSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const age = parseInt(document.getElementById('age').value);
    const password = document.getElementById('password').value;
    
    if (isAuthMode === 'signup') {
        handleSignup(name, email, age, password);
    } else {
        handleLogin(email, password);
    }
}

function handleSignup(name, email, age, password) {
    // Validate input
    if (!name || !email || !age || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    if (age < 1 || age > 120) {
        showToast('Please enter a valid age', 'error');
        return;
    }
    
    // Check if user already exists
    const existingUser = localStorage.getItem(`user_${email}`);
    if (existingUser) {
        showToast('User already exists. Please login instead.', 'warning');
        toggleAuthMode();
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        age: age,
        isAdult: age >= 18,
        avatar: name.charAt(0).toUpperCase(),
        watchlist: [],
        joinDate: new Date().toISOString()
    };
    
    // Save user data
    localStorage.setItem(`user_${email}`, JSON.stringify(newUser));
    localStorage.setItem('cinemaspice_user', JSON.stringify(newUser));
    
    // Update global state
    currentUser = newUser;
    userData.isLoggedIn = true;
    userData.user = newUser;
    
    // Show success message
    showToast(`Welcome to CinemaSpice, ${name}!`, 'success');
    
    // Update UI
    updateUIForLoggedInUser();
    
    // Navigate based on user age
    if (newUser.isAdult) {
        showSection('home');
    } else {
        showSection('kids-zone');
    }
}

function handleLogin(email, password) {
    // Validate input
    if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    // Check if user exists
    const userData = localStorage.getItem(`user_${email.trim().toLowerCase()}`);
    if (!userData) {
        showToast('User not found. Please sign up first.', 'error');
        return;
    }
    
    const user = JSON.parse(userData);
    
    // For demo purposes, we'll accept any password
    // In a real app, you'd hash and compare passwords
    
    // Update global state
    currentUser = user;
    window.userData.isLoggedIn = true;
    window.userData.user = user;
    
    // Save current session
    localStorage.setItem('cinemaspice_user', JSON.stringify(user));
    
    // Show success message
    showToast(`Welcome back, ${user.name}!`, 'success');
    
    // Update UI
    updateUIForLoggedInUser();
    
    // Navigate based on user age
    if (user.isAdult) {
        showSection('home');
    } else {
        showSection('kids-zone');
    }
}

function updateUIForLoggedInUser() {
    if (!currentUser) return;
    
    // Update navigation
    const authLink = document.getElementById('auth-link');
    authLink.innerHTML = `
        <i class="fas fa-user"></i>
        <span>${currentUser.name}</span>
    `;
    authLink.onclick = () => showUserMenu();
    
    // Show/hide navigation items based on age
    const moviesNav = document.getElementById('movies-nav');
    const kidsZoneNav = document.getElementById('kids-zone-nav');
    const bookingsNav = document.getElementById('bookings-nav');
    
    if (currentUser.isAdult) {
        // Adult user - show all options
        moviesNav.style.display = 'block';
        kidsZoneNav.style.display = 'block';
        bookingsNav.style.display = 'block';
        
        // Update hero section for adults
        updateHeroForAdults();
    } else {
        // Minor user - show only kids zone and home
        moviesNav.style.display = 'none';
        kidsZoneNav.style.display = 'block';
        bookingsNav.style.display = 'none';
        
        // Update hero section for kids
        updateHeroForKids();
    }
    
    // DO NOT add age verification badge to screen
    // Badge removed to keep interface clean
}

function updateHeroForAdults() {
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    const heroButtons = document.getElementById('hero-buttons');
    
    if (heroTitle) heroTitle.textContent = `Welcome back, ${currentUser.name}!`;
    if (heroSubtitle) heroSubtitle.textContent = 'Discover amazing movies and book your tickets today!';
    if (heroButtons) {
        heroButtons.innerHTML = `
            <button class="btn btn-primary" onclick="showSection('movies')">Browse Movies</button>
            <button class="btn btn-secondary" onclick="showSection('kids-zone')">Kids Zone</button>
        `;
    }
}

function updateHeroForKids() {
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    const heroButtons = document.getElementById('hero-buttons');
    
    if (heroTitle) heroTitle.textContent = `Welcome to Kids Zone, ${currentUser.name}! 🎈`;
    if (heroSubtitle) heroSubtitle.textContent = 'Explore fun and safe movies made just for you!';
    if (heroButtons) {
        heroButtons.innerHTML = `
            <button class="btn btn-primary" onclick="showSection('kids-zone')">Watch Kids Movies</button>
        `;
    }
}

function showUserMenu() {
    const menu = document.createElement('div');
    menu.className = 'user-menu';
    menu.innerHTML = `
        <div class="user-menu-content">
            <div class="user-profile">
                <div class="user-avatar">${currentUser.avatar}</div>
                <div>
                    <div class="user-name">${currentUser.name}</div>
                    <div class="user-email">${currentUser.email}</div>
                    <div class="user-age-badge ${currentUser.isAdult ? '' : 'minor'}">
                        Age: ${currentUser.age} ${currentUser.isAdult ? '(Adult)' : '(Minor)'}
                    </div>
                </div>
            </div>
            <div class="user-menu-actions">
                ${currentUser.isAdult ? '<button onclick="showSection(\'bookings\')">My Bookings</button>' : ''}
                <button onclick="logout()">Logout</button>
            </div>
        </div>
    `;
    
    // Add styles for user menu
    const style = document.createElement('style');
    style.textContent = `
        .user-menu {
            position: fixed;
            top: 70px;
            right: 20px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 15px;
            padding: 1rem;
            z-index: 1000;
            min-width: 250px;
            box-shadow: 0 10px 30px var(--shadow-color);
        }
        
        .user-profile {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--border-color);
        }
        
        .user-avatar {
            width: 40px;
            height: 40px;
            background: var(--accent-primary);
            color: #ffffff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 1.2rem;
        }
        
        .user-name {
            font-weight: 600;
            color: var(--text-primary);
        }
        
        .user-email {
            color: var(--text-muted);
            font-size: 0.9rem;
        }
        
        .user-age-badge {
            background: #22c55e;
            color: #ffffff;
            padding: 0.2rem 0.5rem;
            border-radius: 10px;
            font-size: 0.8rem;
            font-weight: 500;
            margin-top: 0.3rem;
            display: inline-block;
        }
        
        .user-age-badge.minor {
            background: #f59e0b;
        }
        
        .user-menu-actions {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .user-menu-actions button {
            padding: 0.8rem;
            background: transparent;
            color: var(--text-primary);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .user-menu-actions button:hover {
            background: var(--accent-primary);
            border-color: var(--accent-primary);
            color: #ffffff;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(menu);
    
    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target) && !document.getElementById('auth-link').contains(e.target)) {
                menu.remove();
                style.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
}

function logout() {
    // Clear user data
    localStorage.removeItem('cinemaspice_user');
    currentUser = null;
    userData.isLoggedIn = false;
    userData.user = null;
    
    // Remove any existing age verification badge (if any exists)
    const badge = document.querySelector('.age-verification-badge');
    if (badge) badge.remove();
    
    // Reset navigation
    const authLink = document.getElementById('auth-link');
    authLink.innerHTML = `
        <i class="fas fa-user"></i>
        <span>Login</span>
    `;
    authLink.onclick = () => showSection('auth');
    
    // Hide all nav items except home and login
    document.getElementById('movies-nav').style.display = 'none';
    document.getElementById('kids-zone-nav').style.display = 'none';
    document.getElementById('bookings-nav').style.display = 'none';
    
    // Remove user menu
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) userMenu.remove();
    
    // Show success message
    showToast('Logged out successfully', 'success');
    
    // Navigate to auth
    showSection('auth');
}

function toggleAuthMode() {
    const authTitle = document.getElementById('auth-title');
    const authBtn = document.getElementById('auth-submit-btn');
    const welcomeTitle = document.getElementById('welcome-title');
    const welcomeText = document.getElementById('welcome-text');
    const toggleBtn = document.getElementById('toggle-auth');
    const nameGroup = document.getElementById('name-group');
    const ageGroup = document.getElementById('age-group');
    const nameField = document.getElementById('name');
    const ageField = document.getElementById('age');
    
    if (isAuthMode === 'signin') {
        // Switch to signup mode
        isAuthMode = 'signup';
        authTitle.textContent = 'Create Account';
        authBtn.textContent = 'SIGN UP';
        welcomeTitle.textContent = 'Welcome Back!';
        welcomeText.textContent = 'To keep connected with us please login with your personal info';
        toggleBtn.textContent = 'SIGN IN';
        nameGroup.style.display = 'block';
        ageGroup.style.display = 'block';
        nameField.required = true;
        ageField.required = true;
    } else {
        // Switch to signin mode
        isAuthMode = 'signin';
        authTitle.textContent = 'Sign in';
        authBtn.textContent = 'SIGN IN';
        welcomeTitle.textContent = 'Hello, Friend!';
        welcomeText.textContent = 'Register and book your tickets now!!';
        toggleBtn.textContent = 'SIGN UP';
        nameGroup.style.display = 'none';
        ageGroup.style.display = 'none';
        nameField.required = false;
        ageField.required = false;
    }
    
    // Clear form
    document.getElementById('auth-form').reset();
}

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', initAuth);

// Export functions for global use
window.toggleAuthMode = toggleAuthMode;
window.logout = logout;
window.currentUser = currentUser;