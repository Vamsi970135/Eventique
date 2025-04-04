const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Function triggered when a booking status changes
exports.onBookingStatusChange = functions.firestore
  .document('bookings/{bookingId}')
  .onUpdate(async (change, context) => {
    const bookingId = context.params.bookingId;
    const newValue = change.after.data();
    const previousValue = change.before.data();

    // Check if status has changed
    if (newValue.status === previousValue.status) {
      console.log('Booking status unchanged, skipping notification');
      return null;
    }

    console.log(`Booking ${bookingId} status changed from ${previousValue.status} to ${newValue.status}`);

    // Get customer and provider data
    try {
      const customerSnapshot = await admin.firestore().collection('users').doc(newValue.customerId).get();
      const providerSnapshot = await admin.firestore().collection('users').doc(newValue.providerId).get();
      
      if (!customerSnapshot.exists || !providerSnapshot.exists) {
        console.error('Customer or provider document does not exist');
        return null;
      }

      const customer = customerSnapshot.data();
      const provider = providerSnapshot.data();

      // Get service details
      const serviceSnapshot = await admin.firestore().collection('services').doc(newValue.serviceId).get();
      
      if (!serviceSnapshot.exists) {
        console.error('Service document does not exist');
        return null;
      }

      const service = serviceSnapshot.data();

      // Send appropriate notifications based on the new status
      switch (newValue.status) {
        case 'pending':
          // New booking notification to provider
          await sendNotificationToUser(
            newValue.providerId,
            'New Booking Request',
            `You have a new booking request for ${service.name} on ${formatDate(newValue.eventDate)}`,
            {
              type: 'booking',
              bookingStatus: 'pending',
              bookingId: bookingId,
              actionLink: '/booking-detail',
              customerId: newValue.customerId,
              customerName: customer.firstName ? `${customer.firstName} ${customer.lastName}` : customer.username,
            }
          );
          break;
          
        case 'confirmed':
          // Confirmation to customer
          await sendNotificationToUser(
            newValue.customerId,
            'Booking Confirmed',
            `Your booking for ${service.name} on ${formatDate(newValue.eventDate)} has been confirmed by ${provider.businessName || provider.username}`,
            {
              type: 'booking',
              bookingStatus: 'confirmed',
              bookingId: bookingId,
              actionLink: '/booking-detail',
              providerId: newValue.providerId,
              providerName: provider.businessName || provider.username,
            }
          );
          break;
          
        case 'rejected':
          // Rejection to customer
          await sendNotificationToUser(
            newValue.customerId,
            'Booking Rejected',
            `Your booking request for ${service.name} on ${formatDate(newValue.eventDate)} has been declined`,
            {
              type: 'booking',
              bookingStatus: 'rejected',
              bookingId: bookingId,
              actionLink: '/booking-detail',
            }
          );
          break;
          
        case 'cancelled_by_customer':
          // Cancellation notification to provider
          await sendNotificationToUser(
            newValue.providerId,
            'Booking Cancelled',
            `A booking for ${service.name} on ${formatDate(newValue.eventDate)} has been cancelled by the customer`,
            {
              type: 'booking',
              bookingStatus: 'cancelled',
              bookingId: bookingId,
              actionLink: '/booking-detail',
              customerId: newValue.customerId,
              customerName: customer.firstName ? `${customer.firstName} ${customer.lastName}` : customer.username,
            }
          );
          break;
          
        case 'cancelled_by_provider':
          // Cancellation notification to customer
          await sendNotificationToUser(
            newValue.customerId,
            'Booking Cancelled',
            `Your booking for ${service.name} on ${formatDate(newValue.eventDate)} has been cancelled by the provider`,
            {
              type: 'booking',
              bookingStatus: 'cancelled',
              bookingId: bookingId,
              actionLink: '/booking-detail',
              providerId: newValue.providerId,
              providerName: provider.businessName || provider.username,
            }
          );
          break;
          
        case 'pending_payment':
          // Payment reminder to customer
          await sendNotificationToUser(
            newValue.customerId,
            'Payment Required',
            `Please complete payment for your booking of ${service.name} on ${formatDate(newValue.eventDate)}`,
            {
              type: 'payment',
              bookingStatus: 'pending_payment',
              bookingId: bookingId,
              actionLink: '/payment',
              providerId: newValue.providerId,
              providerName: provider.businessName || provider.username,
            }
          );
          break;
          
        case 'payment_completed':
          // Payment confirmation to customer
          await sendNotificationToUser(
            newValue.customerId,
            'Payment Successful',
            `Your payment for ${service.name} on ${formatDate(newValue.eventDate)} has been received`,
            {
              type: 'payment',
              bookingStatus: 'payment_completed',
              bookingId: bookingId,
              actionLink: '/booking-detail',
            }
          );
          
          // Payment notification to provider
          await sendNotificationToUser(
            newValue.providerId,
            'Payment Received',
            `Payment has been received for the booking of ${service.name} on ${formatDate(newValue.eventDate)}`,
            {
              type: 'payment',
              bookingStatus: 'payment_completed',
              bookingId: bookingId,
              actionLink: '/booking-detail',
            }
          );
          break;
          
        case 'completed':
          // Service completion notification to customer
          await sendNotificationToUser(
            newValue.customerId,
            'Booking Completed',
            `Your booking for ${service.name} has been marked as completed`,
            {
              type: 'booking',
              bookingStatus: 'completed',
              bookingId: bookingId,
              actionLink: '/leave-review',
              providerId: newValue.providerId,
              providerName: provider.businessName || provider.username,
            }
          );
          break;
      }

      console.log(`Notifications sent for booking ${bookingId} status change to ${newValue.status}`);
      return null;
    } catch (error) {
      console.error('Error sending booking status change notification:', error);
      return null;
    }
  });

