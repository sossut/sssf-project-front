import './style.css'

import { doGraphQLFetch } from './graphql/fetch';
import { addGap, addSpot, checkToken, createPalletSpots, getGaps, login, updateRow } from './graphql/queries';
import { getRows,
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
  addEmptyPalleSpot
} from './graphql/fetches';
import loginModal from './modals/loginModal';

const apiUrl = import.meta.env.VITE_API_URL;


const token = localStorage.getItem('token');
const chckTkn = async () => {

  if (token !== null) {
    
    try {
      const isTokenValid = await doGraphQLFetch(apiUrl, checkToken, {}, token);
      if (isTokenValid.checkToken?.message === 'Valid token') {
        console.log('Token is valid');
        
      }
    } catch (error) {
      console.log(error);
    }
  }
}
chckTkn();
const openLogin = document.querySelector<HTMLButtonElement>('#open-login') as HTMLButtonElement; 
const modal2 = document.createElement('div') as HTMLDivElement;
try {
  
  openLogin.onclick = () => {
    const closeButton = document.createElement('button') as HTMLButtonElement;
    modal2.innerHTML = '';
    modal2.classList.add('modal');
    closeButton.classList.add('close-button');
    closeButton.innerHTML = 'Sulje';
    
    closeButton.addEventListener('click', () => {
      modal2.remove();
    });
    modal2.innerHTML += loginModal();
    modal2.appendChild(closeButton);
    document.body.appendChild(modal2);
    const loginForm = document.querySelector<HTMLFormElement>('#login-form') as HTMLFormElement;
    loginForm.onsubmit = async (e) => {
      e.preventDefault();
      const username = document.querySelector<HTMLInputElement>('#username') as HTMLInputElement;
      const password = document.querySelector<HTMLInputElement>('#password') as HTMLInputElement;
      try {
        
        const loginData = await doGraphQLFetch(apiUrl, login, {username: username.value, password: password.value});
        setTimeout(() => {
          modal2.remove();
        }, 1000);
        
        localStorage.setItem('token', loginData.loginUser.token);
      } catch (error) {
        console.log(error);
      }
    }
  }
} catch (error) {
  
}
//TODO add animation to dom loading
const load = document.querySelector<HTMLDivElement>('#load') as HTMLDivElement;

//TODO logout __________________________________________________________________________________________________________

// in div warehouse create a table with the number of rows and gaps and spots
getSpots();

//create the table
const warehouse = document.querySelector<HTMLDivElement>('#warehouse') as HTMLDivElement;
const createTable = async () => {
  try {
    warehouse.innerHTML = '';
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
                for (let l = 0; l < palletSpots.length; l++) {
                  if (palletSpots[l].spot.id === spots[k].id) {

                    td3.setAttribute('data-pallet-spot-id', `${palletSpots[l].id}`);

                    spotContent.classList.add('draggable');
                    spotContent.setAttribute('draggable', 'true');
                    if (palletSpots[l].pallet) {

                      spotContent.setAttribute('data-pallet-id', palletSpots[l].pallet.id);
                    }
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
              td3.classList.add('droppable');
            }
          }
        }
      }
    }
    load.style.visibility = 'hidden';
  } catch (error) {
    console.log(error)
  }
}
createTable();

// when clicking on the spot-content-button, open pallet.html and pass the spot id to the url
const spotContentButtons = document.querySelectorAll<HTMLButtonElement>('.spot-content-button');
const modal = document.createElement('div');

