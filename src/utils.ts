export const getFullDate = (date: Date) => {
  const result = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);

  return result.replace(/(\w+)\s(\d+),\s(\d+)/gi, '$2 $1 $3');;
};
