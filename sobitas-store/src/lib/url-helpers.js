/**
 * Updates URL search parameters while preserving existing ones
 * @param currentParams Current URLSearchParams or string
 * @param updates Object with parameter updates {key: value}
 * @returns New URLSearchParams object
 */
export function updateSearchParams(currentParams, updates) {
  const params = new URLSearchParams(
    typeof currentParams === "string" ? currentParams : currentParams.toString()
  );

  // Apply updates
  Object.entries(updates).forEach(([key, value]) => {
    // Remove parameter if value is null
    if (value === null) {
      params.delete(key);
      return;
    }

    // Handle array values
    if (Array.isArray(value)) {
      if (value.length === 0) {
        params.delete(key);
      } else {
        params.set(key, value.join(","));
      }
      return;
    }

    // Handle string values
    params.set(key, value);
  });

  return params;
}

/**
 * Creates a URL with updated search parameters
 * @param baseUrl Base URL path
 * @param currentParams Current URLSearchParams or string
 * @param updates Object with parameter updates
 * @returns Full URL string
 */
export function createUrlWithParams(baseUrl, currentParams, updates) {
  const params = updateSearchParams(currentParams, updates);
  const queryString = params.toString();

  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}
