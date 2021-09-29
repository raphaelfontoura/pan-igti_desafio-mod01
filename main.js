import { getData, createEmployee, deleteEmployee, updateEmployee } from "./http.js";

const select = document.getElementById("roles-select");
const divCheckbox = document.getElementById("roles-checkbox")
const table = document.getElementById("tbody-employees");
const form = document.getElementById("employee-form");
const button = document.getElementById("btn-submit");
const btnClear = document.getElementById("btn-clear");
const btnDelete = document.getElementById("btn-delete");
const spanAlert = document.getElementById("alert");

const selectOrder = document.getElementById("select-order");

let allEmployees = await getData("employees");
const roles = await getData("roles");

let employees = allEmployees;

let employeeSelected;


Init();

function Init() {
  createEmployeeElement();
  form.addEventListener("submit", onSubmit);
  btnClear.addEventListener("click", clearSelection);
  btnDelete.addEventListener("click", deleteEmployeeSelected);
  selectOrder.addEventListener("change", orderBySelectOrder);
  divCheckbox.addEventListener("change", filterByRole);
}

function filterByRole() {
  let rolesChecked = divCheckbox.querySelectorAll(":checked");
  employees = undefined;
  let roles = [];
  rolesChecked.forEach(role => roles.push(parseInt(role.value)));
  employees = allEmployees.filter(emp => roles.includes(emp.role_id));
  console.log(employees);
  if (employees.length == 0) {
    employees = allEmployees;
  }
  createEmployeeElement();
  clearSelection();
}

function orderBySelectOrder() {
  let order = selectOrder.value;
  console.log(order);
  switch (order) {
    case "name-asc":
      employees.sort((e1, e2) => {
        if (e1.name < e2.name) {
          return -1;
        } else if (e1.name > e2.name) {
          return 1;
        } else {
          return 0;
        }
      });
      createEmployeeElement();
      break;
    case "name-desc":
      employees.sort((e1, e2) => {
        if (e1.name > e2.name) {
          return -1;
        } else if (e1.name < e2.name) {
          return 1;
        } else {
          return 0;
        }
      });
      createEmployeeElement();
      break;
    case "salary-asc":
      employees.sort((e1, e2) => e1.salary - e2.salary);
      createEmployeeElement();
      break;
    case "salary-desc":
      employees.sort((e1, e2) => e2.salary - e1.salary);
      createEmployeeElement();
      break;
    default:
      break;
  }
}

async function onSubmit(event) {
  event.preventDefault();
  const employee = {
    name: form.name.value,
    salary: form.salary.valueAsNumber,
    role_id: parseInt(form.role_id.value),
  };
  let error = false;
  if (!employee.name) {
    console.log(form.name)
    form.name.classList.add("invalid");
    error = true;
  }
  if (!employee.salary) {
    form.salary.classList.add("invalid");
    error = true;
  }
  if (!employee.role_id) {
    form.role_id.classList.add("invalid");
    error = true;
  }
  if (error) {
    spanAlert.textContent = "Necessário preencher todos os campos";
    setTimeout(() => spanAlert.textContent = "", 5000);
  }

  await saveDataEmployee(employee)

}

async function deleteEmployeeSelected() {
  await deleteEmployee("employees", employeeSelected.id);
  const index = employees.indexOf(employeeSelected);
  employees.splice(index, 1);
  createEmployeeElement();
  clearSelection();
}

async function saveDataEmployee(employee) {
  if (employeeSelected) {
    employee = { id: employeeSelected.id, ...employee }
    const update = await updateEmployee("employees", employeeSelected.id, employee);
    const index = employees.indexOf(employeeSelected);
    employees[index] = update;
  } else {
    const create = await createEmployee("employees", employee);
    employees.push(create);
  }
  createEmployeeElement();
  clearSelection();
}

roles.forEach(role => {
  const option = document.createElement("option");
  const checkbox = document.createElement("input");
  const label = document.createElement("label");
  const span = document.createElement("span");
  checkbox.type = "checkbox";
  checkbox.classList.add("filled-in");
  span.textContent = role.name;
  checkbox.value = role.id;
  option.textContent = role.name;
  option.value = role.id;
  select.appendChild(option);
  label.appendChild(checkbox);
  label.appendChild(span);
  divCheckbox.appendChild(label);
});

function createEmployeeElement() {
  table.innerHTML = "";
  if (!employees) {
    return;
  }
  employees.forEach(employee => {
    const tr = document.createElement("tr");
    const tdId = document.createElement("td");
    const tdName = document.createElement("td");
    const tdRole = document.createElement("td");
    const tdSalario = document.createElement("td");
    tdId.textContent = employee.id;
    tdName.textContent = employee.name;
    let role = roles.find(role => role.id == employee.role_id);
    tdRole.textContent = role.name;
    tdSalario.textContent = employee.salary;
    tr.appendChild(tdId);
    tr.appendChild(tdName);
    tr.appendChild(tdRole);
    tr.appendChild(tdSalario);
    tr.addEventListener("click", () => selectEmployee(employee, tr));
    table.appendChild(tr);
  });
}

function selectEmployee(employee, tr) {
  employeeSelected = employee;
  tr.classList.add("selected");
  form.name.value = employee.name;
  form.salary.valueAsNumber = employee.salary;
  form.role_id.value = employee.role_id;
  button.textContent = "Atualizar";
  btnDelete.classList.remove("disabled");
}

function clearSelection() {
  employeeSelected = undefined;
  const tr = document.querySelector(".selected");
  if (tr) {
    tr.classList.remove("selected");
  }
  form.name.value = "";
  form.salary.value = "";
  form.role_id.value = "";
  button.textContent = "Salvar";
  btnDelete.classList.add("disabled");
}


