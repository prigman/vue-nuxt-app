<template>
  <Panel class="m-5" style="--p-panel-content-padding: 0">
    <template #header>
      <div class="flex w-[100vw] justify-between items-center">
        <h2 class="text-3xl font-regular">1Tool todo list</h2>
        <div class="flex justify-center items-center">
          <Button
            label="Login"
            severity="primary"
            v-if="showLoginButton"
            data-type="login"
            v-on:click="setModal()"
            class="bg-sky-300 text-white rounded cursor-pointer p-2"
          >
          </Button>
          <Tag data-type="welcome-username" v-if="user.name" icon="pi pi-check" severity="success"
            >Welcome {{ user.name }}!</Tag
          >
          <Button
            class="ml-4"
            v-if="user.name"
            label="Logout"
            severity="danger"
            v-on:click="logout()"
            variant="outlined"
          >
          </Button>
        </div>
      </div>
    </template>
    <hr class="border-t border-gray-300 my-4" />
    <template #footer>
      <h3 class="text-lg mb-2">List of tasks</h3>
      <div v-if="user.name" class="mb-4">
        <label for="">
          <InputText
						data-type="add-input-task"
            class="w-50 h-8 text-lg"
            v-model="newTaskName"
            v-tooltip.focus.top="'Type a new task'"
            type="text"
          />

          <Button
						data-type="add-task"
            v-on:click="createTask(newTaskName)"
            class="ml-2"
            size="small"
            type="button"
            label="Add"
          ></Button>
        </label>
      </div>

      <ul v-if="tasks.length" class="space-y-2">
        <li v-for="(task, index) in tasks" :key="task.id">
          <div v-if="!task.completed" class="flex items-center gap-1.5">
						<Button data-type="task-edit" v-on:click="setEditTask(index)" class="mr-3 min-w-[30px]" icon="pi pi-pen-to-square" rounded variant="outlined" size="small"></Button>
            <Checkbox
              v-on:click="toggleTask(index, 1)"
              v-model="task.completed"
              :inputId="`${task.id}`"
              name="task"
              :value="task.name"
              binary
            />
            <label data-type="task-name" class="break-words" :for="`${task.id}`">{{ task.name }}</label>
          </div>
        </li>
      </ul>
      <p v-else>No tasks</p>
      <hr class="border-t border-gray-200 my-4" />
      <h3 class="text-lg mb-2">Completed</h3>
      <ul v-if="tasks.length" class="space-y-2">
        <li v-for="(task, index) in tasks" :key="task.id">
          <div v-if="task.completed" class="flex items-center gap-1.5">
						<Button data-type="task-edit" v-on:click="setEditTask(index)" class="mr-3 min-w-[30px]" icon="pi pi-pen-to-square" rounded variant="outlined" size="small"></Button>
            <Checkbox
              v-on:click="toggleTask(index, 0)"
              v-model="task.completed"
              :inputId="`${task.id}`"
              name="task"
              :value="task.name"
              binary
            />
            <label data-type="task-name" class="break-words line-through" :for="`${task.id}`">{{ task.name }}</label>
          </div>
        </li>
      </ul>
      <p v-else>No completed tasks</p>
      <ul
        v-if="totalPages > 1"
        class="flex flex-wrap space-x-1 space-y-3 justify-center mt-5"
      >
        <li
          v-for="page in totalPages"
          :key="page"
          v-on:click="setPage(page)"
          class="cursor-pointer"
        >
          <Button data-type="page-selected" v-if="page == currentPage" variant="outlined" size="small">
            {{ page }}
          </Button>
          <Button data-type="page" v-else variant="text" size="small">
            {{ page }}
          </Button>
        </li>
      </ul>

      <Dialog
        data-type="modal"
        v-model:visible="modal"
        modal
        header="Login"
        :style="{ width: '25rem' }"
      >
        <span class="text-surface-500 dark:text-surface-400 block mb-8"
          >Login to your 1Tool account to fetch tasks</span
        >
        <div class="flex items-center gap-4 mb-8">
          <label for="email" class="font-semibold w-24">Email</label>
          <InputText
            v-model="modalEmail"
            id="email"
            class="flex-auto"
            autocomplete="off"
						data-type="email"
          />
        </div>
        <div class="flex items-center gap-4 mb-8">
          <label for="password" class="font-semibold w-24">Password</label>
          <Password
            v-model="modalPassword"
            :feedback="false"
            id="password"
            class="flex-auto flex-col"
            autocomplete="off"
						data-type="password"
          />
        </div>
        <div class="flex justify-end gap-2">
          <Button
						data-type="login-button"
            type="button"
            label="Login"
            @click="auth(modalEmail, modalPassword)"
          ></Button>
        </div>
        <span v-if="loginError" class="text-red-500" data-type="login-error"
          >Login error</span
        >
      </Dialog>

      <Dialog
        data-type="modal-edit"
        v-model:visible="modalEdit"
        modal
        header="Edit task"
        :style="{ width: '25rem' }"
      >
        <span class="text-surface-500 dark:text-surface-400 block mb-8"
          >{{ tasks[editTaskIndex].name }}</span
        >
        <div class="flex items-center gap-4 mb-8">
          <label for="editTask" class="font-semibold w-24">New name</label>
          <InputText
						data-type="edit-task-input"
            v-model="editTaskInput"
            id="editTask"
            class="flex-auto"
            autocomplete="off"
          />
        </div>
        
        <div class="flex justify-end gap-2">
					<Button
						data-type="edit-task-remove"
						severity="danger"
						type="button"
						label="Remove task"
						@click="removeTask()"
					></Button>
          <Button
						data-type="edit-task-rename"
            type="button"
            label="Save task"
            @click="renameTask(editTaskInput)"
          ></Button>
        </div>
        
      </Dialog>
    </template>
  </Panel>
