const fs = require('fs');

['messages/en.json', 'messages/de.json'].forEach(file => {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  
  if (!data['Profile']) data['Profile'] = {};
  Object.assign(data['Profile'], {
    'title': 'My Profile',
    'tabs': {
      'profile': 'Profile Info',
      'orders': 'My Orders',
      'settings': 'Settings'
    },
    'personalInfo': 'Personal Information',
    'shippingAddress': 'Shipping Address',
    'name': 'Full Name',
    'email': 'Email Address',
    'address': 'Street Address',
    'city': 'City',
    'postalCode': 'Postal Code',
    'country': 'Country',
    'phone': 'Phone Number',
    'saveChanges': 'Save Changes',
    'myOrders': 'My Recent Purchases',
    'orderId': 'Order ID',
    'date': 'Date',
    'total': 'Total',
    'status': 'Status',
    'delivered': 'Delivered',
    'processing': 'Processing',
    'dangerZone': 'Danger Zone',
    'deleteConfirm': 'Are you sure you want to delete your account? This action cannot be undone.',
    'deleteAccount': 'Delete Account',
    'noOrders': 'You have not placed any orders yet.',
    'saved': 'Profile updated successfully!',
    'deleted': 'Account deleted.'
  });

  fs.writeFileSync(file, JSON.stringify(data, null, 2));
});
console.log('Dictionaries updated successfully.');