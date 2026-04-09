/*
Purpose
- Implements lightweight, local-only engagement tracking and notifications.
- Helps sellers see views/inquiries and buyers manage profile and alerts.

How It Works
- Stores events, buyer profiles, and notifications in localStorage.
- Provides helpers to record events and compute simple analytics per listing.
- Exposes utilities to mark notifications read and count unread.
- Includes small helpers to resolve user/owner IDs from data objects.

Where It Fits
- Used by PropertyDetail, BuyerDashboard, SellerDashboard and related features.
*/
const ENGAGEMENT_EVENTS_KEY = 'kwathu:engagementEvents';

const getUserId = (user) => {
  if (!user) return null;
  return user._id || user.id || user.email || null;
};

const getOwnerIdFromProperty = (property) => {
  if (!property) return null;
  return (
    property.ownerId ||
    property.sellerId ||
    property.userId ||
    property.createdBy ||
    property.owner?._id ||
    property.owner?.id ||
    null
  );
};

const getPropertyId = (property) => property?._id || property?.id || null;

const readJson = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
};

const emitChange = () => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event('kwathu:data-updated'));
};

export const getEngagementEvents = () => readJson(ENGAGEMENT_EVENTS_KEY, []);

export const recordEngagementEvent = ({ type, property, buyer }) => {
  const propertyId = getPropertyId(property);
  if (!propertyId) return null;

  const buyerId = getUserId(buyer);
  const event = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type,
    propertyId,
    propertyTitle: property.title || 'Listing',
    propertyLocation: property.location || '',
    ownerId: getOwnerIdFromProperty(property),
    ownerName: property.ownerName || property.owner?.name || 'Owner',
    buyerId,
    buyerName: buyer?.name || 'Guest',
    buyerEmail: buyer?.email || '',
    buyerPhone: buyer?.phone || '',
    createdAt: new Date().toISOString(),
  };

  const prev = getEngagementEvents();
  writeJson(ENGAGEMENT_EVENTS_KEY, [...prev, event]);
  emitChange();
  return event;
};

export const getSellerActivity = (listings = []) => {
  const listingIds = new Set(
    listings.map((item) => item?._id || item?.id).filter(Boolean)
  );
  const events = getEngagementEvents().filter((event) => listingIds.has(event.propertyId));
  const viewEvents = events.filter((event) => event.type === 'view');
  const inquiryEvents = events.filter((event) => event.type === 'inquiry');

  const byListing = listings.map((listing) => {
    const id = listing?._id || listing?.id;
    const listingViews = viewEvents.filter((event) => event.propertyId === id);
    const listingInquiries = inquiryEvents.filter((event) => event.propertyId === id);
    return {
      listingId: id,
      title: listing.title || 'Listing',
      views: listingViews.length,
      inquiries: listingInquiries.length,
    };
  });

  return {
    totalViews: viewEvents.length,
    activeInquiries: inquiryEvents.length,
    viewEvents,
    inquiryEvents,
    byListing,
  };
};

const buyerProfileKey = (userId) => `kwathu:buyerProfile:${userId}`;
const notificationsKey = (userId) => `kwathu:notifications:${userId}`;

export const getBuyerProfile = (user) => {
  const userId = getUserId(user);
  if (!userId) return { phone: '' };
  return readJson(buyerProfileKey(userId), { phone: '' });
};

export const saveBuyerProfile = (user, profile) => {
  const userId = getUserId(user);
  if (!userId) return;
  writeJson(buyerProfileKey(userId), profile);
  emitChange();
};

export const getNotifications = (user) => {
  const userId = getUserId(user);
  if (!userId) return [];
  return readJson(notificationsKey(userId), []);
};

export const addNotification = (targetUser, notification) => {
  const targetUserId = typeof targetUser === 'string' ? targetUser : getUserId(targetUser);
  if (!targetUserId) return;
  const next = [
    {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      read: false,
      createdAt: new Date().toISOString(),
      ...notification,
    },
    ...readJson(notificationsKey(targetUserId), []),
  ];
  writeJson(notificationsKey(targetUserId), next);
  emitChange();
};

export const markAllNotificationsRead = (user) => {
  const userId = getUserId(user);
  if (!userId) return;
  const next = getNotifications(user).map((item) => ({ ...item, read: true }));
  writeJson(notificationsKey(userId), next);
  emitChange();
};

export const getUnreadNotificationsCount = (user) =>
  getNotifications(user).filter((item) => !item.read).length;

export const withBuyerPhone = (user) => {
  if (!user) return user;
  const profile = getBuyerProfile(user);
  if (!profile?.phone) return user;
  return { ...user, phone: profile.phone };
};

export const formatDateTime = (isoDate) => {
  if (!isoDate) return 'Unknown time';
  const date = new Date(isoDate);
  return date.toLocaleString();
};

export const getUserIdValue = getUserId;
export const getOwnerIdValue = getOwnerIdFromProperty;
