interface Product {
    id: string;
    code: string;
    name: string;
    weight: number;
}

interface Pallet {
    id: string;
    products: Product[];
    lastModified: string;
    arrival: string;
}

interface PalletSpot {
    id: string;
    shelf: string;
    pallet: Pallet;
    spot: Spot;
}

interface Spot {
    id: string;
    spotNumber: number;
    gap: Gap;
}

interface Gap {
    id: string;
    gapNumber: number;
    row: Row;
}

interface Row {
    id: string;
    rowNumber: number;
}

export type { Product, Pallet, PalletSpot, Spot, Gap, Row };