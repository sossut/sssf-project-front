const addRow = `mutation CreateRow($rowNumber: Int, $gaps: Int) {
  createRow(rowNumber: $rowNumber, gaps: $gaps) {
    rowNumber
    id
    gaps
  }
}`;
const getAllRows = `query Rows {
  rows {
    id
    rowNumber
    gaps
  }
}`
const updateRow = `mutation UpdateRow($updateRowId: ID!, $gaps: Int) {
  updateRow(id: $updateRowId, gaps: $gaps) {
    gaps
    id
    rowNumber
  }
}`

const addGap = `mutation CreateGap($gapNumber: Int!, $row: ID!) {
  createGap(gapNumber: $gapNumber, row: $row) {
    row {
      id
      rowNumber
    }
    id
    gapNumber
    spots
  }
}`

const getGaps = `query Gaps {
  gaps {
    gapNumber
    id
    spots
    row {
      id
      rowNumber
      gaps
    }
  }
}`

const addSpot = `mutation CreateSpot($spotNumber: Int!, $gap: ID!) {
  createSpot(spotNumber: $spotNumber, gap: $gap) {
    gap {
      gapNumber
      row {
        rowNumber
      }
    }
    id
    spotNumber
  }
}`
const getAllSpots = `query Spots {
  spots {
    spotNumber
    id
    gap {
      gapNumber
      id
      spots
      row {
        rowNumber
        id
        gaps
      }
    }
  }
}`
const getAllPalletSpots = `query PalletSpots {
  palletSpots {
    id
    pallet {
      id
      products {
        code
        weight
        name
        id
      }
      lastModified
      arrival
    }
    spot {
      id
      spotNumber
    }
  }
}`
const getOnePalletSpot = `query PalletSpotById($palletSpotByIdId: ID!) {
  palletSpotById(id: $palletSpotByIdId) {
    id
    pallet {
      products {
        code
      }
      id
    }
    spot {
      id
      spotNumber
    }
  }
}`
const createNewPalletSpot = `mutation CreatePalletSpot($spot: ID!, $pallet: ID) {
  createPalletSpot(spot: $spot, pallet: $pallet) {
    id
    pallet {
      products {
        code
      }
    }
    shelf
    spot {
      spotNumber
      gap {
        gapNumber
        row {
          rowNumber
        }
      }
      id
    }
  }
}`
const updateToPalletSpot = `mutation UpdatePalletSpot($updatePalletSpotId: ID!, $pallet: ID) {
  updatePalletSpot(id: $updatePalletSpotId, pallet: $pallet) {
    id
    pallet {
      id
      products {
        id
        code
      }
    }
    spot {
      id
    }
  }
}`
const updateToPallet = `mutation UpdatePallet($updatePalletId: ID!, $products: [ID]) {
  updatePallet(id: $updatePalletId, products: $products) {
    id
    products {
      id
    }
  }
}`
const createNewPallet = `mutation Mutation($products: [ID]!) {
  createPallet(products: $products) {
    id
    products {
      id
      code
    }
  }
}`
const getOnePallet = `query PalletById($palletByIdId: ID!) {
  palletById(id: $palletByIdId) {
    id
    products {
      code
      id
    }
  }
}`
const deletePalletQuery = `mutation DeletePallet($deletePalletId: ID!) {
  deletePallet(id: $deletePalletId) {
    id
    products {
      code
      id
    }
  }
}`
const getAllProducts = `query Products {
  products {
    id
    weight
    code
    name
  }
}`
const getOneProduct = `query ProductById($productByIdId: ID!) {
  productById(id: $productByIdId) {
    code
    id
    name
  }
}`
const palletsByProductQuery = `query PalletsByProduct($product: ID!) {
  palletsByProduct(product: $product) {
    id
    products {
      code
    }
  }
}`
const palletSpotsByPalletQuery = `query PalletSpotsByPallet($pallet: ID!) {
  palletSpotsByPallet(pallet: $pallet) {
    id
    pallet {
      products {
        id
        code
      }
      id
      arrival
    }
    spot {
      spotNumber
      id
      gap {
        gapNumber
        row {
          rowNumber
          id
        }
        id
      }
    }
  }
}`
const productByCodeQuery = `query ProductByCode($code: String!) {
  productByCode(code: $code) {
    id
    code
  }
}`
export {
  addRow, 
  getAllRows, 
  updateRow, 
  addGap, 
  getGaps, 
  addSpot, 
  getAllSpots, 
  getAllPalletSpots, 
  createNewPalletSpot,
  updateToPalletSpot,
  getOnePalletSpot, 
  createNewPallet,
  updateToPallet,
  getOnePallet,
  deletePalletQuery,
  getAllProducts,
  getOneProduct,
  palletsByProductQuery,
  palletSpotsByPalletQuery,
  productByCodeQuery
};