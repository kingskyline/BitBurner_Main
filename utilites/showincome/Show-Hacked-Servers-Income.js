import { TextTransforms } from "./text-transform.js";

/** @param {NS} ns */
export async function main(ns) {

    ns.disableLog("ALL");
    ns.clearLog();
    ns.tail();

    while (true) {
        let longest = 0;

        // Get all purchased servers (to avoid listing them)
        let purchased_servers = ns.getPurchasedServers();

        // Recursively scan all available servers, starting from "home"
        const getHackedServers = (hostname, visited = new Set()) => {
            let servers = [];
            const scanResult = ns.scan(hostname);
            for (let server of scanResult) {
                // Only add the server if it's not already visited and not home or a purchased server
                if (!visited.has(server) && !purchased_servers.includes(server) && server !== "home") {
                    visited.add(server);
                    servers.push(server);
                    // Recursively scan each server to find more connected servers
                    servers = servers.concat(getHackedServers(server, visited));
                }
            }
            return servers;
        };

        // Get all hacked servers (excluding home and purchased)
        const hacked_servers = getHackedServers("home");

        // Sort the servers alphabetically
        hacked_servers.sort();

        // Find the longest server name for padding purposes
        for (let pserv of hacked_servers) {
            longest = Math.max(pserv.length, longest);
        };

        ns.clearLog();

        // Get the current time and date
        let time = new Date().toLocaleTimeString();
        let date = new Date().toLocaleDateString();
        let dt = '[' + date + ' ' + time + '] ';
        let cumulative = 0;

        // Iterate through each hacked server
        for (let pserv of hacked_servers) {
            let gains = 0;

            // Check all running scripts on the server
            for (const script of ns.ps(pserv)) {
                const s = ns.getRunningScript(script.pid);
                if (s.onlineRunningTime > 0) {
                    // Calculate the money made per second for this script
                    gains += s.onlineMoneyMade / s.onlineRunningTime;
                }
            }

            // Only display servers making money > 0.1
            if (gains > 0.1) {
                // Print the income with color formatting based on the gains
                if (gains <= 0.999) {
                    ns.print(dt + " " + pserv.padStart(longest + 1) + ": " + TextTransforms.apply(ns.nFormat(gains, "0.000a"), [TextTransforms.Color.White]));
                } else if (gains > 0.999 && gains <= 999) {
                    ns.print(dt + " " + pserv.padStart(longest + 1) + ": " + TextTransforms.apply(ns.nFormat(gains, "0.000a"), [TextTransforms.Color.Orange]));
                } else if (gains >= 1000 && gains <= 9999) {
                    ns.print(dt + " " + pserv.padStart(longest + 1) + ": " + TextTransforms.apply(ns.nFormat(gains, "0.000a"), [TextTransforms.Color.Green]));
                } else if (gains >= 10000 && gains <= 99999) {
                    ns.print(dt + " " + pserv.padStart(longest + 1) + ": " + TextTransforms.apply(ns.nFormat(gains, "0.000a"), [TextTransforms.Color.LGreen]));
                } else if (gains >= 100000 && gains <= 999999) {
                    ns.print(dt + " " + pserv.padStart(longest + 1) + ": " + TextTransforms.apply(ns.nFormat(gains, "0.000a"), [TextTransforms.Color.LGreen]));
                } else if (gains >= 1000000) {
                    ns.print(dt + " " + pserv.padStart(longest + 1) + ": " + TextTransforms.apply(ns.nFormat(gains, "0.000a"), [TextTransforms.Color.LCyan]));
                }

                // Add up the total cumulative income
                cumulative += gains;
            }
        }

        // Print the total income from all hacked servers
        ns.print('\n');
        ns.print(dt + " " + " all-svrs" + ": " + TextTransforms.apply(ns.nFormat(cumulative, "0.000a"), [TextTransforms.Color.LGreen]) + " / sec");

        // Wait for 1 second before refreshing
        await ns.sleep(1000);
    }
}
