
/**
 * 将金额转换为 BigInt
 * @param amount - 金额，可以是字符串或数字
 * @param decimals - 小数位数
 * @returns 转换后的 BigInt
 */
export const convertAmountToBigInt = (
  amount: string | number,
  decimals: number
): bigint => {
  // 转为字符串确保处理一致性
  const amountStr = amount.toString();

  // 检查是否包含小数点
  if (amountStr.includes(".")) {
    const [wholePart, decimalPart] = amountStr.split(".");
    // 补齐或截断小数位数
    const paddedDecimalPart = decimalPart
      .padEnd(decimals, "0")
      .slice(0, decimals);
    // 组合整数部分和小数部分
    const fullAmountStr = wholePart + paddedDecimalPart;
    return BigInt(fullAmountStr);
  } else {
    // 如果是整数，直接乘以精度
    return BigInt(amountStr) * BigInt(10 ** decimals);
  }
};
