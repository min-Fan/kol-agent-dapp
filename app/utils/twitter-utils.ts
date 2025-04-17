export const extractTweetId = (url: string): string | null => {
  // 匹配以下格式的URL:
  // https://x.com/username/status/1912742441519620530
  // https://twitter.com/username/status/1912742441519620530
  const regex = /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}; 