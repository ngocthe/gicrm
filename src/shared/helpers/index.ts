/**
 * Sleep function
 *
 * @param ms
 * @returns
 */
export const sleep = async (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
