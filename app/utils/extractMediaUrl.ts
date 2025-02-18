export const extractMediaUrl = (media: any): string | null => {
  if (typeof media === "string") {
    return media;
  }

  if (media !== null && typeof media === "object") {
    if ("url" in media && typeof media.url === "string") {
      return media.url;
    }

    for (const key in media) {
      /** We check only the object's own properties, not the inherited ones */
      if (Object.prototype.hasOwnProperty.call(media, key) && typeof media[key] === "object") {
        const result = extractMediaUrl(media[key]);
        if (result) {
          return result;
        }
      }
    }
  }

  return null;
};