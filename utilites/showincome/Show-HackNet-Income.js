import {
    TextTransforms
} from "./text-transform.js";

/** @param {NS} ns */
export async function main(ns) {

    ns.disableLog("ALL");
    ns.clearLog();
    ns.tail();

    while (true) {

        let longest = 0;

        // Get hacknet nodes
        let num_nodes = ns.hacknet.numNodes(); // get number of hacknet nodes

        let cumulative = 0;

        // Find the longest node name length (for neat printing)
        for (let i = 0; i < num_nodes; i++) {
            const nodeName = "hacknet-node-" + i;
            longest = Math.max(nodeName.length, longest);
        };

        ns.clearLog();

        let time = new Date().toLocaleTimeString();
        let date = new Date().toLocaleDateString();
        let dt = '[' + date + ' ' + time + '] ';

        // Iterate through hacknet nodes
        for (let i = 0; i < num_nodes; i++) {
            const nodeName = "hacknet-node-" + i;

            // Fetch node stats
            const nodeStats = ns.hacknet.getNodeStats(i);
            const production = nodeStats.production;

            let gains = production; // we will consider 'production' as the profit per second.

            // Format and display the node's profit
            if (gains <= 0.999) {
                ns.print(dt + " " + nodeName.padStart(longest + 1) + ": " + TextTransforms.apply(ns.nFormat(gains, "0.000a"), [TextTransforms.Color.White]));

            } else if (gains > 0.999 && gains <= 999) {
                ns.print(dt + " " + nodeName.padStart(longest + 1) + ": " + TextTransforms.apply(ns.nFormat(gains, "0.000a"), [TextTransforms.Color.Orange]));

            } else if (gains >= 1000 && gains <= 9999) {
                ns.print(dt + " " + nodeName.padStart(longest + 1) + ": " + TextTransforms.apply(ns.nFormat(gains, "0.000a"), [TextTransforms.Color.Green]));

            } else if (gains >= 10000 && gains <= 99999) {
                ns.print(dt + " " + nodeName.padStart(longest + 1) + ": " + TextTransforms.apply(ns.nFormat(gains, "0.000a"), [TextTransforms.Color.LGreen]));

            } else if (gains >= 100000 && gains <= 999999) {
                ns.print(dt + " " + nodeName.padStart(longest + 1) + ": " + TextTransforms.apply(ns.nFormat(gains, "0.000a"), [TextTransforms.Color.LGreen]));

            } else if (gains >= 1000000) {
                ns.print(dt + " " + nodeName.padStart(longest + 1) + ": " + TextTransforms.apply(ns.nFormat(gains, "0.000a"), [TextTransforms.Color.LCyan]));
            }

            cumulative += gains;
        }

        ns.print('\n');
        ns.print(dt + " " + " all-hacknet-nodes" + ": " + TextTransforms.apply(ns.nFormat(cumulative, "0.000a"), [TextTransforms.Color.LGreen]) + " / sec");

        await ns.sleep(1000);
    }
}
