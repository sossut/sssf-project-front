export default function () {
  const modalHtml = `

        <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Login</h5>

        </div>
        <div class="modal-body">
        <form id="login-form">
            <div class="mb-3">
            <label for="username" >Käyttäjänimi:</label>
            <input type="username" id="username">
            </div>
            <div class="mb-3">
            <label for="password" >Salasana:</label>
            <input type="password" id="password">
            </div>
         <button type="submit" id="login">Login</button>
        </form>
        </div>

    `;
  return modalHtml;
}
//         <button type="button" class="btn-close" data-bs-dismiss="modal"></button>