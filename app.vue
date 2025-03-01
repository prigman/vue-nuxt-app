<template>
  <div class="flex justify-center">
		<div class="p-5 m-5 bg-blue-50 rounded-lg w-150">
			<h2 class="text-3xl mb-5 font-regular">Todo list</h2>
			<!-- <ul v-if="users.length" class="mb-4">
				<h3 class="text-lg mb-2">List of users</h3>
				<li v-for="user in users" :key="user.id">
					{{ user.name }}
				</li>
			</ul>
			<p v-else>Loading users</p> -->
			<hr class="border-t border-gray-300 my-4">
			<h3 class="text-lg mb-2">List of tasks</h3>
			<ul v-if="tasks.length">
				<li v-for="task, index in tasks" :key="task.id">
					<label>
						<input v-on:click="completeTask(index)" type="checkbox" v-model="task.completed" class="w-4 h-4 rounded">
						{{ task.name }}
					</label>
				</li>
			</ul>
			<p v-else>Loading tasks</p>
			<hr class="border-t border-gray-300 my-4">
			<h3 class="text-lg mb-2">Completed</h3>
			<ul v-if="completedTasks.length">
				<li v-for="compTask, index in completedTasks" :key="compTask.id">
					<label class="line-through"> 
						<input v-on:click="toggleTask(index)" type="checkbox" v-model="compTask.completed" class="w-4 h-4 rounded">
						{{ compTask.name }}
					</label>
				</li>
			</ul>
			<p v-else >No more completed tasks yet</p>
			<ul v-if="totalPages > 1" class="flex flex-wrap space-x-1 space-y-3 justify-center mt-5">
				<li v-for="page in totalPages" :key="page" v-on:click="setPage(page)" class="cursor-pointer">
					<span v-if="page == currentPage" class="bg-blue-300 p-2 rounded">
						{{ page }}
					</span>
					<span v-else class="p-2">
						{{ page }}
					</span>
				</li>
			</ul>
			<p v-else>Loading total pages</p>
		</div>
  </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';

const config = useRuntimeConfig();
// const users = ref([]);
const tasks = ref([]);
const completedTasks = ref([]);
let currentPage = 1;
let totalPages;

const localStorageKeyTasks = "todolist-tasks-page-";
const localStorageKeyCompleted = "todolist-completed-tasks-page-";

const setPage = async (page) => {
	currentPage = page;
	tasks.value = [];
	completedTasks.value = [];
	await fetchTasks();
}

const completeTask = (index) => {
  const task = tasks.value[index];
  task.completed = true;
  completedTasks.value.push(task);
  tasks.value.splice(index, 1);
	updateLocalStorage();
}

const toggleTask = (index) => {
  const task = completedTasks.value[index];
  task.completed = false;
  tasks.value.push(task);
  completedTasks.value.splice(index, 1);
	updateLocalStorage();
}

const updateLocalStorage = () => {
	localStorage.setItem(localStorageKeyTasks+currentPage, JSON.stringify(tasks.value));
	localStorage.setItem(localStorageKeyCompleted+currentPage, JSON.stringify(completedTasks.value));
}

/* const fetchUsers = async () => {
  try {
    const response = await $fetch('https://my.1tool.com/suite/api/lists/users', {
      headers: {
        Authorization: config.public.api_key
      }
    });
    users.value = response.data;
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}; */

const fetchTasks = async () => {
  try {
    const response = await $fetch(`https://my.1tool.com/suite/api/lists/tasks?page=${currentPage}`, {
      headers: {
        Authorization: config.public.api_key
      }
    });
		tasks.value = JSON.parse(localStorage.getItem(localStorageKeyTasks+currentPage) || '[]');
		completedTasks.value = JSON.parse(localStorage.getItem(localStorageKeyCompleted+currentPage) || '[]');
		
		if(!tasks.value.length && !completedTasks.value.length)
			tasks.value = response.data.map(task => ({ ...task, completed: false }));
    totalPages = response.meta.last_page - 1;
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  // await fetchUsers();
  await fetchTasks();
});

</script>