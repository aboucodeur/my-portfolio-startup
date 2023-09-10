/** */
export const getFormattedDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("fr-FR",)
    : "";