// Helper function to send a notification to a user
async function sendNotificationToUser(userId, title, body, data) {
  try {
    // Save notification to Firestore
    await admin.firestore().collection('notifications').add({
      userId,
      title,
      body,
      type: data.type || 'booking',
      isRead: false,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      actionLink: data.actionLink,
      bookingId: data.bookingId,
      data: data,
    });

    // Get user's FCM tokens
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      console.log(`User ${userId} not found, notification saved to Firestore only`);
      return;
    }
    
    const userData = userDoc.data();
    const fcmTokens = userData.fcmTokens || [];
    
    if (fcmTokens.length === 0) {
      console.log(`User ${userId} has no FCM tokens, notification saved to Firestore only`);
      return;
    }

    // Send FCM message to each token
    const fcmMessage = {
      notification: {
        title,
        body,
      },
      data: {
        ...data,
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
      },
    };

    // Send to each token and collect results
    const sendResults = await Promise.all(
      fcmTokens.map(async (token) => {
        try {
          const result = await admin.messaging().sendToDevice(token, fcmMessage);
          return { token, result };
        } catch (error) {
          console.error(`Error sending to token ${token}:`, error);
          return { token, error };
        }
      })
    );

    // Clean up bad tokens
    const invalidTokens = [];
    
    sendResults.forEach(({ token, result, error }) => {
      if (error) {
        // Add to invalid tokens if it's a token-related error
        if (error.code === 'messaging/invalid-registration-token' || 
            error.code === 'messaging/registration-token-not-registered') {
          invalidTokens.push(token);
        }
      } else if (result && result.failureCount > 0) {
        // Check for token-related errors
        result.results.forEach((msgResult, idx) => {
          if (msgResult.error) {
            console.error('Messaging error:', msgResult.error);
            if (msgResult.error.code === 'messaging/invalid-registration-token' || 
                msgResult.error.code === 'messaging/registration-token-not-registered') {
              invalidTokens.push(token);
            }
          }
        });
      }
    });

    // Remove invalid tokens from user document
    if (invalidTokens.length > 0) {
      await admin.firestore().collection('users').doc(userId).update({
        fcmTokens: admin.firestore.FieldValue.arrayRemove(...invalidTokens),
      });
      console.log(`Removed ${invalidTokens.length} invalid FCM tokens for user ${userId}`);
    }

    console.log(`Notification sent to user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error in sendNotificationToUser:', error);
    return false;
  }
}

// Helper function to format date for messages
function formatDate(timestamp) {
  if (!timestamp) return 'unknown date';
  
  let date;
  if (timestamp instanceof admin.firestore.Timestamp) {
    date = timestamp.toDate();
  } else if (timestamp._seconds) { // Firestore timestamp object
    date = new Date(timestamp._seconds * 1000);
  } else if (timestamp.seconds) { // Firestore timestamp object
    date = new Date(timestamp.seconds * 1000);
  } else { // Assuming it's a Date or a number
    date = new Date(timestamp);
  }
  
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  });
}