// Fonction pour calculer la date d'échéance
const calculateDueDate = (items) => {
  const today = new Date();
  const dueDate = new Date(today);

  // Vérifiez si un des items est de type "12weeks"
  if (items.some((item) => item.service?.type === "12weeks")) {
    // Calculer le mois suivant
    const nextMonth = today.getMonth() + 1;
    const year = today.getFullYear();

    // Si nous sommes en décembre, passer à janvier de l'année suivante
    if (nextMonth > 11) {
      dueDate.setMonth(0); // Janvier
      dueDate.setFullYear(year + 1);
    } else {
      dueDate.setMonth(nextMonth);
    }

    dueDate.setDate(3);
  } else if (items.some((item) => item.service?.type === "unit" || item.service?.type === "pack")) {
    // Date d'échéance le jour même pour les offres de type "unit" ou "pack"
    dueDate.setDate(today.getDate());
  }

  return dueDate.toLocaleDateString("fr-FR"); // Format JJ/MM/AAAA
};
