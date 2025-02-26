/** @param {NS} ns **/
//https://steamcommunity.com/sharedfiles/filedetails/?id=2717682356
export async function main(ns) {
  let servers = [];
  let ramPerThread = ns.getScriptRam("Hacks/Bought-Servers/XP/BoughtServerHackerXP.js");
  let serversToScan = ns.scan("home");
  let currentHackingLevel = ns.getHackingLevel();
  let i = 0;
  let j = 0;
  var textblock = "";

  // Determine target based on hacking level
  let target;
  if (currentHackingLevel < 10) { target = "joesguns"; }
  else if (currentHackingLevel < 30) { target = "joesguns"; }
  else if (currentHackingLevel < 120) { target = "joesguns"; }
  else if (currentHackingLevel < 300) { target = "joesguns"; }
  else if (currentHackingLevel < 500) { target = "joesguns"; }
  else { target = "joesguns"; }

  while (serversToScan.length > 0) {
    j++;
    textblock += `i ${i}    j ${j}\r\n`;

    let server = serversToScan.shift();

    // Only include "server-0" to "server-24" and exclude "home" and others
    if (!servers.includes(server) && server !== "home" && server.match(/^server-(?:[0-9]|1\d|2[0-4])$/)) {
      servers.push(server);
      serversToScan = serversToScan.concat(ns.scan(server));
      textblock += `server ${server}  reqHackingLevel ${ns.getServerRequiredHackingLevel(server)} root: ${ns.hasRootAccess(server)}\r\n`;
      
      if (!ns.hasRootAccess(server)) {
        i++;
        let openPorts = 0;
        if (ns.fileExists("BruteSSH.exe")) {
          ns.brutessh(server);
          openPorts++;
        }
        if (ns.fileExists("FTPCrack.exe")) {
          ns.ftpcrack(server);
          openPorts++;
        }
        if (ns.fileExists("RelaySMTP.exe")) {
          ns.relaysmtp(server);
          openPorts++;
        }
        if (ns.fileExists("HTTPWorm.exe")) {
          ns.httpworm(server);
          openPorts++;
        }
        if (ns.fileExists("SQLInject.exe")) {
          ns.sqlinject(server);
          openPorts++;
        }
        if (ns.getServerNumPortsRequired(server) <= openPorts) {
          ns.nuke(server);
        }
      }
      
      if (ns.hasRootAccess(server)) {
        await ns.scp("Hacks/Bought-Servers/XP/BoughtServerHackerXP.js", server);
        let ramAvailable = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
        let threads = Math.floor(ramAvailable / ramPerThread);
        textblock += `server ${server} has root,`;

        if (threads > 0) {
          ns.exec("Hacks/Bought-Servers/XP/BoughtServerHackerXP.js", server, threads, target, "grow");
          textblock += ` deploying grow script with ${threads} threads on ${target} \r\n`;
        } else {
          textblock += `ALERT --- ${threads} threads \r\n`;
        }
      }
    }
  }
  
  ns.write("textlog.txt", textblock, "w");
  await ns.sleep(30000);
}
