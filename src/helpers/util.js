const ipv4Pattern = /^(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})(\.(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})){3}$/;

function checkIp(ip) {
  return ipv4Pattern.test(ip);
}

function checkZel(input) {
  try {
    return input.startsWith("1") && (input.length === 34 || input.length === 33);
  } catch {
    return false;
  }
}

export { checkIp, checkZel };
