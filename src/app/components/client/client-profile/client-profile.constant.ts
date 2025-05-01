export const clientProfileConstant = {
  // Title
  PROFILE: "My profile",
  CURRENT_USER_LOCAL_STORAGE: 'currentUser',

  // Labels
  FIRST_NAME: "First Name",
  LAST_NAME: "Last Name",
  EMAIL_ADDRESS: "Email Address",
  PHONE_NUMBER: "Phone Number",

  // Placeholders
  PLACEHOLDER: {
    FIRST_NAME: "Enter your first name",
    LAST_NAME: "Enter your last name",
    EMAIL: "Enter your email",
    PHONE: "Enter your phone number",
  },

  // Buttons
  CANCEL: "Cancel",
  SUBMIT: "Submit",

  // VALIDATION
  patterns: {
    name: /^[a-zA-Z ]*$/,
    phone: /^[0-9]{8,}$/, 
  },
  NO_ACCESS: 'No Access',
  INVALID_FORMAT: 'Invalid Format',
  INVALID_EMAIL: 'Invalid Email',
}


export const errorMessages = {
  lastName: {
    required: 'This field is required.',
    pattern: 'The field must contain only letters.',
  },
  firstName: {
    required: 'This field is required.',
    pattern: 'The field must contain only letters.',
  },

  phone: {
    required: 'This field is required.',
    pattern: 'The phone number is invalid. Please enter a correct format.',
  },
  success: 'The information has been updated successfully.',
  error: 'Error updating information.',
  global: 'All fields must be completed before saving.',
  network: 'Connection error. Please check your internet connection and try again.',
  fetch: "Unable to retrieve user information.",
  userDataMissing: 'User data is missing.',
};

