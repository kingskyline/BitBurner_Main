/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");

  ns.tail();

    var scannedServers;
    var server;
    var homePaths = [["home"]];
    var homePath = JSON.parse(JSON.stringify(homePaths[0]));
    var newNode;
    var path;
    var pathDuplicate;
    var pathNode;
    var nodeDuplicate;
    var terminalInput = eval('document.getElementById( "terminal-input" )'); /*bypass document*/
    var terminalHandler = Object.keys(terminalInput)[1];

    // Create an array of all paths from "home" to each server
    while (homePath.length !== 0) {
        scannedServers = ns.scan(homePath[homePath.length - 1]);
        newNode = false;
        for (server of scannedServers) {
            nodeDuplicate = false;
            for (pathNode of homePath) {
                if (JSON.stringify(pathNode) === JSON.stringify(server)) {
                    nodeDuplicate = true;
                    break;
                }
            }

            if (nodeDuplicate === false) {
                homePath.push(server);
                pathDuplicate = false;
                for (path of homePaths) {
                    if (JSON.stringify(path) === JSON.stringify(homePath)) {
                        pathDuplicate = true;
                        break;
                    }
                }

                if (pathDuplicate === false) {
                    homePaths.push(JSON.parse(JSON.stringify(homePath)));
                    newNode = true;
                    break;
                } else {
                    homePath.pop();
                }
            }
        }

        if (newNode === false) {
            homePath.pop();
        }
    }

    // Loop through paths and attempt to install backdoors
    for (path of homePaths) {
        server = ns.getServer(path[path.length - 1]);

        // Check if the server is accessible, has no backdoor, and the player has root access
        if (
            server.backdoorInstalled === false &&
            server.purchasedByPlayer === false &&
            ns.hasRootAccess(server.hostname) === true
        ) {
            // Check if the player has enough hacking level for the server
            let requiredHackingLevel = server.requiredHackingSkill; // Get the server's required hacking level
            let playerHackingLevel = ns.getHackingLevel(); // Get the player's current hacking level

            // If the player's hacking level is lower than the required level, skip this server
            if (playerHackingLevel < requiredHackingLevel) {
                ns.print(`Skipping ${server.hostname} because player hacking level is too low.`);
                continue; // Skip to the next server
            }

            // Proceed with connecting and installing a backdoor
            terminalInput = eval('document.getElementById( "terminal-input" )');
            if (terminalInput === null) {
                ns.exit();
            }
            terminalHandler = Object.keys(terminalInput)[1];
            terminalInput.value = "";
            for (pathNode of path) {
                terminalInput.value += "connect " + pathNode + ";";
            }
            terminalInput[terminalHandler].onChange({ target: terminalInput });
            terminalInput[terminalHandler].onKeyDown({ key: 'Enter', preventDefault: () => null });
            await ns.sleep(1000);

            terminalInput = eval('document.getElementById( "terminal-input" )');
            if (terminalInput === null) {
                ns.exit();
            }
            terminalInput.value = "backdoor";
            terminalInput[terminalHandler].onChange({ target: terminalInput });
            terminalInput[terminalHandler].onKeyDown({ key: 'Enter', preventDefault: () => null });

            // Backdoor time is approximately 1/4 of hack time
            await ns.sleep(Math.ceil(ns.getHackTime(server.hostname) / 4) + 1000);
        }
    }

    ns.tprint("Backdoors completed");
}
