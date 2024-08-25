export function useLocalDateFormat(date: string, locale: "en-EN"): string {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  return new Date(Date.parse(date)).toLocaleDateString(locale, options);
}
