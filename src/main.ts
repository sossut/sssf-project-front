import './style.css'

import { doGraphQLFetch } from './graphql/fetch';
import { addGap, addRow, addSpot, getAllRows, getAllSpots, getGaps, updateRow, getAllPalletSpots, getOnePalletSpot, getAllProducts, getOnePallet, getOneProduct, updateToPallet, deletePalletQuery, createNewPalletSpot, createNewPallet, updateToPalletSpot, palletsByProductQuery, palletSpotsByPalletQuery, productByCodeQuery } from './graphql/queries';


const apiUrl = 'http://localhost:3000/graphql';

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

    const palletSpot = await doGraphQLFetch(apiUrl, createNewPalletSpot, {spot: spotId, pallet: palletId});
    console.log(palletSpot);
    if (palletSpot) return palletSpot.createPalletSpot;
  } catch (error) {
    console.log(error);
  }
}
const updatePalletSpot = async (psId: string, palletId: string) => {
  try {

    const palletSpot = await doGraphQLFetch(apiUrl, updateToPalletSpot, {updatePalletSpotId: psId, pallet: palletId});
    console.log(palletSpot);
    if (palletSpot) return palletSpot.updatePalletSpot;
  } catch (error) {
    console.log(error);
  }
}
const getPalletSpotById = async (id: string) => {
  try {

    const palletSpot = await doGraphQLFetch(apiUrl, getOnePalletSpot, {id});
    console.log(palletSpot);
    if (palletSpot) return palletSpot.palletSpot;
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
    const pallet = await doGraphQLFetch(apiUrl, createNewPallet, {products: products });
    if (pallet) return pallet.createPallet;
  } catch (error) {
    console.log(error);
  }
}
const updatePallet = async (id: string, products: string[]) => {
  try {

    const pallet = await doGraphQLFetch(apiUrl, updateToPallet, {updatePalletId: id, products: products});

    if (pallet) return pallet.updatePallet;
  } catch (error) {
    console.log(error);
  }
}
const deletePallet = async (id: string) => {
  try {

    const pallet = await doGraphQLFetch(apiUrl, deletePalletQuery, {deletePalletId: id});

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

// in div warehouse create a table with the number of rows and gaps and spots
await getSpots();
//create the table
const warehouse = document.querySelector<HTMLDivElement>('#warehouse') as HTMLDivElement;
const createTable = async () => {
  try {
    const table = document.createElement('table');
    table.classList.add('warehouse-table');
    const tbody = document.createElement('tbody');
    tbody.classList.add('warehouse-tbody');
    warehouse.appendChild(table);
    table.appendChild(tbody);
    const palletSpots = await getPalletSpots();
    
    const rows = await getRows();
    for (let i = 0; i < rows.length; i++) {
      const tr = document.createElement('tr');
      const thRow = document.createElement('th');
      thRow.classList.add('row-header');

      thRow.innerHTML = `Lavarivi ${rows[i].rowNumber}`;
      tr.appendChild(thRow);
      tr.classList.add('column');
      tbody.appendChild(tr);
      const gaps = await doGraphQLFetch(apiUrl, getGaps, {});

      for (let j = 0; j < gaps.gaps.length; j++) {

        if (gaps.gaps[j].row.id === rows[i].id) {
          const thGap = document.createElement('th');
          thGap.innerHTML = `Väli ${gaps.gaps[j].gapNumber}`;
          thGap.classList.add('gap-header');

          tr.appendChild(thGap);
          const spots = await getSpots();

          for (let k = 0; k < spots.length; k++) {
            if (spots[k].gap.id === gaps.gaps[j].id) {
              
              // create a new table with the number of the spot on the left and Paikka on the right
              const table2 = document.createElement('table');
              const tbody2 = document.createElement('tbody');
              
              const tr2 = document.createElement('tr');
              const td2 = document.createElement('td');
              td2.innerHTML = `${spots[k].spotNumber}`;
              const td3 = document.createElement('td');
              const spotContent = document.createElement('div');
              spotContent.classList.add('spot-content-div');
              const spotContentText = document.createElement('p');
              spotContentText.classList.add('spot-content-text');
              const spotContentButton = document.createElement('button');
              spotContentButton.innerHTML = 'Muokkaa';
              spotContentButton.classList.add('spot-content-button');
              spotContentButton.addEventListener('click', () => {});
              try {

                if (palletSpots[0].spot.id === spots[k].id) {

                  td3.setAttribute('data-pallet-spot-id', `${palletSpots[0].id}`);
                }

                
                for (let l = 0; l < palletSpots.length; l++) {
                  if (palletSpots[l].spot.id === spots[k].id) {
                    spotContent.setAttribute('data-pallet-id', palletSpots[l].pallet.id);
                    for (let m = 0; m < palletSpots[l].pallet.products.length; m++) {
                      if (m === palletSpots[l].pallet.products.length - 1) {
                        spotContentText.innerHTML += `${palletSpots[l].pallet.products[m].code}`;
                      } else {
                        
                        spotContentText.innerHTML += `${palletSpots[l].pallet.products[m].code}, `;
                      }
                    }
                    
                  } 
                   
                }
                
                // 
              } catch (error) {
                console.log(error);
              }
              spotContent.appendChild(spotContentText);
              spotContent.appendChild(spotContentButton);
              td3.appendChild(spotContent);
              tr2.appendChild(td2);
              tr2.appendChild(td3);
              tbody2.appendChild(tr2);
              table2.appendChild(tbody2);
              thGap.appendChild(table2);
              table2.classList.add('spot-table');
              tr2.classList.add('spot-row');
              td2.classList.add('spot-number');
              td3.classList.add('spot-content');
              tr2.setAttribute('data-spot-id', `${spots[k].id}`);
            }
          }
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
}
await createTable();


// when clicking on the spot-content-button, open pallet.html and pass the spot id to the url
const spotContentButtons = document.querySelectorAll<HTMLButtonElement>('.spot-content-button');
spotContentButtons.forEach(button => {
  button.addEventListener('click', () => {
    
    const palletDiv= button.parentElement;
    const spotId = button.parentElement?.parentElement?.parentElement?.getAttribute('data-spot-id') as string;
    const palletSpotId = button.parentElement?.parentElement?.getAttribute('data-pallet-spot-id') as string;
    const palletId = palletDiv?.getAttribute('data-pallet-id') as string;
    window.location.href = `pallet.html?palletId=${palletId}&palletSpotId=${palletSpotId}&spotId=${spotId}`;
  });
});



// if there is rows in the database, populate the form with them
if (await getRows()) {
  try {
    
    const form = document.querySelector<HTMLFormElement>('#form-row') as HTMLFormElement;
    const rows = await getRows();
    for (let i = 0; i < rows.length; i++) {
      const label = document.createElement('label');
      label.htmlFor = `row${rows[i].rowNumber}`;
      label.innerHTML = `Lavarivi ${rows[i].rowNumber} välit`;
      const input1 = document.createElement('input');
      input1.type = 'text';
      input1.name = `row${rows[i].rowNumber}`;
      input1.placeholder = `row${rows[i].rowNumber}`;
      input1.value = rows[i].gaps;
      form.appendChild(label);
      form.appendChild(input1);
    }
    const input2 = document.createElement('input');
    input2.type = 'submit';
    input2.value = 'Lähetä';
    input2.id = 'submit-rows';
    input2.disabled = true;
    form.appendChild(input2);
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      try {
        for (let i = 0; i < rows.length; i++) {
          const input = document.querySelector<HTMLInputElement>(`#form-row input[name=row${rows[i].rowNumber}]`) as HTMLInputElement;
          const rowData = await doGraphQLFetch(apiUrl, updateRow, {updateRowId: rows[i].id, gaps: parseInt(input.value)});
          for (let j = 0; j < rows[i].gaps; j++) {
            const gapData = await doGraphQLFetch(apiUrl, addGap, {gapNumber: j +1, row: rows[i].id});
            for (let k = 0; k < gapData.createGap.spots; k++) {
              const spotData = await doGraphQLFetch(apiUrl, addSpot, {spotNumber: k + 1, gap: gapData.createGap.id});
            }
          }
        }
        localStorage.removeItem('spots');
        await getSpots();
      } catch (error) {
        console.log(error);
      }
  
    })
  } catch (error) {
    console.log(error)
  }
}
const settings = () => {
  try {
    //setting up the warehouse rows
  const rowSelect = document.querySelector<HTMLSelectElement>('#select-rows') as HTMLSelectElement;

  //loop for a 100 select options
  for (let i = 1; i <= 100; i++) {
    const option = document.createElement('option');
    option.value = i.toString();
    option.text = i.toString();
    rowSelect.appendChild(option);
  }
  const form = document.querySelector<HTMLFormElement>('#form-row') as HTMLFormElement;

  rowSelect.addEventListener('change', (event) => {
    form.innerHTML = '';
    const rows = (event.target as HTMLSelectElement).value as unknown as number;
    //depending on what was chosen in the select, the number of fields in a form will be created
    for (let i = 1; i <= rows; i++) {
      const label = document.createElement('label');
      label.htmlFor = `row${i}`;
      label.innerHTML = `Lavarivi ${i} välit`;
      const input1 = document.createElement('input');
      input1.type = 'text';
      input1.name = `row${i}`;
      input1.placeholder = `row${i}`;
      form.appendChild(label);
      form.appendChild(input1);
    }
    const input2 = document.createElement('input');
    input2.type = 'submit';
    input2.value = 'Lähetä';
    input2.id = 'submit-rows';
    form.appendChild(input2);
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      try {
        for (let i = 1; i <= rows; i++) {
          const input = document.querySelector<HTMLInputElement>(`#form-row input[name=row${i}]`) as HTMLInputElement;
          const rowData = await doGraphQLFetch(apiUrl, addRow, {rowNumber: i, gaps: parseInt(input.value)});
          
        }
        const dbRows = await getRows();
        for (let i = 0; i < dbRows.length; i++) {
          for (let j = 0; j < dbRows[i].gaps; j++) {
            const gapData = await doGraphQLFetch(apiUrl, addGap, {gapNumber: j + 1, row: dbRows[i].id});
            for (let k = 0; k < gapData.createGap.spots; k++) {
              const spotData = await doGraphQLFetch(apiUrl, addSpot, {spotNumber: k + 1, gap: gapData.createGap.id});
            }
          }
        }
        localStorage.removeItem('spots');
        await getSpots();
      } catch (error) {
        console.log(error);
      }

    });
    
});
  } catch (error) {
    console.log(error);
  }
}

settings();

//pallet
//populate the pallet form with the data from the database
const palletForm = document.querySelector<HTMLFormElement>('#form-pallet') as HTMLFormElement;
const productsSelect = document.querySelector<HTMLSelectElement>('#products') as HTMLSelectElement;

const addProductButton = document.querySelector<HTMLButtonElement>('#add-product') as HTMLButtonElement;
const productsList = document.querySelector<HTMLUListElement>('#products-on-pallet') as HTMLUListElement;
const createPalletSelect = async () => {
  try {
    const products = await getProducts();
    for (let i = 0; i < products.length; i++) {
      const option = document.createElement('option');
      option.value = products[i].id;
      option.text = products[i].code;
      productsSelect.appendChild(option);
    }
  } catch (error) {
    console.log(error);
  }
}
//get the pallet id from the url
const queryString = document.location.search;
const urlParams = new URLSearchParams(queryString);
const palletId = urlParams.get('palletId') as string;
const spotId = urlParams.get('spotId') as string;
const palletSpotId = urlParams.get('palletSpotId') as string;

const displayProducts = async () => {
  try {

    const pallet = await getPalletById(palletId);

    productsList.innerHTML = '';
    for (let i = 0; i < pallet.products.length; i++) {
      const div = document.createElement('div');
      const li = document.createElement('li');
      const productCode = document.createElement('p');
      const deleteButton = document.createElement('button');
      li.setAttribute('data-id', pallet.products[i].id);
      div.classList.add('pallet-product-div');
      productCode.innerHTML = `${pallet.products[i].code}`;
      deleteButton.innerHTML = 'Poista';
      deleteButton.classList.add('pallet-product-delete-button');
      div.appendChild(productCode);
      div.appendChild(deleteButton);
      li.appendChild(div);
      productsList.appendChild(li);
    }

  } catch (error) {
    console.log(error);
  }
}

try {
  addProductButton.addEventListener('click', async (event) => {
    event.preventDefault();
    try {
  
      const productId = productsSelect.value;
      const product = await getProductById(productId);
      for (let i = 0; i < productsList.children.length; i++) {
        if (productsList.children[i].getAttribute('data-id') === productId) {
          console.log('product already on the list');
          return;
        }
      }
      const li = document.createElement('li');
      const div = document.createElement('div');
      const productCode = document.createElement('p');
      const deleteButton = document.createElement('button');
      div.classList.add('pallet-product-div');
      productCode.innerHTML = `${product.code}`;
      deleteButton.innerHTML = 'Poista';
      deleteButton.classList.add('pallet-product-delete-button');
      div.appendChild(productCode);
      div.appendChild(deleteButton);
      li.setAttribute('data-id', product.id);
      li.appendChild(div);
      productsList.appendChild(li);
    } catch (error) {
      console.log(error);
    }
  });
  
} catch (error) {
  console.log(error);
}
try {
  palletForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  try {

    const array = [];
    for (let i = 0; i < productsList.children.length; i++) {
      array.push(productsList.children[i].getAttribute('data-id'));
      
    }
    if (palletId === 'null' && palletSpotId !== 'null') {

      const pallet = await addPallet(array as string[]);

      const palletSpot = await updatePalletSpot(palletSpotId, pallet.id);
      return;
    }
    
    if (palletSpotId === 'null' && palletId === 'null') {

      const pallet = await addPallet(array as string[]);
      const palletSpot = await addPalletSpot(spotId, pallet.id);
      return;
    }
    if (array.length !== 0) {
      await updatePallet(palletId, array as string[]);
    } else {
      await deletePallet(palletId);
    }
  } catch (error) {
    console.log(error);
  }
});
} catch (error) {
  console.log(error);
}  

