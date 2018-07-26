export const toISODateString = (date: Date) =>
  `${date.toISOString().split('.')[0]}Z`;

export const formatDate = (ISODate: string) => ISODate.split('T')[0];
