export const symbols = [
    {
        symbol: "ETH",
        price: 2000
    },
    {
        symbol: "USDC",
        price: 1
    },
    {
        symbol: "DAI",
        price: 1
    }
];

export function getPrice(symbol: string): number | null {
        const token = symbols.find(t => t.symbol === symbol);
        return token ? token.price : null;
    }