document.addEventListener('click', async (event) => {
  if (event.target instanceof HTMLElement) {
  const deletePalletProductButton = event.target.closest('.pallet-product-delete-button');
    if (deletePalletProductButton) {
      const li = deletePalletProductButton.parentElement?.parentElement as HTMLLIElement;
      productsList.removeChild(li);
    }
  }
});

// create search function for search form
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input') as HTMLInputElement;
const resultModal = document.createElement('div');
const search = async (query: string) => {
  try {
    const h3 = document.createElement('h3');
    resultModal.appendChild(h3);
    h3.classList.add('result-modal-h3');
    h3.innerHTML = `Tuote: ${query}`;
    
    const resultModalContent = document.createElement('div');
    const resultModalCloseButton = document.createElement('button');

    resultModal.classList.add('result-modal');
    resultModalContent.classList.add('result-modal-content');

    resultModalCloseButton.classList.add('result-modal-close-button');
    resultModalCloseButton.innerHTML = 'Sulje';
    resultModalCloseButton.addEventListener('click', () => {
      document.body.removeChild(resultModal);
    }
    );
    resultModalContent.appendChild(resultModalCloseButton);

    resultModal.appendChild(resultModalContent);
    document.body.appendChild(resultModal);
    // table for pallets
    const palletsTable = document.createElement('table');
  
    const palletsTableBody = document.createElement('tbody');
    const palletsTableHeadRow = document.createElement('tr');
    const palletsTableHeadRowCell1 = document.createElement('th');
    const palletsTableHeadRowCell2 = document.createElement('th');
    const palletsTableHeadRowCell3 = document.createElement('th');

    const palletsTableHeadRowCell5 = document.createElement('th');
    
    palletsTableHeadRowCell1.innerHTML = 'Rivi';
    palletsTableHeadRowCell2.innerHTML = 'Väli';
    palletsTableHeadRowCell3.innerHTML = 'Paikka';

    palletsTableHeadRowCell5.innerHTML = 'Tulopvm';
 


    palletsTableHeadRow.appendChild(palletsTableHeadRowCell1);
    palletsTableHeadRow.appendChild(palletsTableHeadRowCell2);
    palletsTableHeadRow.appendChild(palletsTableHeadRowCell3);
    palletsTableHeadRow.appendChild(palletsTableHeadRowCell5);
    palletsTableBody.appendChild(palletsTableHeadRow);

    palletsTable.appendChild(palletsTableBody);
    palletsTable.classList.add('pallets-table');
    resultModalContent.appendChild(palletsTable);

    const productId = await productByCode(query);
    const pallets = await palletsByProduct(productId.id);
    for (let i=0; i < pallets.length; i++) {

      const palletSpot = await palletSpotsByPallet(pallets[i].id);


      // populate pallets table, rowNumber under row, gapNumber under gap, spotNumber under spot
      
      const palletsTableBodyRow = document.createElement('tr');
      const palletsTableBodyRowCell1 = document.createElement('td');
      const palletsTableBodyRowCell2 = document.createElement('td');
      const palletsTableBodyRowCell3 = document.createElement('td');
      const palletsTableBodyRowCell5 = document.createElement('td');

      palletsTableBodyRowCell1.innerHTML = `${palletSpot[0].spot.gap.row.rowNumber}`;
      palletsTableBodyRowCell2.innerHTML = `${palletSpot[0].spot.gap.gapNumber}`;
      palletsTableBodyRowCell3.innerHTML = `${palletSpot[0].spot.spotNumber}`;
      palletsTableBodyRowCell5.innerHTML = `${palletSpot[0].pallet.arrival.split('T')[0]}`;

      palletsTableBodyRow.appendChild(palletsTableBodyRowCell1);
      palletsTableBodyRow.appendChild(palletsTableBodyRowCell2);
      palletsTableBodyRow.appendChild(palletsTableBodyRowCell3);
      palletsTableBodyRow.appendChild(palletsTableBodyRowCell5);
      palletsTableBody.appendChild(palletsTableBodyRow);


    }


  } catch (error) {
    console.log(error);
  }
}

try {
  searchForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const query = searchInput.value;
    await search(query);

  });
} catch (error) {
  console.log(error);
}


await displayProducts();
await createPalletSelect();