const buttonFunction = async (button: HTMLButtonElement) => {
  button.addEventListener('click', async () => {

    console.log('click');
    
    const palletDiv= button.parentElement;
    const spotId = button.parentElement?.parentElement?.parentElement?.getAttribute('data-spot-id') as string;
    const palletSpotId = button.parentElement?.parentElement?.getAttribute('data-pallet-spot-id') as string;
    const palletId = palletDiv?.getAttribute('data-pallet-id') as string;
    // window.location.href = `pallet.html?palletId=${palletId}&palletSpotId=${palletSpotId}&spotId=${spotId}`;
    //create a new modal with the pallet information
    modal.innerHTML = '';
    const modalCloseButton = document.createElement('button');
    
    const editPalletDiv = document.createElement('div');
    modal.classList.add('modal');
    const h3 = document.createElement('h3');
    h3.innerHTML = 'Lavan Tuotteet';
    
    const palletForm = document.createElement('form');
    const productsSelect = document.createElement('select');
    const addProductButton = document.createElement('button');
    const productsList = document.createElement('ul');
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.setAttribute('type', 'submit');
    input.setAttribute('value', 'Tallenna');
    input.setAttribute('id', 'save-pallet');
    
    label.innerHTML = 'Tuotteet';
    palletForm.classList.add('pallet-form');
    productsSelect.setAttribute('id', 'products-select');
    productsSelect.name = 'products-select';
    
    addProductButton.classList.add('add-product-button');
    addProductButton.innerHTML = 'Lisää tuote';
    label.setAttribute('for', 'products-select');
    productsList.classList.add('products-list');
    
    editPalletDiv.appendChild(h3);
    modal.appendChild(editPalletDiv);
    palletForm.appendChild(label);
    palletForm.appendChild(productsSelect);
    palletForm.appendChild(addProductButton);
    palletForm.appendChild(input);
    palletForm.appendChild(productsList);
    editPalletDiv.appendChild(palletForm);
    
    
    editPalletDiv.classList.add('pallet-modal-content');
    
    modalCloseButton.classList.add('close-button');
    modalCloseButton.innerHTML = 'Sulje';
    modalCloseButton.addEventListener('click', () => {
    
      document.body.removeChild(modal);
    }
    );
    displayProducts(productsList, palletId);
    createPalletSelect(productsSelect);
    modal.appendChild(modalCloseButton);
    document.body.appendChild(modal);
    
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
    if (palletId) {
      //create a form for changing the spot for the pallet, form has 3 inputs: row, gap and spot
      const changeSpotForm = document.createElement('form');
      const h3 = document.createElement('h3');
      const rowInput = document.createElement('input');
      const gapInput = document.createElement('input');
      const spotInput = document.createElement('input');
      const changeSpotButton = document.createElement('input');
      const rowLabel = document.createElement('label');
      const gapLabel = document.createElement('label');
      const spotLabel = document.createElement('label');
      changeSpotForm.classList.add('change-spot-form');
      h3.innerHTML = 'Vaihda paikka';
      rowLabel.innerHTML = 'Rivi';
      gapLabel.innerHTML = 'Väli';
      spotLabel.innerHTML = 'Paikka';
      rowLabel.setAttribute('for', 'row');
      gapLabel.setAttribute('for', 'gap');
      spotLabel.setAttribute('for', 'spot');
      rowInput.setAttribute('type', 'number');
      gapInput.setAttribute('type', 'number');
      spotInput.setAttribute('type', 'number');
      rowInput.setAttribute('id', 'change-row');
      gapInput.setAttribute('id', 'change-gap');
      spotInput.setAttribute('id', 'change-spot');
      changeSpotButton.setAttribute('type', 'submit');
      changeSpotButton.setAttribute('value', 'Vaihda paikka');
      editPalletDiv.appendChild(h3);
      changeSpotForm.appendChild(rowLabel);
      changeSpotForm.appendChild(rowInput);
      changeSpotForm.appendChild(gapLabel);
      changeSpotForm.appendChild(gapInput);
      changeSpotForm.appendChild(spotLabel);
      changeSpotForm.appendChild(spotInput);
      changeSpotForm.appendChild(changeSpotButton);
      editPalletDiv.appendChild(changeSpotForm);
      changeSpotForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        try {
          const row = parseInt(rowInput.value);
          const gap = parseInt(gapInput.value);
          const spot = parseInt(spotInput.value);
    
          const spotResult = await spotByRowGap(spot, gap, row);
          const palletSpot = await palletSpotBySpot(spotResult.id);
          const spotDiv = document.querySelector(`[data-spot-id="${spotResult.id}"]`);
          const btn = spotDiv?.querySelector('button') as HTMLButtonElement;
          button.parentElement?.removeAttribute('data-pallet-id');
          
          btn.parentElement?.setAttribute('data-pallet-id', palletId);
    
          if (palletSpot.pallet) {
            alert('Paikka on jo varattu');
            //TODO confirm if user wants to delete the old pallet from the spot
            return;
          }
          
          await updatePalletSpot(palletSpot.id, palletId);
          await updatePalletSpot(palletSpotId, null as unknown as string);
          updateTableCell(button);
          updateTableCell(btn);
        } catch (error) {
          console.log(error);
        }
      });
    }
    
    
    
    palletForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      try {
    
        const array = [];
        for (let i = 0; i < productsList.children.length; i++) {
          array.push(productsList.children[i].getAttribute('data-id'));
          
        }
        if (!palletId  && palletSpotId) {
    
          const pallet = await addPallet(array as string[]);
    
          await updatePalletSpot(palletSpotId, pallet.id);
          updateTableCell(button);
          return;
        }
    
        if (array.length !== 0) {
          await updatePallet(palletId, array as string[]);
        } else {
          await deletePallet(palletId);
        }
        updateTableCell(button);
      } catch (error) {
        console.log(error);
      }
    });
    
    document.addEventListener('click', async (event) => {
      if (event.target instanceof HTMLElement) {
      const deletePalletProductButton = event.target.closest('.pallet-product-delete-button');
        if (deletePalletProductButton) {
          const li = deletePalletProductButton.parentElement?.parentElement as HTMLLIElement;
          productsList.removeChild(li);
        }
      }
    });
    
    //create a form for editing the palletSpot
    
    const editPalletSpotDiv = document.createElement('div');
    const h31 = document.createElement('h3');
    const editPalletSpotForm = document.createElement('form');
    const editPalletSpotLabelTrue = document.createElement('label');
    const editPalletSpotInputTrue = document.createElement('input');
    const editPalletSpotLabelFalse = document.createElement('label');
    const editPalletSpotInputFalse = document.createElement('input');
    const editPalletSpotSubmit = document.createElement('input');
    editPalletSpotForm.classList.add('edit-pallet-spot-form');
    editPalletSpotLabelTrue.innerHTML = 'Taso';
    editPalletSpotLabelFalse.innerHTML = 'Tavallinen';
    editPalletSpotInputTrue.setAttribute('type', 'radio');
    editPalletSpotInputTrue.setAttribute('name', 'pallet-spot');
    editPalletSpotInputTrue.setAttribute('value', 'true');
    editPalletSpotInputFalse.setAttribute('type', 'radio');
    editPalletSpotInputFalse.setAttribute('name', 'pallet-spot');
    editPalletSpotInputFalse.setAttribute('value', 'false');
    
    
    editPalletSpotSubmit.setAttribute('type', 'submit');
    editPalletSpotSubmit.setAttribute('value', 'Tallenna');
    editPalletSpotSubmit.setAttribute('id', 'save-pallet-spot');
    h31.innerHTML = 'Muokkaa paikkaa';
    editPalletSpotDiv.classList.add('edit-pallet-spot-modal-content');
    editPalletSpotDiv.appendChild(h31);
    editPalletSpotForm.appendChild(editPalletSpotLabelTrue);
    editPalletSpotForm.appendChild(editPalletSpotInputTrue);
    editPalletSpotForm.appendChild(editPalletSpotLabelFalse);
    editPalletSpotForm.appendChild(editPalletSpotInputFalse);
    editPalletSpotForm.appendChild(editPalletSpotSubmit);
    editPalletSpotDiv.appendChild(editPalletSpotForm);
    try {
      
      const spot = await getSpotById(spotId);
    
      if (spot.spotNumber === 3) {
        
        modal.appendChild(editPalletSpotDiv);
      }
      const palletSpot = await getPalletSpotById(palletSpotId);
      
      if (!palletSpot.shelf) {
        editPalletSpotInputFalse.checked = true;
      } else {
        editPalletSpotInputTrue.checked = true;
      }
    } catch (error) {
      console.log(error);
    }
    
    
    editPalletSpotForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      try {
        const palletSpotForm = event.target as HTMLFormElement;
        const formData = new FormData(palletSpotForm);
        const shelf = formData.get('pallet-spot') === 'true' ? true : false;
        await updatePalletSpotShelf(palletSpotId, shelf);
        updateTableCell(button);
      } catch (error) {
        console.log(error);
      }
    });
  });
}

