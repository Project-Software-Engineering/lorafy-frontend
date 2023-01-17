/**
 * Gets the time for the given datetime in HH:MM format.
 * @param datetime
 * @returns {string}
 */
export function getHHMM(datetime) {
  return `${datetime.getHours().toString().padStart(2, '0')}:${datetime
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
}

/**
 * Gets the data options for 1 day.
 * @returns {{count: number, from: number, to: number, labels: *[]}}
 */
export function getDataOptionsForDay() {
  const date = new Date();
  date.setMinutes(0, 0, 0);
  date.setHours(date.getHours() + 1);

  const count = 24;
  const to = Math.floor(date.getTime() / 1000);
  const from = to - 3600 * count;

  const labels = [];
  for (let i = 0; i < 24; i++) {
    const date = new Date(from * 1000 + 3600 * 1000 * i);
    labels.push(getHHMM(date));
  }

  return {
    from,
    to,
    count,
    labels,
  };
}

/**
 * Gets the data options for 1 week.
 * @returns {{count: number, from: number, to: number, labels: *[]}}
 */
export function getDataOptionsForWeek() {
  const date = new Date();
  date.setHours(23, 59, 59, 59); // Set to end of day

  const count = 7;
  const to = Math.floor(date.getTime() / 1000);
  const from = to - 3600 * 24 * count;

  const labels = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(to * 1000 - 3600 * 24 * 1000 * i);
    labels.push(date.toLocaleDateString());
  }

  return {
    from,
    to,
    count,
    labels,
  };
}

/**
 * Gets the data options for 1 month.
 * @returns {{count: number, from: number, to: number, labels: *[]}}
 */
export function getDataOptionsForMonth() {
  const date = new Date();
  date.setHours(23, 59, 59, 59); // Set to end of day

  const count = 30;
  const to = Math.floor(date.getTime() / 1000);
  const from = to - 3600 * 24 * count;

  const labels = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(to * 1000 - 3600 * 24 * 1000 * i);
    labels.push(date.toLocaleDateString());
  }

  return {
    from,
    to,
    count,
    labels,
  };
}

/**
 * Gets the data options for 1 year.
 * @returns {{count: number, from: number, to: number, labels: *[]}}
 */
export function getDataOptionsForYear() {
  const date = new Date();
  date.setHours(23, 59, 59, 59); // Set to end of day

  const count = 12;
  const to = Math.floor(date.getTime() / 1000);
  const from = to - 3600 * 24 * 365;

  const labels = [];
  for (let i = 0; i < 12; i++) {
    labels.push(date.toLocaleString('default', { month: 'long' }));
    date.setMonth(date.getMonth() - 1);
  }
  labels.reverse();

  return {
    from,
    to,
    count,
    labels,
  };
}

/**
 * Gets the data options for a custom date range.
 * The data options will have 1 datapoint per day.
 * @param dateRange
 * @returns {{count: number, from: *, to: *, labels: *[]}}
 */
export function getDataOptionsForCustomRange(dateRange) {
  const dayCount = dateRange[1].diff(dateRange[0], 'day') + 1;
  const labels = [];
  for (let i = 0; i < dayCount; i++) {
    const date = new Date(dateRange[0].add(i, 'day').unix() * 1000);
    labels.push(date.toLocaleDateString());
  }

  const dataOptions = {
    from: dateRange[0].unix(),
    to: dateRange[1].unix() + 3600 * 24,
    count: dayCount,
    labels,
  };
  return dataOptions;
}
