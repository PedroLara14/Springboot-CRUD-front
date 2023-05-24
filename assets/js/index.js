async function getProducts() {
  try {
    const data = await fetch("http://localhost:8090/users");

    const res = await data.json();

    return res;
  } catch (error) {
    console.log(error);
  }
}

function printUsers(db) {
  const usersHTML = document.querySelector(".user-list");

  let html = "";
  for (const user of db.users) {
    html += `
    <tr data-id="${user.id}">
      <td>${user.identificacion}</td>
      <td>${user.nombre}</td>
      <td>${user.email}</td>
      <td>${user.telefono}</td>
      <td>
        <button type="button" class="btn btn-warning btn-sm btn-editar">Editar</button>
      </td>
      <td>
        <button type="button" class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">Eliminar</button>
      </td>
    </tr>
    `;
  }

  usersHTML.innerHTML = html;
}

async function addNewUser() {
  try {
    // Capturar los valores de los campos del formulario
    var identificacion = document.getElementById("identificacion").value;
    var nombre = document.getElementById("nombre").value;
    var email = document.getElementById("email").value;
    var telefono = document.getElementById("telefono").value;

    // Verificar que todos los campos estén llenos
    if (
      identificacion === "" ||
      nombre === "" ||
      email === "" ||
      telefono === ""
    ) {
      throw new Error("Por favor, complete todos los campos del formulario");
    }


    // Crear un objeto con los datos del nuevo usuario
    var nuevoUsuario = {
      identificacion: identificacion,
      nombre: nombre,
      email: email,
      telefono: telefono,
    };

    // Realizar la solicitud POST a la API
    const response = await fetch("http://localhost:8090/saveuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoUsuario),
    });

    if (response.ok) {
      alert("Usuario agregado exitosamente");
      // Actualizar la lista de usuarios después de agregar uno nuevo
      const db = {
        users: await getProducts(),
      };
      printUsers(db);

      // Limpiar los campos del formulario
      document.getElementById("identificacion").value = "";
      document.getElementById("nombre").value = "";
      document.getElementById("email").value = "";
      document.getElementById("telefono").value = "";
    } else {
      throw new Error("Error al agregar el usuario");
    }
  } catch (error) {
    alert(error.message);
  }
}

async function deleteUser(userId) {
  try {
    const confirmed = confirm(
      "¿Estás seguro de que deseas eliminar este usuario?"
    );

    if (confirmed) {
      const response = await fetch(`http://localhost:8090/delete/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Usuario eliminado exitosamente");
        // Actualizar la lista de usuarios después de eliminar uno
        const db = {
          users: await getProducts(),
        };
        printUsers(db);
      } else {
        throw new Error("Error al eliminar el usuario");
      }
    }
  } catch (error) {
    console.log(error);
  }
}



async function main() {
  const db = {
    users: (await getProducts())
  }

  printUsers(db);
}

main();
