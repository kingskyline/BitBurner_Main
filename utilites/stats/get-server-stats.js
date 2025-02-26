/**
 * Monitors and displays detailed financial and security information about servers in a simulated hacking environment.
 * The script lists each server that is hackable and profitable based on the player's current hacking level and the server's
 * financial attributes. It continuously updates and prints this information at a specified interval, highlighting the money
 * available, security levels, and estimated times for hacking-related actions. Logging for specific operations is disabled to
 * reduce clutter.
 *
 * @param {NS} ns - The namespace object provided by the game, which includes functions for interacting with the game's systems.
 * @async
 */
export async function main(ns) {
  // Disable verbose logging for specific operations to make the output cleaner.
  const DISABLED_LOGS = [
    'scan', 'getServerMoneyAvailable', 'getServerMaxMoney', 'getServerRequiredHackingLevel',
    'getServerSecurityLevel', 'getServerMinSecurityLevel', 'getHackingLevel'
  ];
  DISABLED_LOGS.forEach(log => ns.disableLog(log));

  // Opens a tail window in the game to display log outputs.
  ns.tail();

  // Determine the list of servers to monitor: either all reachable servers or a specific server passed as an argument.
  let servers = (ns.args[0] == null) ? getAllServers(ns) : [ns.args[0]];

  // Sort servers by their maximum potential money in descending order.
  servers.sort((a, b) => ns.getServerMaxMoney(b) - ns.getServerMaxMoney(a));

  for (let server of servers) {
    if (server === "home") continue; // Skip the "home" server.
    // Gather financial and security details of each server.
    const MONEY = ns.getServerMoneyAvailable(server);
    const MAX_MONEY = Math.max(1, ns.getServerMaxMoney(server));
    const MONEY_PERCENT = ns.formatPercent(MONEY / MAX_MONEY);
    const HACK_LEVEL = ns.getServerRequiredHackingLevel(server);
    const SECURITY_LEVEL = ns.getServerSecurityLevel(server);
    const MIN_SECURITY_LEVEL = ns.getServerMinSecurityLevel(server);
    const WEAKEN_TIME = formatTime(ns.getWeakenTime(server));
    const GROW_TIME = formatTime(ns.getGrowTime(server));
    const HACK_TIME = formatTime(ns.getHackTime(server));

    let is_hackable = HACK_LEVEL < ns.getHackingLevel();
    let has_money = MAX_MONEY > 1;
    if (is_hackable && has_money) {
      // Print detailed server information if it's hackable and profitable.
      ns.tprintf("| %18s | $ %8s / %8s | %7s | HL:%4d | SL:%3d / %2d | WT:%2dh %2dm %2ds | GT:%2dh %2dm %2ds | HT:%2dh %2dm %2ds |",
        server, ns.formatNumber(MONEY), ns.formatNumber(MAX_MONEY), MONEY_PERCENT, HACK_LEVEL, SECURITY_LEVEL,
        MIN_SECURITY_LEVEL, ...WEAKEN_TIME, ...GROW_TIME, ...HACK_TIME);
    }
  }

  // Helper function to retrieve all reachable servers from "home".
  function getAllServers(ns) {
    let servers = [];
    let stack = ["home"];

    while (stack.length > 0) {
      const CURRENT = stack.pop();
      if (!servers.includes(CURRENT)) {
        servers.push(CURRENT);
        stack.push(...ns.scan(CURRENT).filter(next => !servers.includes(next)));
      }
    }
    return servers;
  }

  // Helper function to format milliseconds into hours, minutes, and seconds for readability.
  function formatTime(milliseconds) {
    const SECONDS = Math.floor((milliseconds / 1000) % 60);
    const MINUTES = Math.floor(((milliseconds / 1000) / 60) % 60);
    const HOURS = Math.floor(((milliseconds / 1000) / 3600));
    return [HOURS, MINUTES, SECONDS];
  }
}