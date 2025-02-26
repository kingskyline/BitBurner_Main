/** @param {NS} ns **/
//https://steamcommunity.com/sharedfiles/filedetails/?id=2717682356
export async function main(ns) {
  let servers = [];
  let ramPerThread = ns.getScriptRam("Hacks/Home-Server/Early/HomeHacker.js");
  let currentHackingLevel = ns.getHackingLevel();
  let i = 0;
  let j = 0;
  var textblock = "";

  // Determine target based on hacking level
  let target;
  if (currentHackingLevel < 10) { target = "n00dles"; }
  else if (currentHackingLevel < 30) { target = "joesguns"; }
  else if (currentHackingLevel < 120) { target = "harakiri-sushi"; }
  else if (currentHackingLevel < 300) { target = "iron-gym"; }
  else if (currentHackingLevel < 750) { target = "omega-net"; }
  else { target = "zb-institute"; }

  // Scan only "home"
  let serversToScan = ["home"];

  while (serversToScan.length > 0) {
    let server = serversToScan.shift();

    // Process only "home" server
    if (server === "home" && !servers.includes(server)) {
      servers.push(server);

      textblock += `Processing server: ${server}\n`;
      textblock += `Required Hacking Level: ${ns.getServerRequiredHackingLevel(server)}\n`;
      textblock += `Root access: ${ns.hasRootAccess(server)}\n`;

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
        await ns.scp("Hacks/Home-Server/Early/HomeHacker.js", server);

        // Fetch total RAM and used RAM for the 'home' server
        let maxRam = ns.getServerMaxRam(server); // Max RAM on "home"
        let usedRam = ns.getServerUsedRam(server); // Used RAM on "home"
        let availRam = maxRam - usedRam; // Free RAM on "home"
        let reservedRam = 20000; // 300GB to reserve in MB (correctly set here)
        let usableRam = availRam - reservedRam; // Remaining usable RAM after reservation

        textblock += `Total RAM on 'home': ${ns.formatRam(maxRam)}\n`;
        textblock += `Used RAM on 'home': ${ns.formatRam(usedRam)}\n`;
        textblock += `Available RAM on 'home': ${ns.formatRam(availRam)}\n`;
        textblock += `RAM to reserve: ${ns.formatRam(reservedRam)}\n`;
        textblock += `Usable RAM after reservation: ${ns.formatRam(usableRam)}\n`;

        // Check if we have enough available RAM after reservation
        if (usableRam > 0) {
          // Calculate the number of threads we can run based on available RAM
          let threads = Math.floor(usableRam / ramPerThread);
          
          if (threads > 0) {
            ns.exec("Hacks/Home-Server/Early/HomeHacker.js", server, threads, target);
            textblock += `Deploying script with ${threads} threads on ${target}\n`;
          } else {
            textblock += "ALERT --- Insufficient threads to deploy\n";
          }
        } else {
          textblock += "ALERT --- Not enough available RAM on 'home' after reserving 300GB.\n";
        }
      }
    }
  }

  ns.write("textlog.txt", textblock, "w");
  await ns.sleep(30000);
}
