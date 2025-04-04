const functions = require('firebase-functions');
const admin = require('firebase-admin');
const notificationFunctions = require('./src/notification-functions');

// Initialize Firebase admin
admin.initializeApp();

// Export notification functions
exports.onBookingStatusChange = notificationFunctions.onBookingStatusChange;