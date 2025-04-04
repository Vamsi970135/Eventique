import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateTime(date: Date): string {
  return `${formatDate(date)} at ${formatTime(date)}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function getInitials(firstName?: string, lastName?: string): string {
  if (!firstName && !lastName) return "?";
  
  let initials = "";
  if (firstName) initials += firstName[0].toUpperCase();
  if (lastName) initials += lastName[0].toUpperCase();
  
  return initials;
}

export const serviceCategories = [
  { id: 1, name: 'Photography', icon: 'camera' },
  { id: 2, name: 'Catering', icon: 'utensils' },
  { id: 3, name: 'Venues', icon: 'landmark' },
  { id: 4, name: 'Decoration', icon: 'paint-brush' },
  { id: 5, name: 'DJ & Music', icon: 'music' },
  { id: 6, name: 'Lighting', icon: 'lightbulb' },
];

export const eventTypes = [
  { id: 1, name: 'Weddings', image: 'wedding.jpg' },
  { id: 2, name: 'Birthdays', image: 'birthday.jpg' },
  { id: 3, name: 'Corporate Events', image: 'corporate.jpg' },
  { id: 4, name: 'Social Gatherings', image: 'social.jpg' },
];

export function generateStarRating(rating: number) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < fullStars; i++) {
    stars.push({ type: 'full', id: `star-${i}` });
  }

  if (hasHalfStar) {
    stars.push({ type: 'half', id: 'half-star' });
  }

  const emptyStars = 5 - stars.length;
  for (let i = 0; i < emptyStars; i++) {
    stars.push({ type: 'empty', id: `empty-${i}` });
  }

  return stars;
}

export function getPriceRange(price: string): string {
  switch (price) {
    case "$":
      return "Budget-friendly";
    case "$$":
      return "Mid-range";
    case "$$$":
      return "Premium";
    case "$$$$":
      return "Luxury";
    default:
      return "Price on request";
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "pending":
      return "bg-amber-100 text-amber-800";
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "completed":
      return "bg-blue-100 text-blue-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getStatusText(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