</template>

<script setup>
import { ref, onMounted } from "vue";

const tasks = ref([]);

const modal = ref(false);

const apiToken = ref("");
const apiId = ref(-1);

const user = ref({});

const modalEmail = ref("");
const modalPassword = ref("");
const newTaskName = ref("");

const currentPage = ref(1);
const totalPages = ref(1);

const loginError = ref(false);

const showLoginButton = ref(false);

const editTaskInput = ref("");
const modalEdit = ref(false);
let editTaskIndex = -1;


const setCookie = (name, value, days = 1) => {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
};

const getCookie = (name) => {
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(name + "=") == 0)
      return c.substring(name.length + 1, c.length);
  }
  return "";
};

const clearModalEdit = () => {
	modalEdit.value = false;
	editTaskInput.value = "";
	editTaskIndex = -1;
}

const setEditTask = (index) => {
	editTaskIndex = index;
	modalEdit.value = true;
}

const removeTask = async () => {
	try {
		const task = tasks.value[editTaskIndex];
    const taskToExport = JSON.parse(JSON.stringify(task));
    delete taskToExport.completed;

    const response = await $fetch(
      `https://my.1tool.com/suite/api/tasks/${task.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + apiToken.value,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskToExport),
      }
    );
		clearModalEdit();
		await fetchTasks();
  } catch (error) {
    console.error(error);
  }
}

const renameTask = async (name) => {
	const task = tasks.value[editTaskIndex];
	task.name = name;
	clearModalEdit();
	await updateTask(task);
}

const setPage = async (page) => {
  currentPage.value = page;
  tasks.value = [];
  await fetchTasks();
};

const setModal = () => {
  modal.value = !modal.value;
};

const toggleTask = async (index, doneValue) => {
  const task = tasks.value[index];
  let completedValue = false;
  if (doneValue === 1) completedValue = true;

  task.done = doneValue;
  task.completed = completedValue;
  await updateTask(task);
};

const logout = () => {
  setCookie("api_token", "");
  setCookie("api_id", "");
  apiToken.value = "";
  apiId.value = -1;
  user.value = {};
  tasks.value = [];
  currentPage.value = 1;
  totalPages.value = 1;
  showLoginButton.value = true;
	if(newTaskName.value !== "")
		newTaskName.value = "";
	if(modalEdit.value)
		clearModalEdit();
};

const updateTask = async (task) => {
  try {
    const taskToExport = JSON.parse(JSON.stringify(task));
    delete taskToExport.completed;

    const response = await $fetch(
      `https://my.1tool.com/suite/api/tasks/${task.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + apiToken.value,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskToExport),
      }
    );
  } catch (error) {
    console.error(error);
  }
};

const auth = async (email, password) => {
  try {
    const response = await $fetch(`https://my.1tool.com/suite/api/auth/user`, {
      method: "POST",
      body: { email, password },
    });
    if (loginError.value) loginError.value = false;
    console.log(response);

    modalEmail.value = "";
    modalPassword.value = "";

    setCookie("api_token", response.api_token);
    setCookie("api_id", response.id);

    apiToken.value = response.api_token;
    apiId.value = response.id;

    setModal();

    await getUser();
  } catch (error) {
    console.error(error);
    loginError.value = true;
  }
};

const getUser = async () => {
  try {
    const response = await $fetch(
      `https://my.1tool.com/suite/api/users/${apiId.value}`,
      {
        headers: {
          Authorization: "Bearer " + apiToken.value,
        },
      }
    );
    user.value = response.data;
    showLoginButton.value = false;
    await fetchTasks();
  } catch (error) {
    console.error(error);
  }
};

const fetchTasks = async () => {
  try {
    const response = await $fetch(
      `https://my.1tool.com/suite/api/tasks?page=${currentPage.value}`,
      {
        headers: {
          Authorization: "Bearer " + apiToken.value,
        },
      }
    );
    console.log(response);

    tasks.value = response.data.map((task) => ({
      ...task,
      completed: task.done === 1 ? true : false,
    }));

    totalPages.value = response.meta.last_page;
  } catch (error) {
    console.error(error);
  }
};

const createTask = async (name) => {
  if (name === "") return;
  try {
    const response = await $fetch(`https://my.1tool.com/suite/api/tasks`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiToken.value,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name, user: apiId.value }),
    });
    newTaskName.value = "";
    await fetchTasks(apiToken.value);
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  apiToken.value = getCookie("api_token");
  apiId.value = getCookie("api_id");
  if (apiToken.value !== "" && apiId.value !== -1)
    await getUser(apiId.value, apiToken.value);
  else showLoginButton.value = true;
});
</script>
