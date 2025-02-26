/** @param {NS} ns */

export async function main(ns) {
  // Targets for each group of 5 servers
  const targets = [
    "lexo-corp", "alpha-ent", "syscore", "rho-construction", "catalyst",
     "summit-uni", "aevum-police", "netlink", "millenium-fitness",
    "computek", "rothman-uni", "the-hub", "johnson-ortho", "omega-net", "crush-fitness"
  ];
  
  let currentHackingLevel = ns.getHackingLevel()
  // Determine target based on server index (group of 5 servers)
  let serverIndex = parseInt(ns.getHostname().match(/\d+/)[0]);
  let targetIndex = Math.floor(serverIndex / 5); // Groups of 5 servers
  let target = targets[targetIndex];

  // Defines how much money a server should have before we hack it
  var moneyThresh = await ns.getServerMaxMoney(target) * 0.75;

  // Defines the maximum security level the target server can have.
  // If the target's security level is higher than this, we'll weaken it before doing anything else
  var securityThresh = await ns.getServerMinSecurityLevel(target) + 5;

  // Infinite loop that continuously hacks/grows/weakens the target server
  while (true) {
    if (await ns.getServerSecurityLevel(target) > securityThresh) {
      // If the server's security level is above our threshold, weaken it
      await ns.weaken(target);
    } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
      // If the server's money is less than our threshold, grow it
      await ns.grow(target);
    } else {
      // Otherwise, hack it
      await ns.hack(target);
    }
  }
}
