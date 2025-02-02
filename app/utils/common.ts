import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";

export const getInitials = (firstName: string, lastName: string): string => {
  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "U";
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
  return `${firstInitial}${lastInitial}`;
};

export const checkIsArray = (arr: any[] | undefined): boolean => {
  return (arr && Array.isArray(arr) && arr.length > 0);
};

export const getFileNameFromUrl = (url: string | undefined): string => {
  if (url) {
    const parsedUrl = url.split('/');
    return parsedUrl[parsedUrl.length - 1];
  } else {
    return null;
  }
};

export const formatTimeAgo = (dateString: string | undefined) => {
  if (dateString) {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: enUS });
  } else {
    return null;
  }
};