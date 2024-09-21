import { useState } from "react";
import "./AdminForm.css";

function AdminRegistrationForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [institution, setInstitution] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    // Realizar la lógica de registro del administrador aquí
  }

  return (
    <form>
      <div>
        <div>
          <label class="text-gray-700 dark:text-gray-200" for="firstName">
            Nombre
          </label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
          />
        </div>

        <div>
          <label class="text-gray-700 dark:text-gray-200" for="lastName">
            Apellido
          </label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
          />
        </div>
        <div>
          <label htmlFor="Role">Rol:</label>
          <select
            id="Role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
          >
            <option value="">Selecciona una Rol</option>
            <option value="institucion1">Rol 1</option>
            <option value="institucion2">Rol 2</option>
            <option value="institucion3">Rol 3</option>
          </select>
        </div>
        <div>
          <label htmlFor="institution">Institución:</label>
          <select
            id="institution"
            value={institution}
            onChange={(event) => setInstitution(event.target.value)}
            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
          >
            <option value="">Selecciona una institución</option>
            <option value="institucion1">Institución 1</option>
            <option value="institucion2">Institución 2</option>
            <option value="institucion3">Institución 3</option>
          </select>
        </div>

        <div class="flex justify-end mt-6">
          <button class="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600">
            Save
          </button>
        </div>
      </div>
    </form>
  );
}

export default AdminRegistrationForm;
