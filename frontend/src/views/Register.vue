<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="flex flex-col h-screen w-screen items-center justify-center">
        <div class="w-full sm:w-96 bg-white p-6 rounded shadow-md">
          <h2 class="text-2xl font-bold mb-4 text-center">Create an Account</h2>
          <form @submit.prevent="register">
            <div class="mb-4 ml-6">
              <label class="block text-gray-700">First Name</label>
              <input v-model="firstName" type="text" class=" h-8 p-2 border border-gray-300 rounded mt-1" required />
            </div>
            <div class="mb-4 ml-6">
              <label class="block text-gray-700">Last Name</label>
              <input v-model="lastName" type="text" class="h-8 p-2 border border-gray-300 rounded mt-1" required />
            </div>
            <div class="mb-4 ml-6">
              <label class="block text-gray-700">Email</label>
              <input v-model="email" type="email" class="h-8 p-2 border border-gray-300 rounded mt-1" required />
            </div>
            <div class="mb-4 ml-6">
              <label class="block text-gray-700">Password</label>
              <input v-model="password" type="password" class="h-8 p-2 border border-gray-300 rounded mt-1" required />
            </div>
            <div class="mb-4 ml-6">
              <label class="block text-gray-700">Confirm Password</label>
              <input v-model="confirmPassword" type="password" class="h-8 p-2 border border-gray-300 rounded mt-1" required />
            </div>
            <Button type="submit" variant="solid" class=" bg-black-700 text-white" id="registerBtn">Register</Button>
          </form>
          <p class="mt-4 text-center">
            Already have an account? <router-link to="/login" class="text-blue-500">Login</router-link>
          </p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import axios from "axios"
import { showErrorAlert } from "@/utils/dialogs"

import { IonPage, IonContent } from "@ionic/vue"
import { Input, Button, ErrorMessage } from "frappe-ui"

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const router = useRouter()

const getCSRFToken = () => {
  const cookieValue = document.cookie.match('(^|;)\\s*sid\\s*=\\s*([^;]+)')?.[2];
  return cookieValue || '';
}

const register = async () => {
  if (password.value !== confirmPassword.value) {
    showErrorAlert("Passwords do not match")
    return
  }

  try {
    const csrfToken = getCSRFToken()
   

    const response = await axios.post("/api/method/wms.api.my_api.create_user", {
      email: email.value,
      first_name: firstName.value,
      last_name: lastName.value,
      password: password.value,
    }, {
      headers: {
        'X-XSRF-TOKEN': csrfToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })

    const result = response.data

    if (result.status === "success") {
      alert(result.message)
      router.push({ name: "Login" })
    } else {
      showErrorAlert(result.message)
      router.push({ name: "Login" })

    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data._server_messages) {
      const serverMessages = JSON.parse(error.response.data._server_messages);
      const errorMessage = serverMessages.map(msg => JSON.parse(msg).message).join(' ');
      showErrorAlert(errorMessage);
    } else {
      showErrorAlert("An error occurred during registration");
    }
    console.error("Registration error:", error)
  }
}
</script>

<style scoped>
#registerBtn {
  width: 80%;
  margin-left: 7%;
}
</style>
