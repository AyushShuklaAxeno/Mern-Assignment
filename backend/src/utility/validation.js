export const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPhoneNumber = (phoneNumber) => {
    return /^\+?[0-9]{7,15}$/.test(phoneNumber)

};

