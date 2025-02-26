/** @param {NS} ns **/
export async function main(ns) {
    const files = ns.ls("home");  // Get a list of all files on the "home" server
    for (const file of files) {
        if (file !== "Git-Pull..js") {  // Make sure we don't delete the "Git-Pull.js" script
            await ns.rm(file, "home");  // Remove each file
            ns.tprint(`Deleted: ${file}`);  // Log the deleted file
        }
    }
}






