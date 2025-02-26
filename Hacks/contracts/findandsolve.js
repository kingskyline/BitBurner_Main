import { getFilePath, getNsDataThroughFile, disableLogs, log } from 'utilites/dependacy/helpers.js';
const scriptSolver = getFilePath("Hacks/contracts/solvers.js");

/** @param {NS} ns **/
export async function main(ns) {
    disableLogs(ns, ["scan"]);

    while (true) {
        ns.print("Starting contract search...");

        const servers = await getNsDataThroughFile(ns, 'scanAllServers(ns)');
        ns.print(`Scanned ${servers.length} servers. Looking for contracts...`);

        // Retrieve all contracts
        const contractsDb = servers.map(hostname => ({ hostname, contracts: ns.ls(hostname, '.cct') }))
            .filter(o => o.contracts.length > 0)
            .map(o => o.contracts.map(contract => ({ contract, hostname: o.hostname }))).flat();

        if (contractsDb.length === 0) {
            ns.print("No contracts found.");
        } else {
            ns.print(`Found ${contractsDb.length} contracts. Fetching contract details...`);

            const serializedContractDb = JSON.stringify(contractsDb);
            let contractsDictCommand = async (command, tempName) => await getNsDataThroughFile(ns,
                `Object.fromEntries(JSON.parse(ns.args[0]).map(c => [c.contract, ${command}]))`, tempName, [serializedContractDb]);

            let dictContractTypes = await contractsDictCommand('ns.codingcontract.getContractType(c.contract, c.hostname)', '/Temp/contract-types.txt');
            let dictContractDataStrings = await contractsDictCommand('JSON.stringify(ns.codingcontract.getData(c.contract, c.hostname), jsonReplacer)', '/Temp/contract-data-stringified.txt');

            contractsDb.forEach(c => c.type = dictContractTypes[c.contract]);
            contractsDb.forEach(c => c.dataJson = dictContractDataStrings[c.contract]);

            // Run the solver script
            ns.print("Running contract solver...");
            ns.run(scriptSolver, { temporary: true }, JSON.stringify(contractsDb));
        }

        ns.print("Sleeping for 60 seconds before checking again...");
        await ns.sleep(60000); // Wait 60 seconds before looping
    }
}
