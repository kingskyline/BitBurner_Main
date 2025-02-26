/** @param {NS} ns */
export async function main(ns) {
	const stockHistory = new Map();
	const stockIncreases = new Map();
	const stockVolatility = new Map();
	const stocks = ns.stock.getSymbols();

	// Reserve pool amount (you can adjust this value)
	let reservePool = 50000000;  // Example reserve amount, you can change this

	for (const stock of stocks) {
		stockHistory.set(stock, []);
		stockIncreases.set(stock, 0);
		stockVolatility.set(stock, []);
	}

	let updateCount = 0;

	async function updateStocks() {
		updateCount++;
		ns.tprint(`Update count: ${updateCount}`);

		for (const stock of stocks) {
			const stockPrice = ns.stock.getPrice(stock);
			const history = stockHistory.get(stock);
			const volatility = stockVolatility.get(stock);
			const position = ns.stock.getPosition(stock);

			if (position[0] > 0) {
				ns.tprint(`Currently owning ${position[0]} shares of ${stock}.`);
			}

			if (history.length > 0 && history[history.length - 1] !== 0) {
				const lastPrice = history[history.length - 1];
				const percentageChange = ((stockPrice - lastPrice) / lastPrice) * 100;
				volatility.push(Math.abs(percentageChange));

				if (percentageChange > 0) {
					const increases = stockIncreases.get(stock) + 1;
					stockIncreases.set(stock, increases);
				}

				ns.print(`${stock} - % Change: ${percentageChange.toFixed(2)}`);
			}

			history.push(stockPrice);
			if (history.length > 10) {
				history.shift();
				volatility.shift();
			}
		}

		if (updateCount % 10 === 0) {
			const sortedStocks = Array.from(stockIncreases.entries())
				.sort((a, b) => b[1] - a[1] ||
					average(stockVolatility.get(b[0])) - 
					average(stockVolatility.get(a[0])));

			ns.tprint("Stocks ranked by number of increases and volatility:");
			for (const [stock, increases] of sortedStocks) {
				ns.tprint(`${stock} - Increases: ${increases}, Avg Volatility: ${average(stockVolatility.get(stock)).toFixed(2)}%`);
			}

			for (const stock of stocks) {
				const position = ns.stock.getPosition(stock);
				const playerMoney = ns.getServerMoneyAvailable("home") - reservePool;  // Subtracting reserve pool

				if (position[0] > 0) {
					const increases = stockIncreases.get(stock);

					if (increases < 5) {
						ns.stock.sellStock(stock, position[0]);
						ns.tprint(`Sold all ${position[0]} shares of ${stock} due to less than 5 increases in the last 10 updates.`);
						continue;  // Continue to the next iteration to avoid buying immediately after selling
					}

					const ownedVolatility = average(stockVolatility.get(stock));
					const higherVolatilityStocks = sortedStocks.filter(([s, inc]) =>
						average(stockVolatility.get(s)) > 2 * ownedVolatility && inc >= 7);

					if (higherVolatilityStocks.length > 0) {
						ns.stock.sellStock(stock, position[0]);
						ns.tprint(`Sold all ${position[0]} shares of ${stock} to buy a higher volatility stock.`);

						higherVolatilityStocks.sort((a, b) => average(stockVolatility.get(b[0])) - average(stockVolatility.get(a[0])));
						const [newStock,] = higherVolatilityStocks[0];
						const sharesToBuy = Math.floor(playerMoney / ns.stock.getAskPrice(newStock));
						ns.stock.buyStock(newStock, sharesToBuy);
						ns.tprint(`Bought ${sharesToBuy} shares of ${newStock} with higher volatility.`);
					}
				} else if (playerMoney > 10000000) {
					const [topStock,] = sortedStocks[0];
					const sharesToBuy = Math.floor(playerMoney / ns.stock.getAskPrice(topStock));
					ns.stock.buyStock(topStock, sharesToBuy);
					ns.tprint(`Bought ${sharesToBuy} shares of ${topStock} - Increases: ${stockIncreases.get(topStock)}, Avg Volatility: ${average(stockVolatility.get(topStock)).toFixed(2)}%`);
				}
			}

			for (const stock of stocks) {
				stockIncreases.set(stock, 0);
			}
		}

		await ns.sleep(5000);
	}

	while (true) {
		await updateStocks();
	}

	function average(arr) {
		if (arr.length === 0) return 0;
		const sum = arr.reduce((a, b) => a + b, 0);
		return sum / arr.length;
	}
}
