/**
 * Monitors and displays the RAM usage details for specified servers, including the "home" server
 * and any purchased servers. The script outputs the maximum RAM, used RAM, and available RAM for each server,
 * refreshing the data at a specified interval. Verbose logging for RAM-related methods is disabled
 * to keep the output clear and focused.
 *
 * @param {NS} ns - The namespace object provided by the game, which includes functions for interacting with the game's systems.
 * @async
 */
export async function main(ns) {
  // Disable verbose logging for RAM-related operations to streamline output.
  const DISABLED_LOGS = ['getServerMaxRam', 'getServerUsedRam'];
  DISABLED_LOGS.forEach(log => ns.disableLog(log));

  // Opens a tail window in the game to display log outputs.
  ns.tail();

  // Set the interval between updates to 3 seconds.
  const SLEEP_DELAY = 1000 * 3;

  // Include the "home" server and any purchased servers in the list to monitor.
  const SERVERS = ["home"].concat(ns.getPurchasedServers());

  // Continuously loop to monitor and display RAM usage for each server.
  while (true) {
    for (let server of SERVERS) {
      // Calculate and fetch RAM details for each server.
      let max_ram = ns.getServerMaxRam(server);
      let used_ram = ns.getServerUsedRam(server);
      let avail_ram = max_ram - used_ram;
      // Output the RAM usage details in a formatted manner.
      ns.printf("| %9s | Used: %8s / %8s | Free: %8s |",
        server, ns.formatRam(used_ram), ns.formatRam(max_ram), ns.formatRam(avail_ram));
    }
    // Wait for the specified delay before the next update.
    await ns.sleep(SLEEP_DELAY);
  }
}