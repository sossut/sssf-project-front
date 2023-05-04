import { doGraphQLFetch } from './fetch';
import { 

  getAllRows, 
  getAllSpots, 

  getAllPalletSpots,
  getOnePalletSpot, 
  getAllProducts, 
  getOnePallet, 
  getOneProduct, 
  updateToPallet, 
  deletePalletQuery, 
  createNewPalletSpot, 
  createNewPallet, 
  updateToPalletSpot, 
  palletsByProductQuery, 
  palletSpotsByPalletQuery, 
  productByCodeQuery, 
  updateToPalletSpotShelf, 
  getOneSpot, 
  createProduct, 
  spotByRowGapQuery,
  palletSpotBySpotQuery,
  createEmptyPalletSpot,
  deleteProductQuery
} from './queries';
const apiUrl = import.meta.env.VITE_API_URL;

const getRows = async () => {
  try {
    const rows = await doGraphQLFetch(apiUrl, getAllRows, {});

    if (rows) return rows.rows;
  } catch (error) {
    console.log(error);
  }
}
const getSpots = async () => {
  try {

    let spots;
    if (!localStorage.getItem('spots')) {
      spots = await doGraphQLFetch(apiUrl, getAllSpots, {});

      localStorage.setItem('spots', JSON.stringify(spots));
      
    }
    let spotsString = localStorage.getItem('spots') as string;
    spots = JSON.parse(spotsString) || '';
    if (spots) return spots.spots;
  } catch (error) {
    console.log(error);
  }
}
const getSpotById = async (id: string) => {
  try {

    const spot = await doGraphQLFetch(apiUrl, getOneSpot, {spotByIdId: id});

    if (spot) return spot.spotById;
  } catch (error) {
    console.log(error);
  }
}

const getPalletSpots = async () => {
  try {
    const palletSpots = await doGraphQLFetch(apiUrl, getAllPalletSpots, {});

    if (palletSpots) return palletSpots.palletSpots;
  } catch (error) {
    console.log(error);
  }
}
const addPalletSpot = async (spotId: string, palletId: string) => {
  try {
    const token = localStorage.getItem('token') as string;
    const palletSpot = await doGraphQLFetch(apiUrl, createNewPalletSpot, {spot: spotId, pallet: palletId}, token);
    console.log(palletSpot);
    if (palletSpot) return palletSpot.createPalletSpot;
  } catch (error) {
    console.log(error);
  }
}
const updatePalletSpot = async (psId: string, palletId: string) => {
  try {
    const token = localStorage.getItem('token') as string;
    const palletSpot = await doGraphQLFetch(apiUrl, updateToPalletSpot, {updatePalletSpotId: psId, pallet: palletId}, token);
    console.log(palletSpot);
    if (palletSpot) return palletSpot.updatePalletSpot;
  } catch (error) {
    console.log(error);
  }
}
const updatePalletSpotShelf = async (psId: string, shelf: boolean) => {
  try {
    const token = localStorage.getItem('token') as string;
    const palletSpot = await doGraphQLFetch(apiUrl, updateToPalletSpotShelf, {updatePalletSpotId: psId, shelf: shelf}, token);

    if (palletSpot) return palletSpot.updatePalletSpot;
  } catch (error) {
    console.log(error);
  }
}

