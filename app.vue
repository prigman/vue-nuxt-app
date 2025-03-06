<template>
  <div class="flex justify-center">
    <div class="p-5 m-5 bg-blue-50 rounded-lg w-150">
      <div class="flex mb-5 justify-between">
        <h2 class="text-3xl font-regular">1Tool todo list</h2>
        <button
          v-if="!user.name"
          v-on:click="setModal()"
          class="bg-sky-300 text-white rounded cursor-pointer p-2"
        >
          Login
        </button>
        <div v-else class="flex items-center">
          <span class="text-green-500 mr-4">Welcome {{ user.name }}!</span>
          <button
            v-on:click="logout()"
            class="bg-red-500 text-white rounded cursor-pointer p-2"
          >
            Logout
          </button>
        </div>
      </div>

      <div
        v-if="modal"
        class="relative z-10"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          class="fixed inset-0 bg-gray-500/75 transition-opacity"
          aria-hidden="true"
        ></div>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div
            class="flex sm:min-h-full min-h-[70vh] items-end justify-center p-4 text-center sm:items-center sm:p-0"
          >
            <div
              class="relative transform overflow-hidden rounded bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
            >
              <div class="flex justify-end w-full">
                <button
                  v-on:click="setModal()"
                  type="button"
                  class="bg-white cursor-pointer rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                >
                  <svg
                    class="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div class="bg-white px-4 pb-4">
                <div>
                  <form class="flex flex-col" action="">
                    <label class="flex flex-col mb-5" for="email">
                      Email
                      <input
                        v-model="modalEmail"
                        class="border-1 border-gray-300 h-7 rounded pl-2"
                        type="email"
                        name="email"
                        id="email"
                      />
                    </label>
                    <label class="flex flex-col mb-5" for="password">
                      Password
                      <input
                        v-model="modalPassword"
                        class="border-1 border-gray-300 h-7 rounded pl-2"
                        type="password"
                        name="password"
                        id="password"
                      />
                    </label>
                    <input
                      v-on:click="auth(modalEmail, modalPassword)"
                      class="bg-sky-300 text-white rounded cursor-pointer p-2"
                      type="button"
                      value="Login"
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr class="border-t border-gray-300 my-4" />
      <h3 class="text-lg mb-2">List of tasks</h3>
      <div v-if="user.name" class="mb-4">
        <label for="">
          <input
            v-model="newTaskName"
            class="bg-white rounded h-7 border-1 border-gray-300 pl-2"
            type="text"
            placeholder="Type a new task"
          />
          <input
            v-on:click="createTask(newTaskName)"
            class="ml-2 bg-sky-300 text-white rounded cursor-pointer p-1"
            type="button"
            value="Add"
          />
        </label>
      </div>

      <ul v-if="tasks.length">
        <li v-for="(task, index) in tasks" :key="task.id">
          <label v-if="!task.completed">
            <input
              v-on:click="toggleTask(index, 1)"
              type="checkbox"
              v-model="task.completed"
              class="w-4 h-4 rounded"
            />
            {{ task.name }}
          </label>
        </li>
      </ul>
      <p v-else-if="!user.name">Login first</p>
      <p v-else>No tasks</p>
      <hr class="border-t border-gray-300 my-4" />
      <h3 class="text-lg mb-2">Completed</h3>
      <ul v-if="tasks.length">
        <li v-for="(task, index) in tasks" :key="task.id">
          <label v-if="task.completed" class="line-through">
            <input
              v-on:click="toggleTask(index, 0)"
              type="checkbox"
              v-model="task.completed"
              class="w-4 h-4 rounded"
            />
            {{ task.name }}
          </label>
        </li>
      </ul>
      <p v-else-if="!user.name">Login first</p>
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
          <span
            v-if="page == currentPage"
            class="bg-sky-300 p-2 rounded text-white"
          >
            {{ page }}
          </span>
          <span v-else class="p-2">
            {{ page }}
          </span>
        </li>
      </ul>
    </div>
  </div>
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

    console.log(response);

    modalEmail.value = "";
    modalPassword.value = "";

    setModal();

    setCookie("api_token", response.api_token);
    setCookie("api_id", response.id);

    apiToken.value = response.api_token;
    apiId.value = response.id;

    await getUser();
  } catch (error) {
    console.error(error);
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
});
</script>
