// Authentication functionality
let currentUser = null;
let isAuthMode = 'signin'; // 'signin' or 'signup'

function initAuth() {
    // Ensure userData is available
    if (typeof window.userData === 'undefined') {
        window.userData = {
            isLoggedIn: false,
            user: null,
            bookings: []
        };
    }
    
    // Check if user is already logged in (localStorage with error handling)
    try {
        const savedUser = localStorage.getItem('cinemaspice_user');
        if (savedUser && savedUser !== 'null' && savedUser !== 'undefined') {
            const parsedUser = JSON.parse(savedUser);
            if (parsedUser && parsedUser.id && parsedUser.email) {
                currentUser = parsedUser;
                window.userData.isLoggedIn = true;
                window.userData.user = currentUser;
                updateUIForLoggedInUser();
                
                // Navigate based on user age
                setTimeout(() => {
                    if (currentUser.isAdult) {
                        showSection('home');
                    } else {
                        showSection('kids-zone');
                    }
                }, 100);
                return;
            }
        }
    } catch (error) {
        console.warn('Error loading saved user:', error);
        // Clear corrupted data
        try {
            localStorage.removeItem('cinemaspice_user');
        } catch (e) {
            console.warn('Could not clear localStorage:', e);
        }
    }
    
    // Set up form submission with error handling
    const authForm = document.getElementById('auth-form');
    if (authForm) {
        authForm.addEventListener('submit', handleAuthSubmit);
    }
}

function handleAuthSubmit(e) {
    e.preventDefault();
    
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const ageField = document.getElementById('age');
    const passwordField = document.getElementById('password');
    
    if (!emailField || !passwordField) {
        showToast('Form fields not found', 'error');
        return;
    }
    
    const name = nameField ? nameField.value : '';
    const email = emailField.value;
    const age = ageField ? parseInt(ageField.value) : 0;
    const password = passwordField.value;
    
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
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    try {
        // Check if user already exists
        const existingUser = localStorage.getItem(`user_${email.toLowerCase()}`);
        if (existingUser && existingUser !== 'null') {
            showToast('User already exists. Please login instead.', 'warning');
            toggleAuthMode();
            return;
        }
        
        // Create new user
        const newUser = {
            id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9),
            name: name.trim(),
            email: email.trim().toLowerCase(),
            age: age,
            isAdult: age >= 18,
            avatar: name.charAt(0).toUpperCase(),
            watchlist: [],
            joinDate: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };
        
        // Save user data with error handling
        try {
            localStorage.setItem(`user_${email.toLowerCase()}`, JSON.stringify(newUser));
            localStorage.setItem('cinemaspice_user', JSON.stringify(newUser));
        } catch (storageError) {
            console.error('Storage error:', storageError);
            showToast('Unable to save user data. Please try again.', 'error');
            return;
        }
        
        // Update global state
        currentUser = newUser;
        window.userData.isLoggedIn = true;
        window.userData.user = newUser;
        
        // Show success message
        showToast(`Welcome to cinemaspice, ${name}!`, 'success');
        
        // Update UI
        updateUIForLoggedInUser();
        
        // Navigate based on user age with delay
        setTimeout(() => {
            if (newUser.isAdult) {
                showSection('home');
            } else {
                showSection('kids-zone');
            }
        }, 1000);
        
    } catch (error) {
        console.error('Signup error:', error);
        showToast('An error occurred during signup. Please try again.', 'error');
    }
}

function handleLogin(email, password) {
    // Validate input
    if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    try {
        // Check if user exists
        const userData = localStorage.getItem(`user_${email.trim().toLowerCase()}`);
        if (!userData || userData === 'null') {
            showToast('User not found. Please sign up first.', 'error');
            return;
        }
        
        const user = JSON.parse(userData);
        
        // Validate user data
        if (!user || !user.id || !user.email) {
            showToast('Invalid user data. Please sign up again.', 'error');
            return;
        }
        
        // For demo purposes, we'll accept any password
        // In a real app, you'd hash and compare passwords
        
        // Update last login
        user.lastLogin = new Date().toISOString();
        
        // Update global state
        currentUser = user;
        window.userData.isLoggedIn = true;
        window.userData.user = user;
        
        // Save current session and updated user data
        try {
            localStorage.setItem('cinemaspice_user', JSON.stringify(user));
            localStorage.setItem(`user_${email.toLowerCase()}`, JSON.stringify(user));
        } catch (storageError) {
            console.warn('Could not update user data:', storageError);
        }
        
        // Show success message
        showToast(`Welcome back, ${user.name}!`, 'success');
        
        // Update UI
        updateUIForLoggedInUser();
        
        // Navigate based on user age with delay
        setTimeout(() => {
            if (user.isAdult) {
                showSection('home');
            } else {
                showSection('kids-zone');
            }
        }, 1000);
        
    } catch (error) {
        console.error('Login error:', error);
        showToast('An error occurred during login. Please try again.', 'error');
    }
}

