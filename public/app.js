async function getJSON(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error al cargar ${url}`);
  }

  return response.json();
}

function renderClientes(clientes) {
  const container = document.getElementById('clientes');
  container.innerHTML = clientes
    .map(
      (cliente) => `
        <article class="card">
          <h3>${cliente.nombre}</h3>
          <p>${cliente.correo}</p>
          <p>Cliente #${cliente.id}</p>
        </article>
      `
    )
    .join('');
}

function renderPlatos(platos) {
  const container = document.getElementById('platos');
  container.innerHTML = platos
    .map(
      (plato) => `
        <article class="card">
          <h3>${plato.nombre}</h3>
          <p>${plato.descripcion}</p>
          <p class="price">S/ ${Number(plato.precio).toFixed(2)}</p>
        </article>
      `
    )
    .join('');
}

async function loadData() {
  const status = document.getElementById('status');

  try {
    const [clientes, platos] = await Promise.all([
      getJSON('/clientes'),
      getJSON('/platos')
    ]);

    renderClientes(clientes);
    renderPlatos(platos);
    status.textContent = `Online: ${clientes.length} clientes y ${platos.length} platos cargados.`;
  } catch (error) {
    status.textContent = 'No fue posible cargar los datos del restaurante.';
    console.error(error);
  }
}

loadData();
