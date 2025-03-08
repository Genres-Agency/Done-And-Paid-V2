export const statuses = [
  {
    value: "PUBLISHED",
    label: "Published",
    iconName: "eye",
  },
  {
    value: "PRIVATE",
    label: "Private",
    iconName: "eyeOff",
  },
];

export const getCategoryOptions = (categories: any[]) => {
  return categories
    .filter((category) => category.status === "PUBLISHED")
    .map((category) => ({
      label: category.name,
      value: category.name,
    }));
};