function updateUIForLoggedInUser() {
    if (!currentUser) return;
    
    try {
        // Update navigation
        const authLink = document.getElementById('auth-link');
        if (authLink) {
            authLink.innerHTML = `
                <i class="fas fa-user"></i>
                <span>${currentUser.name}</span>
            `;
            authLink.onclick = () => showUserMenu();
        }
        
        // Show/hide navigation items based on age
        const moviesNav = document.getElementById('movies-nav');
        const kidsZoneNav = document.getElementById('kids-zone-nav');
        const bookingsNav = document.getElementById('bookings-nav');
        
        if (currentUser.isAdult) {
            // Adult user - show all options
            if (moviesNav) moviesNav.style.display = 'block';
            if (kidsZoneNav) kidsZoneNav.style.display = 'block';
            if (bookingsNav) bookingsNav.style.display = 'block';
            
            // Update hero section for adults
            updateHeroForAdults();
        } else {
            // Minor user - show only kids zone and home
            if (moviesNav) moviesNav.style.display = 'none';
            if (kidsZoneNav) kidsZoneNav.style.display = 'block';
            if (bookingsNav) bookingsNav.style.display = 'none';
            
            // Update hero section for kids
            updateHeroForKids();
        }
    } catch (error) {
        console.error('Error updating UI:', error);
    }
}

function updateHeroForAdults() {
    try {
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
    } catch (error) {
        console.error('Error updating hero for adults:', error);
    }
}

function updateHeroForKids() {
    try {
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
    } catch (error) {
        console.error('Error updating hero for kids:', error);
    }
}

function showUserMenu() {
    // Remove existing menu
    const existingMenu = document.querySelector('.user-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
    
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
    try {
        // Clear user data
        localStorage.removeItem('cinemaspice_user');
        currentUser = null;
        window.userData.isLoggedIn = false;
        window.userData.user = null;
        
        // Reset navigation
        const authLink = document.getElementById('auth-link');
        if (authLink) {
            authLink.innerHTML = `
                <i class="fas fa-user"></i>
                <span>Login</span>
            `;
            authLink.onclick = () => showSection('auth');
        }
        
        // Hide all nav items except home and login
        const moviesNav = document.getElementById('movies-nav');
        const kidsZoneNav = document.getElementById('kids-zone-nav');
        const bookingsNav = document.getElementById('bookings-nav');
        
        if (moviesNav) moviesNav.style.display = 'none';
        if (kidsZoneNav) kidsZoneNav.style.display = 'none';
        if (bookingsNav) bookingsNav.style.display = 'none';
        
        // Remove user menu
        const userMenu = document.querySelector('.user-menu');
        if (userMenu) userMenu.remove();
        
        // Show success message
        showToast('Logged out successfully', 'success');
        
        // Navigate to auth
        showSection('auth');
        
    } catch (error) {
        console.error('Logout error:', error);
        showToast('Error during logout', 'error');
    }
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
    
    if (!authTitle || !authBtn || !welcomeTitle || !welcomeText || !toggleBtn) {
        console.error('Auth form elements not found');
        return;
    }
    
    if (isAuthMode === 'signin') {
        // Switch to signup mode
        isAuthMode = 'signup';
        authTitle.textContent = 'Create Account';
        authBtn.textContent = 'SIGN UP';
        welcomeTitle.textContent = 'Welcome Back!';
        welcomeText.textContent = 'To keep connected with us please login with your personal info';
        toggleBtn.textContent = 'SIGN IN';
        if (nameGroup) nameGroup.style.display = 'block';
        if (ageGroup) ageGroup.style.display = 'block';
        if (nameField) nameField.required = true;
        if (ageField) ageField.required = true;
    } else {
        // Switch to signin mode
        isAuthMode = 'signin';
        authTitle.textContent = 'Sign in';
        authBtn.textContent = 'SIGN IN';
        welcomeTitle.textContent = 'Hello, Friend!';
        welcomeText.textContent = 'Register and book your tickets now!!';
        toggleBtn.textContent = 'SIGN UP';
        if (nameGroup) nameGroup.style.display = 'none';
        if (ageGroup) ageGroup.style.display = 'none';
        if (nameField) nameField.required = false;
        if (ageField) ageField.required = false;
    }
    
    // Clear form
    const authForm = document.getElementById('auth-form');
    if (authForm) {
        authForm.reset();
    }
}

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure all scripts are loaded
    setTimeout(initAuth, 100);
});

// Also initialize when window loads (fallback)
window.addEventListener('load', () => {
    if (!currentUser && !window.userData?.isLoggedIn) {
        initAuth();
    }
});

// Export functions for global use
window.toggleAuthMode = toggleAuthMode;
window.logout = logout;
window.currentUser = () => currentUser;
window.initAuth = initAuth;