spotContentButtons.forEach(button => {
 buttonFunction(button);
});


const updateTableCell = async (elem: HTMLButtonElement) => {
  try {
    console.log('elem', elem);
    const spotId = elem.parentElement?.parentElement?.parentElement?.getAttribute('data-spot-id') as string;

    const palletSpotId = elem.parentElement?.parentElement?.getAttribute('data-pallet-spot-id') as string;
    
    const palletSpot = await getPalletSpotById(palletSpotId);
    const cell = document.querySelector(`[data-spot-id="${spotId}"]`) as HTMLTableElement;
    let palletId = elem.parentElement?.getAttribute('data-pallet-id') as string;
 
    console.log(elem.parentElement);

    console.log('spotId', spotId);
    console.log('palletId', palletId);
    console.log('palletSpotId', palletSpotId);
    // cell.children[1].children[0].classList.add('draggable');
    // cell.children[1].children[0].setAttribute('draggable', 'true');
    cell.children[1].children[0].setAttribute('data-pallet-id', `${palletSpot.pallet.id}`);
    cell.children[1].children[0].children[0].innerHTML = '';
    // cell.children[1].children[0].setAttribute('data-pallet-id', `${palletId}`);
    for (let i = 0; i < palletSpot.pallet.products.length; i++) {
      
      if (i === palletSpot.pallet.products.length - 1) {
        cell.children[1].children[0].children[0].innerHTML += `${palletSpot.pallet.products[i].code}`;
      } else {
        
        cell.children[1].children[0].children[0].innerHTML += `${palletSpot.pallet.products[i].code}, `;
      }
    }

  } catch (error) {
    console.log(error);
  }
}