const getPalletSpotById = async (id: string) => {
  try {

    const palletSpot = await doGraphQLFetch(apiUrl, getOnePalletSpot, {palletSpotByIdId: id});

    if (palletSpot) return palletSpot.palletSpotById;
  } catch (error) {
    console.log(error);
  }
}
const getPalletById = async (id: string) => {
  try {

    const pallet = await doGraphQLFetch(apiUrl, getOnePallet, {palletByIdId: id});

    if (pallet) return pallet.palletById;
  } catch (error) {
    console.log(error);
  }
}
const addPallet = async (products: Array<string>) => {
  try {
    const token = localStorage.getItem('token') as string;
    const pallet = await doGraphQLFetch(apiUrl, createNewPallet, {products: products }, token);
    if (pallet) return pallet.createPallet;
  } catch (error) {
    console.log(error);
  }
}
const updatePallet = async (id: string, products: string[]) => {
  try {
    const token = localStorage.getItem('token') as string;
    const pallet = await doGraphQLFetch(apiUrl, updateToPallet, {updatePalletId: id, products: products}, token);

    if (pallet) return pallet.updatePallet;
  } catch (error) {
    console.log(error);
  }
}
const deletePallet = async (id: string) => {
  try {
    const token = localStorage.getItem('token') as string;
    const pallet = await doGraphQLFetch(apiUrl, deletePalletQuery, {deletePalletId: id}, token);

    if (pallet) return pallet.deletePallet;
  } catch (error) {
    console.log(error);
  }
}
const getProducts = async () => {
  try {
    
    const products = await doGraphQLFetch(apiUrl, getAllProducts, {});

    if (products) return products.products;
  } catch (error) {
    console.log(error);
  }
}
const getProductById = async (id: string) => {
  try {

    const product = await doGraphQLFetch(apiUrl, getOneProduct, {productByIdId: id});

    if (product) return product.productById;
  } catch (error) {
    console.log(error);
  }
}

const addProduct = async (code: string, name: string, weight: number) => {
  try {
    const token = localStorage.getItem('token') as string;
    const product = await doGraphQLFetch(apiUrl, createProduct, {name: name, weight: weight, code: code}, token);

    if (product) return product.createProduct;
  }
  catch (error) {
    console.log(error);
  }
}

const palletsByProduct = async (productId: string) => {
  try {

    const pallets = await doGraphQLFetch(apiUrl, palletsByProductQuery, {product: productId});

    if (pallets) return pallets.palletsByProduct;
  } catch (error) {
    console.log(error);
  }
}

const palletSpotsByPallet = async (palletId: string) => {
  try {

    const palletSpots = await doGraphQLFetch(apiUrl, palletSpotsByPalletQuery, {pallet: palletId});

    if (palletSpots) return palletSpots.palletSpotsByPallet;
  } catch (error) {
    console.log(error);
  }
}

const productByCode = async (code: string) => {
  try {

    const product = await doGraphQLFetch(apiUrl, productByCodeQuery, {code: code});

    if (product) return product.productByCode;
  } catch (error) {
    console.log(error);
  }
}
const spotByRowGap = async (spotNumber: number, gapNumber: number, rowNumber: number) => {
  try {

    const spot = await doGraphQLFetch(apiUrl, spotByRowGapQuery, {spotNumber: spotNumber, gapNumber: gapNumber, rowNumber: rowNumber});

    if (spot) return spot.spotByRowGap;
  } catch (error) {
    console.log(error);
  }
}
const palletSpotBySpot = async (spotId: string) => {
  try {

    const palletSpot = await doGraphQLFetch(apiUrl, palletSpotBySpotQuery, {spot: spotId});

    if (palletSpot) return palletSpot.palletSpotBySpot;
  } catch (error) {
    console.log(error);
  }
}
const addEmptyPalleSpot = async (spotId: string) => {
  try {
    const token = localStorage.getItem('token') as string;
    const palletSpot = await doGraphQLFetch(apiUrl, createEmptyPalletSpot, {spot: spotId}, token);

    if (palletSpot) return palletSpot.createPalletSpot;
  } catch (error) {
    console.log(error);
  }
}
const deleteProduct = async (id: string) => {
  try {
    const token = localStorage.getItem('token') as string;
    const product = await doGraphQLFetch(apiUrl, deleteProductQuery, {deleteProductId: id}, token);

    if (product) return product.deleteProduct;
  } catch (error) {
    console.log(error);
  }
}

export {
  getRows,
  getSpots,
  getSpotById,
  getPalletSpots,
  addPalletSpot,
  updatePalletSpot,
  updatePalletSpotShelf,
  getPalletSpotById,
  getPalletById,
  addPallet,
  updatePallet,
  deletePallet,
  getProducts,
  getProductById,
  addProduct,
  palletsByProduct,
  palletSpotsByPallet,
  productByCode,
  spotByRowGap,
  palletSpotBySpot,
  addEmptyPalleSpot,
  deleteProduct
}