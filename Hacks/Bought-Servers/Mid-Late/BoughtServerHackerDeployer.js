/** @param {NS} ns **/
export async function main(ns) {
  let servers = [];
  let ramPerThread = ns.getScriptRam("Hacks/Bought-Servers/Mid-Late/BoughtServerHacker.js");
  let serversToScan = ns.scan("home");
  let i = 0;
  let j = 0;
  var textblock = "";

  // List of targets to cycle through
  const targets = [
    "lexo-corp", "alpha-ent", "syscore", "rho-construction", "catalyst",
     "summit-uni", "aevum-police", "netlink", "millenium-fitness",
    "computek", "rothman-uni", "the-hub", "johnson-ortho", "omega-net", "crush-fitness"
  ];

  let targetIndex = 0; // To cycle through targets

  while (serversToScan.length > 0) {
    j++;
    textblock += "i " + i + "    j " + j + "\r\n";

    let server = serversToScan.shift();

    if (!servers.includes(server) && server !== "home" && server.match(/^server-(?:[0-9]|1\d|2[0-4])$/)) {
      servers.push(server);
      serversToScan = serversToScan.concat(ns.scan(server));
      textblock += "server " + server + " reqHackingLevel " + ns.getServerRequiredHackingLevel(server) + " root: " + ns.hasRootAccess(server) + "\r\n";
      
      if (!ns.hasRootAccess(server)) {
        i++;
        let openPorts = 0;
        if (ns.fileExists("BruteSSH.exe")) ns.brutessh(server), openPorts++;
        if (ns.fileExists("FTPCrack.exe")) ns.ftpcrack(server), openPorts++;
        if (ns.fileExists("RelaySMTP.exe")) ns.relaysmtp(server), openPorts++;
        if (ns.fileExists("HTTPWorm.exe")) ns.httpworm(server), openPorts++;
        if (ns.fileExists("SQLInject.exe")) ns.sqlinject(server), openPorts++;
        
        if (ns.getServerNumPortsRequired(server) <= openPorts) ns.nuke(server);
      }
      
      if (ns.hasRootAccess(server)) {
        await ns.scp("/Hacks/Bought-Servers/Mid-Late/BoughtServerHacker.js", server);
        let ramAvailable = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
        let threads = Math.floor(ramAvailable / ramPerThread);
        textblock += "server " + server + " has root,";

        if (threads > 0) {
          // Assign a target in a round-robin fashion
          let target = targets[targetIndex % targets.length];
          targetIndex++;

          ns.exec("/Hacks/Bought-Servers/Mid-Late/BoughtServerHacker.js", server, threads, target);
          textblock += ` deploying script with ${threads} threads on ${target} \r\n`;
        } else {
          textblock += "ALERT --- " + threads + " threads \r\n";
        }
      }
    }
  }
  
  ns.write("textlog.txt", textblock, "w");
  await ns.sleep(30000);
}