const createPalletSelect = async (select: HTMLSelectElement) => {
  try {
    const products = await getProducts();

    for (let i = 0; i < products.length; i++) {
      const option = document.createElement('option');
      option.value = products[i].id;
      option.text = products[i].code;
      select.appendChild(option);
    }
  } catch (error) {
    console.log(error);
  }
}

const displayProducts = async (list: HTMLUListElement, palletId: string) => {
  try {

    const pallet = await getPalletById(palletId);

    list.innerHTML = '';
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
      list.appendChild(li);
    }

  } catch (error) {

  }
}

//drag and drop
const draggableElements = document.querySelectorAll('.draggable') as NodeListOf<HTMLDivElement>;
const droppableElements = document.querySelectorAll('.droppable') as NodeListOf<HTMLDivElement>;

const dragStart = (event: DragEvent) => {
  console.log(event.target);
  event.dataTransfer?.setData('pallet-id', (event.target as HTMLDivElement).getAttribute('data-pallet-id') as string);
  const draggableElement = event.target as HTMLDivElement;
  const spotId = draggableElement.parentElement?.parentElement?.getAttribute('data-spot-id') as string;
  const psId = draggableElement.parentElement?.getAttribute('data-pallet-spot-id') as string;
  event.dataTransfer?.setData('ps-id', psId);
  event.dataTransfer?.setData('spot-id', spotId);
  console.log('start', spotId);
}
const drop = async (event: DragEvent) => {
  try {
    
    event.preventDefault();
    const palletId = event.dataTransfer?.getData('pallet-id') as string;
    console.log('palletId', palletId);
    if (palletId === 'null') {
      return;
    }
    
    const div = event.target as HTMLTableElement;
    const dropzone = div.parentElement as HTMLDivElement;
    if (div.classList.contains('spot-content-button')) {
      return;
    }
    const spotIdFrom = event.dataTransfer?.getData('spot-id') as string;
    const psId = event.dataTransfer?.getData('ps-id') as string;
    const draggableElement = document.querySelector(`[data-pallet-id="${palletId}"]`) as HTMLDivElement;

    console.log(spotIdFrom);
    const draggedFromPalletSpotTd = document.querySelector(`[data-spot-id="${spotIdFrom}"]`)?.children[1] as HTMLTableElement;
    

    const pId = div.getAttribute('data-pallet-id') as string;
    if (div.classList.contains('spot-content-text')) {
      alert('Poista ensiksi lavapaikalla oleva lava');
      return;
    }
    console.log(pId);
    if (pId ) {
      alert('Poista ensiksi lavapaikalla oleva lava');
      return;
    }
    
    const spotDiv = document.createElement('div');
    spotDiv.classList.add('spot-content-div');
    const p = document.createElement('p');
    p.classList.add('spot-content-text');
    
    const button = document.createElement('button');
    button.classList.add('spot-content-button');
    
    button.innerHTML = 'Muokkaa';
    buttonFunction(button);
    spotDiv.appendChild(p);
    spotDiv.appendChild(button);
    draggedFromPalletSpotTd.appendChild(spotDiv);
    
    
    dropzone.replaceChildren(draggableElement);
    
    
    const spotIdTo = dropzone.parentElement?.getAttribute('data-spot-id') as string;
    console.log(spotIdTo);
  
    let palletSpotId = dropzone.getAttribute('data-pallet-spot-id') as string;
    console.log(palletSpotId);
    if (!palletSpotId) {
      const newPS = await addPalletSpot(spotIdTo, palletId);
      palletSpotId = newPS.id;
    }
    dropzone.setAttribute('data-pallet-spot-id', palletSpotId);
    updatePalletSpot(psId, null as unknown as string);
    updatePalletSpot(palletSpotId, palletId);
  } catch (error) {
    console.log(error);
  }

}
const dragOver = (event: DragEvent) => {
  event.preventDefault();
}
draggableElements.forEach(elem => {
  elem.addEventListener('dragstart', dragStart);
  // elem.addEventListener('dragend', dragEnd);
});

