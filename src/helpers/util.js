/* eslint no-unused-vars: off */

const ipv4Pattern = /^(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})(\.(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})){3}$/;

function checkIp(ip) {
  return ipv4Pattern.test(ip);
}

function checkZel(input) {
  try {
    return input.startsWith("1") && (input.length === 34 || input.length === 33);
  } catch (error) {
    return false;
  }
}

function parseIP(ipAddressWithPort) {
  try {
    const parts = ipAddressWithPort.split(":");
    return parts[0];
  } catch (error) {
    return "N/A";
  }
}

function parsePort(ip) {
  try {
    const parts = ip.split(":");
    return parts[1];
  } catch (error) {
    return "n/a";
  }
}

export { checkIp, checkZel, parseIP, parsePort };
