/** @param {NS} ns **/
//https://steamcommunity.com/sharedfiles/filedetails/?id=2717682356
export async function main(ns) {
  let servers = [];
  let ramPerThread = ns.getScriptRam("/Hacks/Hacked-Servers/Early/Earlyhacker.js");
  let serversToScan = ns.scan("home");
  let currentHackingLevel = ns.getHackingLevel();
  let i = 0;
  let j = 0;
  var textblock = "";

  // Determine target based on hacking level
  if (currentHackingLevel < 10) { var target = "n00dles" }
  else if (currentHackingLevel < 30) { var target = "joesguns" }
  else if (currentHackingLevel < 120) { var target = "harakiri-sushi" }
  else if (currentHackingLevel < 300) { var target = "iron-gym" }
  else if (currentHackingLevel < 400) { var target = "phantasy" }
  else if (currentHackingLevel < 500) { var target = "crush-fitness" }
  else if (currentHackingLevel < 600) { var target = "the-hub" }
  else if (currentHackingLevel < 700) { var target = "rothman-uni" }
  else if (currentHackingLevel < 800) { var target = "computek" }
  else if (currentHackingLevel < 900) { var target = "netlink" }
  else if (currentHackingLevel < 999) { var target = "alpha-ent" }
  else { var target = "iron-gym" }

  while (serversToScan.length > 0) {
    j++;
    textblock += "i " + i + "    j " + j + "\r\n";

    let server = serversToScan.shift();

    // Exclude "home" and "server-0" to "server-24"
    if (!servers.includes(server) && server !== "home" && !server.match(/^server-(?:[0-9]|1\d|2[0-4])$/)) {
      servers.push(server);
      serversToScan = serversToScan.concat(ns.scan(server));
      textblock += "server " + server + "               reqHackingLevel " + ns.getServerRequiredHackingLevel(server) + " root: " + ns.hasRootAccess(server) + "\r\n";
      
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
        await ns.scp("Hacks/Hacked-Servers/Early/Earlyhacker.js", server);
        let ramAvailable = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
        let threads = Math.floor(ramAvailable / ramPerThread);
        textblock += "server " + server + " has root,";

        if (threads > 0) {
          ns.exec("Hacks/Hacked-Servers/Early/Earlyhacker.js", server, threads, target);
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
