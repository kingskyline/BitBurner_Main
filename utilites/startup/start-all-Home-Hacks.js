/** @param {NS} ns **/
export async function main(ns) {
    // Get player's hacking level
    const hackingLevel = ns.getHackingLevel();
    
    // Define target lists
    const earlyGameTargets = [
        "foodnstuff", "sigma-cosmetics", "joesguns", "nectar-net", "hong-fang-tea",
        "harakiri-sushi", "neo-net", "zer0", "max-hardware", "iron-gym",
        "phantasy", "silver-helix", "crush-fitness", "omega-net", "johnson-ortho",
        "the-hub", "rothman-uni", "computek", "millenium-fitness", "netlink"
    ];

    const lateGameTargets = [
        "foodnstuff", "sigma-cosmetics", "joesguns", "nectar-net", "hong-fang-tea",
        "harakiri-sushi", "neo-net", "zer0", "max-hardware", "iron-gym",
        "phantasy", "silver-helix", "crush-fitness", "omega-net", "johnson-ortho",
        "the-hub", "rothman-uni", "computek", "millenium-fitness", "netlink",        
        "aevum-police", "summit-uni", "catalyst", "rho-construction", "alpha-ent",
        "syscore", "lexo-corp", "zb-institute"
    ];

    // Select targets based on level
    const hackTargets = hackingLevel > 700 ? lateGameTargets : earlyGameTargets;
    
    const hackScript = "/Hacks/Basic/Single-Home-Hacks.js"; 
    const delayBetweenHacks = 1000; // 1 second delay

    function logMessage(type, message) {
        let formattedMessage;
        switch (type) {
            case "start":
                formattedMessage = `\n🟢 === STARTING HACKING SEQUENCE (Level ${hackingLevel}) ===\n${message}\n`;
                break;
            case "hack":
                formattedMessage = `💀 [HACKING] → Targeting ${message}...`;
                break;
            case "success":
                formattedMessage = `✅ [SUCCESS] → Hack started on: ${message}`;
                break;
            case "error":
                formattedMessage = `❌ [ERROR] → Failed to start hack on ${message}`;
                break;
            case "wait":
                formattedMessage = `⏳ [WAIT] → Waiting ${delayBetweenHacks / 1000} seconds before next hack...`;
                break;
            case "done":
                formattedMessage = `\n🎉 === HACKING SEQUENCE COMPLETE ===\n${message}\n`;
                break;
            default:
                formattedMessage = message;
        }
        ns.print(formattedMessage);
        ns.tprint(formattedMessage);
    }

    logMessage("start", "🚀 Initiating hacking sequence...");

    for (let target of hackTargets) {
        try {
            logMessage("hack", `Running ${hackScript} on ${target}...`);

            const execResult = ns.run(hackScript, 1, target);

            if (execResult === 0) {
                logMessage("error", target);
            } else {
                logMessage("success", target);
            }

            logMessage("wait", "");
            await ns.sleep(delayBetweenHacks);
        } catch (error) {
            logMessage("error", `Exception while hacking ${target}: ${error}`);
        }
    }

    logMessage("done", "✅ All hack scripts have been started!");
}
