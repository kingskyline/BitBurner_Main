/** @param {NS} ns **/
export async function main(ns) {
    ns.tail(); // Open a log window 📜

    const LOOP_DELAY = 60 * 1000; // ⏳ Wait 60 seconds between cycles
    const RESERVE_AMOUNT = 1000000; // 💰 Keep at least 1M in reserve

    while (true) {
        let nodeNum = "Default";
        let itemType = "New Node";
        let cheapest = ns.hacknet.getPurchaseNodeCost();
        let num_nodes = ns.hacknet.numNodes();

        ns.printf("🔍 Checking Hacknet for the best upgrade...");

        // Iterate through all nodes and find the cheapest upgrade
        for (let i = 0; i < num_nodes; i++) {
            let level_cost = ns.hacknet.getLevelUpgradeCost(i, 1);
            let ram_cost = ns.hacknet.getRamUpgradeCost(i, 1);
            let cpu_cost = ns.hacknet.getCoreUpgradeCost(i, 1);

            if (level_cost < cheapest) {
                cheapest = level_cost;
                nodeNum = i;
                itemType = "Level";
            }
            if (ram_cost < cheapest) {
                cheapest = ram_cost;
                nodeNum = i;
                itemType = "RAM";
            }
            if (cpu_cost < cheapest) {
                cheapest = cpu_cost;
                nodeNum = i;
                itemType = "CPU";
            }
        }

        // If we can afford the upgrade, purchase it
        let purchased = false;
        while (!purchased) {
            let money = ns.getServerMoneyAvailable("home");

            if (money >= cheapest + RESERVE_AMOUNT) {
                switch (itemType) {
                    case "New Node":
                        ns.hacknet.purchaseNode();
                        ns.printf("🆕 Purchased a new Hacknet Node! 🚀");
                        break;
                    case "Level":
                        ns.hacknet.upgradeLevel(nodeNum, 1);
                        ns.printf("⬆️ Upgraded Level of Node %s! 🔥", nodeNum);
                        break;
                    case "RAM":
                        ns.hacknet.upgradeRam(nodeNum, 1);
                        ns.printf("💾 Increased RAM of Node %s! 🚀", nodeNum);
                        break;
                    case "CPU":
                        ns.hacknet.upgradeCore(nodeNum, 1);
                        ns.printf("🖥️ Boosted CPU Cores of Node %s! ⚡", nodeNum);
                        break;
                }
                purchased = true;
            } else {
                ns.printf("⚠️ Not enough money! Need 💰 %s, but only have 💰 %s. Waiting... ⏳", ns.formatNumber(cheapest), ns.formatNumber(money));
                await ns.sleep(LOOP_DELAY);
            }
        }

        // Wait before checking for the next upgrade
        ns.printf("⏳ Waiting %d seconds before checking again...", LOOP_DELAY / 1000);
        await ns.sleep(LOOP_DELAY);
    }
}
