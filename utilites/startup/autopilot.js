/**
 * autopilot.js - Fully automated gameplay for Bitburner
 * Logs everything with emojis, executes tasks sequentially, and restarts every 2 hours.
 */

export async function main(ns) {
    ns.tail(); // Open the log window automatically
    ns.disableLog("ALL");

    const log = (msg) => ns.print(`🛠️ ${msg}`);
    const runIfNotRunning = async (script, args = []) => {
        if (ns.isRunning(script, "home", ...args)) {
            log(`Skipping ${script} (already running)`);
            return false;
        }
        log(`Starting ${script}`);
        ns.run(script, 1, ...args);
        await ns.sleep(1000);
        return true;
    };

    log("🚀 Autopilot initiated!");

    // Check if we have 200K money for Casino
    if (ns.getServerMoneyAvailable("home") >= 200000) {
        log("🎰 Running Casino script...");
        await runIfNotRunning("Hacks/contracts/Casino.js");

        // Wait until Casino script finishes before proceeding
        while (ns.isRunning("Hacks/contracts/Casino.js", "home")) {
            await ns.sleep(5000);
        }

        log("🎰 Casino script completed! Resuming Autopilot...");
    }

    // Run core management scripts
    await runIfNotRunning("/Hacks/Stocks/stockmaster.js", ["--noisy", "--fracB", "0.1", "--fracH", "0.1"]);
    await runIfNotRunning("/utilites/Hud/Custom-Hud.js");

    // Run Primer in the background until hacking level 3000
    if (!ns.isRunning("/utilites/startup/Primer.js", "home")) {
        ns.run("/utilites/startup/Primer.js");
    }

    // Check if all 25 player-bought servers exist before running contract solver
    let ownedServers = ns.getPurchasedServers().length;
    if (ownedServers >= 25) {
        await runIfNotRunning("Hacks/contracts/findandsolve.js");
    }

    // Run various utility scripts
    await runIfNotRunning("Hacks/contracts/SubnetGame.js");
    await runIfNotRunning("utilites/managers/tor-manager.js");
    await runIfNotRunning("utilites/managers/program-manager.js");
    await runIfNotRunning("/utilites/managers/hacknet-manager.js");
    await runIfNotRunning("utilites/managers/server-manager.js");

    // Stop any existing hacks
    ns.scriptKill("/Hacks/Basic/Single-Home-Hacks.js", "home");

    const targets = [
        "foodnstuff", "sigma-cosmetics", "joesguns", "nectar-net", "hong-fang-tea",
        "harakiri-sushi", "neo-net", "zer0", "max-hardware", "iron-gym",
        "phantasy", "silver-helix", "crush-fitness", "omega-net", "johnson-ortho",
        "the-hub", "rothman-uni", "computek", "millenium-fitness", "netlink",        
        "aevum-police", "summit-uni", "catalyst", "rho-construction", "alpha-ent",
        "syscore", "lexo-corp", "zb-institute"
    ];

    async function hackCycle() {
        while (true) {
            await ns.sleep(1); // Allow proper concurrency
            ns.scriptKill("/Hacks/Basic/Single-Home-Hacks.js", "home");
            await runIfNotRunning("Hacks/Basic/Single-Home-XP-Hacks.js", ["xp"]);
            
            let xpCountdown = 5 * 60; // 5 minutes in seconds
            while (xpCountdown > 0) {
                log(`⚡ XP farming for ${formatTime(xpCountdown)}`);
                await ns.sleep(60000); // Update every 60 seconds
                xpCountdown -= 60; // Decrease by 60 seconds
            }
            
            ns.scriptKill("Hacks/Basic/Single-Home-XP-Hacks.js", "home");

            for (let target of targets) {
                if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(target)) {
                    await runIfNotRunning("/Hacks/Basic/Single-Home-Hacks.js", [target]);
                    let targetCountdown = 25 * 60; // 25 minutes in seconds
                    while (targetCountdown > 0) {
                        log(`💰 Hacking ${target} for ${formatTime(targetCountdown)}`);
                        await ns.sleep(60000); // Update every 60 seconds
                        targetCountdown -= 60; // Decrease by 60 seconds
                    }
                    ns.scriptKill("/Hacks/Basic/Single-Home-Hacks.js", "home");
                    break;
                }
            }
        }
    }

    // Start hack cycle properly
    await hackCycle(); // Wait for hackCycle to complete, avoid concurrency issues

    // Restart script every 2 hours
    log("⏳ Autopilot will restart in 2 hours...");
    await ns.sleep(7200000); // Sleep for 2 hours
    log("🔄 Restarting Autopilot...");
    ns.scriptKill("autopilot.js", "home");
    ns.spawn("autopilot.js");
}

// Helper function to format time in MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}
