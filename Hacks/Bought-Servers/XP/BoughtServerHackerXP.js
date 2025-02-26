/** @param {NS} ns **/

export async function main(ns) {
  // Determine target based on hacking level
  let currentHackingLevel = ns.getHackingLevel();
  let target;
  if (currentHackingLevel < 10) { target = "joesguns"; }
  else if (currentHackingLevel < 30) { target = "joesguns"; }
  else if (currentHackingLevel < 120) { target = "joesguns"; }
  else if (currentHackingLevel < 300) { target = "joesguns"; }
  else if (currentHackingLevel < 500) { target = "joesguns"; }
  else { target = "joesguns"; }

  // Infinite loop that continuously grows the target server
  while (true) {
    await ns.grow(target);
  }
}
