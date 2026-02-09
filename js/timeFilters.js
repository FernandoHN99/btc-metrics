const MS = {
  hour: 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000
};

export function filterByRange(data, range) {
  const now = new Date(data[data.length - 1].date);
  let from;

  switch (range) {
    case '1D':
      from = new Date(now - MS.day);
      return aggregate(filter(data, from), 'hour');

    case '7D':
      from = new Date(now - MS.day * 7);
      return aggregate(filter(data, from), 'hour');

    case '1M':
      from = new Date(now.setMonth(now.getMonth() - 1));
      return aggregate(filter(data, from), 'day');

    case '6M':
      from = new Date(now.setMonth(now.getMonth() - 6));
      return aggregate(filter(data, from), 'week');

    case 'YTD':
      from = new Date(now.getFullYear(), 0, 1);
      return aggregate(filter(data, from), 'week');

    case '1Y':
      from = new Date(now.setFullYear(now.getFullYear() - 1));
      return aggregate(filter(data, from), 'week');

    case '3Y':
      from = new Date(now.setFullYear(now.getFullYear() - 3));
      return aggregate(filter(data, from), 'month');

    case '5Y':
      from = new Date(now.setFullYear(now.getFullYear() - 5));
      return aggregate(filter(data, from), 'month');

    default:
      return data;
  }
}

function filter(data, from) {
  return data.filter(d => new Date(d.date) >= from);
}

function aggregate(data, unit) {
  const map = new Map();

  data.forEach(d => {
    const date = new Date(d.date);
    let key;

    if (unit === 'hour') {
      key = date.toISOString().slice(0, 13);
    } else if (unit === 'day') {
      key = date.toISOString().slice(0, 10);
    } else if (unit === 'week') {
      const firstDay = new Date(date.setDate(date.getDate() - date.getDay()));
      key = firstDay.toISOString().slice(0, 10);
    } else {
      key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    }

    map.set(key, d); // mantém o último ponto do período
  });

  return Array.from(map.values());
}
