/** @param {NS} ns **/
export async function main(ns) {
    // List of scripts to run sequentially with a delay between them   
    const scripts = [
        { script: "/utilites/Hud/Custom-Hud.js", delay: 10000 },
        { script: "/Hacks/contracts/SubnetGame.js", delay: 10000 },
        { script: "/Hacks/contracts/findandsolve.js", delay: 10000 },
        { script: "/utilites/startup/Primer.js", delay: 30000 },
//        { script: "/utilites/managers/hacknet-manager.js", delay: 10000 },
//        { script: "/utilites/showincome/Show-HackNet-Income.js", delay: 10000 },
//        { script: "/utilites/managers/server-manager.js", delay: 10000 },   
        { script: "/Hacks/Hacked-Servers/Early/EarlyhackerDeployer.js", delay: 10000 },
        { script: "/Hacks/Bought-Servers/Mid-Late/BoughtServerHackerDeployer.js", delay: 10000 },
        { script: "/Hacks/Home-Server/Early/HomeHackerDeployer.js", delay: 10000 },
        { script: "/Hacks/Home-Server/XP/HomeHackerXPDeployer.js", delay: 10000 }
    ];

    // Function to print and log messages in a clean, structured way
    function logMessage(type, message) {
        let formattedMessage;
        switch (type) {
            case "start":
                formattedMessage = `\n🟢 === STARTING SCRIPT EXECUTION ===\n${message}\n`;
                break;
            case "script":
                formattedMessage = `📜 [RUNNING] → ${message}`;
                break;
            case "success":
                formattedMessage = `✅ [SUCCESS] → ${message}`;
                break;
            case "error":
                formattedMessage = `❌ [ERROR] → ${message}`;
                break;
            case "wait":
                formattedMessage = `⏳ [WAIT] → ${message}`;
                break;
            case "done":
                formattedMessage = `\n🎉 === ALL SCRIPTS EXECUTED ===\n${message}\n`;
                break;
            default:
                formattedMessage = message;
        }
        ns.print(formattedMessage);
        ns.tprint(formattedMessage);
    }

    logMessage("start", "🚀 Initiating sequential execution of scripts...");

    // Execute each script sequentially
    for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];
        try {
            logMessage("script", `Starting ${script.script}...`);

            // Run the script on 'home'
            const execResult = ns.exec(script.script, "home");

            // Check if the execution was successful
            if (execResult === 0) {
                logMessage("error", `Failed to start ${script.script}`);
            } else {
                logMessage("success", `Successfully started: ${script.script}`);
            }

            logMessage("wait", `Pausing for ${script.delay / 1000} seconds before next script...`);
            await ns.sleep(script.delay);
        } catch (error) {
            logMessage("error", `Exception while running ${script.script}: ${error}`);
        }
    }

    // Run the other script at the end
    const otherScriptPath = "utilites/startup/start-all-Home-Hacks.js"; // Path to the other script
    const execOtherScript = ns.run(otherScriptPath, 1);

    if (execOtherScript === 0) {
        logMessage("error", `Failed to run the other script: ${otherScriptPath}`);
    } else {
        logMessage("success", `Successfully started the other script: ${otherScriptPath}`);
    }

    logMessage("done", "✅ All scripts have been executed successfully!");
}