droppableElements.forEach(elem => {
  elem.addEventListener('dragover', dragOver);
  // elem.addEventListener('dragenter', dragEnter);
  // elem.addEventListener('dragleave', dragLeave);
  elem.addEventListener('drop', drop);
});


//create modal for adding new products to the database, launch from add-products button
const modal1 = document.createElement('div');
try {
  
  const addProducts = document.querySelector('#add-products') as HTMLButtonElement;
  addProducts.onclick = () => {
    modal1.classList.add('modal');
    modal1.innerHTML = '';
  
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
  
    const h3 = document.createElement('h3');
    h3.innerHTML = 'Lisää tuotteita';
  
    const closeButton = document.createElement('button');
    closeButton.classList.add('close-button');
    closeButton.innerHTML = 'Sulje';
  
    const form = document.createElement('form');
    form.classList.add('add-products-form');
  
    const codeDiv = document.createElement('div');
    codeDiv.classList.add('input-div');
  
    const label = document.createElement('label');
    label.setAttribute('for', 'product-code');
    label.innerHTML = 'Tuotekoodi';
  
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('id', 'product-code');
  
    const nameDiv = document.createElement('div');
    nameDiv.classList.add('input-div');
  
    const label1 = document.createElement('label');
    label1.setAttribute('for', 'product-name');
    label1.innerHTML = 'Tuotteen nimi';
  
    const input1 = document.createElement('input');
    input1.setAttribute('type', 'text');
    input1.setAttribute('id', 'product-name');
  
    const weightDiv = document.createElement('div');
    weightDiv.classList.add('input-div');
  
    const label2 = document.createElement('label');
    label2.setAttribute('for', 'product-weight');
    label2.innerHTML = 'Tuotteen paino';
  
    const input2 = document.createElement('input');
    input2.setAttribute('type', 'text');
    input2.setAttribute('id', 'product-weight');
    input2.value = '0';
  
    const submitButton = document.createElement('button');
    submitButton.classList.add('submit-button');
    submitButton.innerHTML = 'Lisää';
  
  
    modalContent.appendChild(h3);
    
    codeDiv.appendChild(label);
    codeDiv.appendChild(input);
    form.appendChild(codeDiv);
    nameDiv.appendChild(label1);
    nameDiv.appendChild(input1);
    form.appendChild(nameDiv);
    weightDiv.appendChild(label2);
    weightDiv.appendChild(input2);
    form.appendChild(weightDiv);
    form.appendChild(submitButton);
    modalContent.appendChild(form);
    modal1.appendChild(modalContent);
    modalContent.appendChild(closeButton);
    document.body.appendChild(modal1);
  
    //TODO add form for deleting products
    //a button for opening the form
    //a form with a list of products and a delete button
    //a button for deleting the product



    closeButton.onclick = () => {
      modal1.remove();
    }
  
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      try {
        
        const name = input1.value;
        const code = input.value;
        const weight = parseInt(input2.value);
  
        await addProduct(code, name, weight);
  
      } catch (error) {
        console.log(error);
      }
    
     });
  }
} catch (error) {
  console.log(error);
}

