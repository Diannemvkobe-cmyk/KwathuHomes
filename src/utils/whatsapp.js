/**
 * Generates a WhatsApp messaging URL with a pre-filled message about a property
 * @param {string} phoneNumber - Owner's phone number (with or without +)
 * @param {object} property - Property object with title, price, type, location
 * @returns {string} - WhatsApp URL that opens a pre-filled message
 */
export const generateWhatsappUrl = (phoneNumber, property) => {
  // Ensure phone number starts with country code (+)
  let cleanPhone = phoneNumber?.trim().replace(/\D/g, '');
  if (!cleanPhone) return null;
  
  // If it doesn't start with country code, assume it needs one
  // You might need to adjust this based on your region
  if (!phoneNumber.includes('+')) {
    cleanPhone = cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone;
  }
  
  // Build the property details message
  const propertyDetails = `${property.title} - ${property.type}`;
  const priceLine = property.price ? `Price: ${property.price}` : '';
  const locationLine = property.location ? `Location: ${property.location}` : '';
  
  // Create the message
  const message = `Hi! I'm interested in your property: ${propertyDetails}. ${priceLine} ${locationLine}. Is it still available?`;
  
  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message);
  
  // Generate WhatsApp URL
  // Format: https://wa.me/[phone_number]?text=[message]
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  
  return whatsappUrl;
};

/**
 * Opens WhatsApp with the property inquiry message
 * @param {string} phoneNumber - Owner's phone number
 * @param {object} property - Property object
 */
export const contactOwnerViaWhatsapp = (phoneNumber, property) => {
  const url = generateWhatsappUrl(phoneNumber, property);
  if (!url) {
    console.error('Invalid phone number provided');
    return false;
  }
  
  window.open(url, '_blank');
  return true;
};
