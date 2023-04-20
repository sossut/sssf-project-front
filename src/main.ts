import './style.css'

import { doGraphQLFetch } from './graphql/fetch';
import { addGap, addRow, addSpot, getAllRows, getAllSpots, getGaps, updateRow, getAllPalletSpots, getOnePalletSpot, getAllProducts, getOnePallet, getOneProduct, updateToPallet } from './graphql/queries';


const apiUrl = 'http://localhost:3000/graphql';
//get rows from the database
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
    console.log('get spots');
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
    console.log('get pallet spots');
    const palletSpots = await doGraphQLFetch(apiUrl, getAllPalletSpots, {});
    console.log(palletSpots);
    if (palletSpots) return palletSpots.palletSpots;
  } catch (error) {
    console.log(error);
  }
}
const getPalletSpotById = async (id: string) => {
  try {
    console.log('get pallet spot by id');
    const palletSpot = await doGraphQLFetch(apiUrl, getOnePalletSpot, {id});
    console.log(palletSpot);
    if (palletSpot) return palletSpot.palletSpot;
  } catch (error) {
    console.log(error);
  }
}
const getPalletById = async (id: string) => {
  try {
    console.log('get pallet by id');
    const pallet = await doGraphQLFetch(apiUrl, getOnePallet, {palletByIdId: id});

    if (pallet) return pallet.palletById;
  } catch (error) {
    console.log(error);
  }
}
const updatePallet = async (id: string, products: string[]) => {
  try {
    console.log('update pallet');
    const pallet = await doGraphQLFetch(apiUrl, updateToPallet, {updatePalletId: id, products: products});

    if (pallet) return pallet.updatePallet;
  } catch (error) {
    console.log(error);
  }
}
const getProducts = async () => {
  try {
    console.log('get products');
    const products = await doGraphQLFetch(apiUrl, getAllProducts, {});

    if (products) return products.products;
  } catch (error) {
    console.log(error);
  }
}
const getProductById = async (id: string) => {
  try {
    console.log('get product by id');
    const product = await doGraphQLFetch(apiUrl, getOneProduct, {productByIdId: id});

    if (product) return product.productById;
  } catch (error) {
    console.log(error);
  }
}

// in div warehouse create a table with the number of rows and gaps and spots
await getSpots();
//create the table
const createTable = async () => {
  try {
    const warehouse = document.querySelector<HTMLDivElement>('#warehouse') as HTMLDivElement;
    const table = document.createElement('table');
    const tbody = document.createElement('tbody');
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
              // const td = document.createElement('td');

              // td.innerHTML = `${spots.spots[k].spotNumber}`;
              // const td2 = document.createElement('td');
              // tr.appendChild(td);
              
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
                  
                } else {
                  
                  spotContentText.innerHTML = 'Paikka';
                }
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
              td3.setAttribute('data-spot-id', `${spots[k].id}`);
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
    const palletId = palletDiv?.getAttribute('data-pallet-id') as string;
    window.location.href = `pallet.html?palletId=${palletId}`;
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
console.log(palletId);
const displayProducts = async () => {
  try {

    const pallet = await getPalletById(palletId);
    console.log(pallet);
    productsList.innerHTML = '';
    for (let i = 0; i < pallet.products.length; i++) {
      const li = document.createElement('li');
      li.setAttribute('data-id', pallet.products[i].id);
      li.innerHTML = `${pallet.products[i].code}`;
      productsList.appendChild(li);
    }
  } catch (error) {
    console.log(error);
  }
}
addProductButton.addEventListener('click', async (event) => {
  event.preventDefault();
  try {

    const li = document.createElement('li');
    const productId = productsSelect.value
    const product = await getProductById(productId);
    li.innerHTML = `${product.code}`;
    li.setAttribute('data-id', product.id);
    productsList.appendChild(li);
  } catch (error) {
    console.log(error);
  }
});
palletForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    const array = [];
    for (let i = 0; i < productsList.children.length; i++) {
      array.push(productsList.children[i].getAttribute('data-id'));

    }
    await updatePallet(palletId, array as string[]);
  } catch (error) {
    console.log(error);
  }
});

await displayProducts();
await createPalletSelect();
// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
//   <div>
//     <a href="https://vitejs.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://www.typescriptlang.org/" target="_blank">
//       <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
//     </a>
//     <h1>Vite + TypeScript</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite and TypeScript logos to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
