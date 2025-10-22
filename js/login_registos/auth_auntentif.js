/* auth.js - vincula #botonLogin con el modal y envía login/registro sin recargar */
(() => {
  const modal = document.getElementById('authModal');
  const btnOpen = document.getElementById('botonLogin');
  const btnClose = document.getElementById('authClose');
  const backdrop = document.getElementById('authBackdrop');
  const tabs = document.querySelectorAll('.auth-tab');
  const views = document.querySelectorAll('.auth-view');

  // abrir/cerrar modal
  btnOpen.addEventListener('click', () => {
    modal.style.display = 'block';
    // Rellenar el campo de email/username si hay un identificador recordado
    if (window.rememberedIdentifier) {
      document.querySelector('#loginView input[name="identifier"]').value = window.rememberedIdentifier;
      document.querySelector('#loginView input[name="password"]').focus(); // Poner el foco en la contraseña
    }
  });
  btnClose.addEventListener('click', () => modal.style.display = 'none');
  backdrop.addEventListener('click', () => modal.style.display = 'none');

  // cambiar tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const viewId = tab.dataset.view;
      views.forEach(v => v.style.display = v.id === viewId ? 'block' : 'none');
    });
  });

  // helper: mostrar mensaje en modal
  const showMsg = (el, msg, ok=false) => {
    el.textContent = msg;
    el.className = 'auth-msg ' + (ok ? 'success' : 'error');
  };

  // password fuerte
  const strongPassword = pwd => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(pwd);

  // LOGIN
  const loginForm = document.getElementById('loginForm');
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const msg = document.getElementById('loginMsg');
    showMsg(msg, 'Comprobando...', true);

    const form = new FormData(loginForm);
    // No es necesario cambiar el nombre del campo aquí, ya que FormData usa los atributos 'name' del HTML
    // El campo en el HTML ya se cambió a 'identifier'
    const res = await fetch('php/login_seguridad/login.php', { method:'POST', body:form });
    const json = await res.json();

    if(json.success){
      showMsg(msg, json.message, true);
      // Actualizar UI y luego cerrar modal
      if (typeof verificarEstadoSesion === 'function') {
        await verificarEstadoSesion(); // Esperar a que la UI se actualice
        modal.style.display = 'none'; // Cerrar modal después de la actualización
      } else {
        location.reload();
      }
    } else {
      showMsg(msg, json.message);
    }
  });

  // REGISTER
  const registerForm = document.getElementById('registerForm');
  registerForm.addEventListener('submit', async e => {
    e.preventDefault();
    const msg = document.getElementById('registerMsg');
    const username = registerForm.username.value.trim();
    const email = registerForm.email.value.trim();
    const pwd = registerForm.password.value.trim();
    const pwd2 = registerForm.password_confirm.value.trim();

    if(!username){ showMsg(msg,'Nombre obligatorio'); return; }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ showMsg(msg,'Email inválido'); return; }
    if(pwd !== pwd2){ showMsg(msg,'Las contraseñas no coinciden'); return; }
    if(!strongPassword(pwd)){ showMsg(msg,'Contraseña insegura'); return; }

    showMsg(msg, 'Creando cuenta...', true);
    const form = new FormData(registerForm);
    const res = await fetch('php/login_seguridad/registros.php', { method:'POST', body:form });
    const json = await res.json();

    if(json.success){
      showMsg(msg,json.message,true);
      setTimeout(() => {
        // cambiar a login
        tabs.forEach(t => t.classList.remove('active'));
        tabs[0].classList.add('active');
        views.forEach(v => v.style.display = v.id === 'loginView' ? 'block' : 'none');
        document.querySelector('#loginView input[name="identifier"]').value = email;
        document.querySelector('#loginView input[name="password"]').focus();
      }, 800);
    } else {
      showMsg(msg,json.message);
    }
  });

  // Toggle password visibility
  const togglePasswordElements = document.querySelectorAll('.toggle-password');

  togglePasswordElements.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const passwordField = toggle.parentElement.querySelector('input[type="password"], input[type="text"]');
      
      if (passwordField) {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        const visibilityOffIcon = toggle.querySelector('.visibility-icon:first-child');
        const visibilityOnIcon = toggle.querySelector('.visibility-icon.hidden');

        if (type === 'password') {
          visibilityOffIcon.classList.remove('hidden');
          visibilityOnIcon.classList.add('hidden');
        } else {
          visibilityOffIcon.classList.add('hidden');
          visibilityOnIcon.classList.remove('hidden');
        }
      }
    });
  });

})();
