// Authentication utilities

/**
 * Simple authentication for admin interface
 * This implementation uses direct comparison for reliability
 */

// Admin credentials
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "R@9v!zX#7Lp$Yw*3u^MfBq2&Ed0KsJ"; // Simple password for easier use

// Keys for storage
const GLOBAL_ATTEMPT_KEY = "global_login_attempts";
const GLOBAL_LOCKOUT_KEY = "global_lockout_until";
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Check if the site is in a global lockout state
 */
export const isGloballyLocked = () => {
    const lockoutUntil = localStorage.getItem(GLOBAL_LOCKOUT_KEY);

    if (!lockoutUntil) {
        return { locked: false, remainingTime: 0 };
    }

    const now = Date.now();
    const lockoutTime = parseInt(lockoutUntil, 10);

    if (now < lockoutTime) {
        // Still locked
        const remainingSeconds = Math.ceil((lockoutTime - now) / 1000);
        return {
            locked: true,
            remainingTime: remainingSeconds,
        };
    }

    // Lockout has expired
    localStorage.removeItem(GLOBAL_LOCKOUT_KEY);
    localStorage.removeItem(GLOBAL_ATTEMPT_KEY);
    return { locked: false, remainingTime: 0 };
};

/**
 * Apply a global lockout to the entire site
 */
const applyGlobalLockout = () => {
    const lockoutUntil = Date.now() + LOCKOUT_DURATION;
    localStorage.setItem(GLOBAL_LOCKOUT_KEY, lockoutUntil.toString());
};

/**
 * Verifies user credentials with a direct comparison approach
 * This is more reliable for a simple admin demo
 */
export const verifyCredentials = async (username, password) => {
    try {
        // Check if site is globally locked
        const lockStatus = isGloballyLocked();
        if (lockStatus.locked) {
            return {
                success: false,
                globalLock: true,
                remainingTime: lockStatus.remainingTime,
            };
        }

        // Simple direct comparison for username and password
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            // Reset attempts on success
            localStorage.removeItem(GLOBAL_ATTEMPT_KEY);
            return {
                success: true,
            };
        } else {
            // Increment attempt counter
            const attempts = parseInt(localStorage.getItem(GLOBAL_ATTEMPT_KEY) || "0") + 1;
            localStorage.setItem(GLOBAL_ATTEMPT_KEY, attempts.toString());

            // Check if we need to apply global lockout
            if (attempts >= MAX_ATTEMPTS) {
                applyGlobalLockout();
                return {
                    success: false,
                    globalLock: true,
                    remainingTime: LOCKOUT_DURATION / 1000,
                };
            }

            return {
                success: false,
                globalLock: false,
                attempts: attempts,
                maxAttempts: MAX_ATTEMPTS,
            };
        }
    } catch (error) {
        console.error("Authentication error:", error);
        return {
            success: false,
            error: true,
        };
    }
};

/**
 * Set authentication state
 */
export const setAuthenticated = (value) => {
    console.log("asdf");
    try {
        // Set a short expiration (12 hours)
        const expires = new Date();
        expires.setHours(expires.getHours() + 3);

        localStorage.setItem("authenticated", value ? "true" : "false");
        localStorage.setItem("auth_expires", expires.toISOString());

        // Store only minimal info, not credentials
        const timestamp = new Date().toISOString();
        const session = btoa(`session-${timestamp}`);
        localStorage.setItem("session_id", session);
    } catch (error) {
        console.error("Error setting auth state:", error);
    }
};

/**
 * Check if the user is authenticated with expiration
 */
export const isAuthenticated = () => {
    try {
        // First check if the site is globally locked
        const lockStatus = isGloballyLocked();
        if (lockStatus.locked) {
            return false;
        }

        const authenticated = localStorage.getItem("authenticated") === "true";
        const expires = localStorage.getItem("auth_expires");

        if (!authenticated || !expires) {
            return false;
        }

        // Check expiration
        const expiryDate = new Date(expires);
        const now = new Date();

        if (now > expiryDate) {
            // Expired
            localStorage.removeItem("authenticated");
            localStorage.removeItem("auth_expires");
            localStorage.removeItem("session_id");
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error checking auth state:", error);
        return false;
    }
};

/**
 * Utility to clear all login data (for debugging purposes)
 * Call this from the browser console if you're having login issues:
 * import('/src/utils/auth.js').then(auth => auth.clearLoginData())
 */
export const clearLoginData = () => {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("auth_expires");
    localStorage.removeItem("session_id");
    localStorage.removeItem(GLOBAL_ATTEMPT_KEY);
    localStorage.removeItem(GLOBAL_LOCKOUT_KEY);
    console.log("All login data cleared. You can try logging in again.");
};

/**
 * Update the admin password (for demonstration purposes)
 * This is a simple implementation that shows what would happen in a real system
 */
export const updatePassword = async (newPassword) => {
    if (!newPassword || newPassword.length < 4) {
        return {
            success: false,
            message: "비밀번호는 최소 4자 이상이어야 합니다.",
        };
    }

    console.log(`[Admin System] Password would be updated to: ${newPassword}`);
    console.log(`To actually change the password, edit src/utils/auth.js and update ADMIN_PASSWORD`);

    return {
        success: true,
        message: "비밀번호 변경 시뮬레이션 완료. 실제 변경을 위해서는 소스 코드를 수정해야 합니다.",
    };
};
