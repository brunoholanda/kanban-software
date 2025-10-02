import dayjs from 'dayjs';

/**
 * Formats a date for display in the UI
 * @param {string|Date|dayjs} date - The date to format
 * @returns {string} Formatted date string (DD/MM/YYYY)
 */
export const formatDateForDisplay = (date) => {
  if (!date) return '';
  
  try {
    return dayjs(date).format('DD/MM/YYYY');
  } catch (error) {
    console.error('Error formatting date for display:', error);
    return '';
  }
};

/**
 * Formats a date for storage in the database/localStorage
 * @param {string|Date|dayjs} date - The date to format
 * @returns {string} ISO date string for storage
 */
export const formatDateForStorage = (date) => {
  if (!date) return '';
  
  try {
    return dayjs(date).toISOString();
  } catch (error) {
    console.error('Error formatting date for storage:', error);
    return '';
  }
};

/**
 * Parses a stored date string back to a dayjs object
 * @param {string} dateString - ISO date string from storage
 * @returns {dayjs} dayjs object
 */
export const parseStoredDate = (dateString) => {
  if (!dateString) return null;
  
  try {
    return dayjs(dateString);
  } catch (error) {
    console.error('Error parsing stored date:', error);
    return null;
  }
};

/**
 * Creates a dayjs object from a stored date string (alias for parseStoredDate)
 * @param {string} dateString - ISO date string from storage
 * @returns {dayjs} dayjs object
 */
export const createDayjsFromStorage = (dateString) => {
  return parseStoredDate(dateString);
};

/**
 * Checks if a date is overdue
 * @param {string|Date|dayjs} date - The date to check
 * @returns {boolean} True if the date is overdue
 */
export const isDateOverdue = (date) => {
  if (!date) return false;
  
  try {
    return dayjs(date).isBefore(dayjs(), 'day');
  } catch (error) {
    console.error('Error checking if date is overdue:', error);
    return false;
  }
};

/**
 * Gets the number of days until a date
 * @param {string|Date|dayjs} date - The target date
 * @returns {number} Number of days until the date (negative if overdue)
 */
export const getDaysUntil = (date) => {
  if (!date) return 0;
  
  try {
    return dayjs(date).diff(dayjs(), 'day');
  } catch (error) {
    console.error('Error calculating days until date:', error);
    return 0;
  }
};