// if there is rows in the database, populate the form with them
const blaa = async () => {

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
        //TODO delete old rows and gaps and spots
        try {
          for (let i = 0; i < rows.length; i++) {
            const input = document.querySelector<HTMLInputElement>(`#form-row input[name=row${rows[i].rowNumber}]`) as HTMLInputElement;
            await doGraphQLFetch(apiUrl, updateRow, {updateRowId: rows[i].id, gaps: parseInt(input.value)});
            for (let j = 0; j < rows[i].gaps; j++) {
              const gapData = await doGraphQLFetch(apiUrl, addGap, {gapNumber: j +1, row: rows[i].id});
              for (let k = 0; k < gapData.createGap.spots; k++) {
                const spotData = await doGraphQLFetch(apiUrl, addSpot, {spotNumber: k + 1, gap: gapData.createGap.id});
                await addEmptyPalleSpot(spotData.createSpot.id);
              }
            }
          }
  
  
        } catch (error) {
          console.log(error);
        }
    
      })
    } catch (error) {
      console.log(error)
    }
  }
}
blaa();
const settings = () => {
  try {
    //setting up the warehouse rows
  const rowSelect = document.querySelector<HTMLSelectElement>('#select-rows') as HTMLSelectElement;

  //loop for a 100 select options
  for (let i = 1; i <= 30; i++) {
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
        let array = [];
        for (let i = 1; i <= rows; i++) {
          const input = document.querySelector<HTMLInputElement>(`#form-row input[name=row${i}]`) as HTMLInputElement;
          array.push(parseInt(input.value));
        }
        const rowNumber = parseInt(rows as unknown as string);
        console.log(typeof rowNumber);
        await doGraphQLFetch(apiUrl, createPalletSpots, {numberOfRows: rowNumber, rowData: array}, token as string);

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

// create search function for search form
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input') as HTMLInputElement;
const resultModal = document.createElement('div');
const search = async (query: string) => {
  try {
    resultModal.innerHTML = '';
    const h3 = document.createElement('h3');
    resultModal.appendChild(h3);
    h3.classList.add('result-modal-h3');
    h3.innerHTML = `Tuote: ${query}`;
    
    const resultModalContent = document.createElement('div');
    const resultModalCloseButton = document.createElement('button');

    resultModal.classList.add('modal');
    resultModalContent.classList.add('result-modal-content');

    resultModalCloseButton.classList.add('close-button');
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
