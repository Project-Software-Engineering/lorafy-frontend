import dayjs from 'dayjs';

export function saveStorageItem(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getStorageItem(key) {
  const data = localStorage.getItem(key);
  return JSON.parse(data);
}

/**
 * Gets the date range from the local storage. Converts the unix timestamp to dayjs format.
 * @returns {dayjs.Dayjs[]|undefined}
 */
export function getDateRangeFromStorage() {
  const dateRange = getStorageItem('dateRange');
  if (dateRange) {
    return dateRange.map((d) => dayjs.unix(d));
  }
  return undefined;
}

/**
 * Saves the date range to local storage in unix timestamp format.
 * @param dateRange
 */
export function saveDateRangeToStorage(dateRange) {
  if (dateRange.length === 2 && dateRange[0] && dateRange[1]) {
    saveStorageItem(
      'dateRange',
      dateRange.map((d) => d.unix()),
    );
  }
}
