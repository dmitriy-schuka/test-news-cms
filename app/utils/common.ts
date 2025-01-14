export const getInitials = (firstName: string, lastName: string): string => {
  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "U";
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
  return `${firstInitial}${lastInitial}`;
};
