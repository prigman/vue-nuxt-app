<template>
  <div>
    <h2>Liste der Aufgabe</h2>
    <ul>
      <li v-for="user, index in users" :key="user.id">
        {{ user.name }} - {{ tasks[index].name }}
      </li>
    </ul>
  </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';

const users = ref([]);
const tasks = ref([]);

const fetchUsers = async () => {
  try {
    const response = await $fetch('https://my.1tool.com/suite/api/lists/users', {
      headers: {
        Authorization: 'Bearer Ypd8Tbrhbz1NolZElV6P1IstFc8Q00CK1fosuPAptxnhs3b3PdD4zOUUyJXbrZva0NAexy9RLdY1v9v63xbQIGTZOB0xkfnAIWujxpeAkSoF7mDWptdiwAjFNSJEYL64Uw2oXfZzGkmFQ9c1eXkadR2vqZkYsgN8JWgKXzvHlKU5oGi0tLqdJfU9GT0qLIsEbgkDJtTSdI9qaCE1YUy3u66eDenFDbGDZf7HLwQmxvRbtvGrB7LZ7ipSThqMQLY'
      }
    });
    users.value = response.data;
    console.log(users.value);
  } catch (error) {
    console.error(error);
  }
};

const fetchTasks = async () => {
  try {
    const response = await $fetch('https://my.1tool.com/suite/api/lists/tasks', {
      headers: {
        Authorization: 'Bearer Ypd8Tbrhbz1NolZElV6P1IstFc8Q00CK1fosuPAptxnhs3b3PdD4zOUUyJXbrZva0NAexy9RLdY1v9v63xbQIGTZOB0xkfnAIWujxpeAkSoF7mDWptdiwAjFNSJEYL64Uw2oXfZzGkmFQ9c1eXkadR2vqZkYsgN8JWgKXzvHlKU5oGi0tLqdJfU9GT0qLIsEbgkDJtTSdI9qaCE1YUy3u66eDenFDbGDZf7HLwQmxvRbtvGrB7LZ7ipSThqMQLY'
      }
    });
    tasks.value = response.data;
    console.log(tasks.value);
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  await fetchUsers();
  await fetchTasks();
});

</script>