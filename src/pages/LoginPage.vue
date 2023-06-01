<script setup lang="ts">
import { useAuthStore } from "@/stores/auth.store";
import { Form, Field } from "vee-validate";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
const toast = useToast();

function onSubmit(
  values: { username: string; password: string },
  { setErrors }: any
) {
  const authStore = useAuthStore();
  const { username, password } = values;

  return authStore.login(username, password).catch((error: any) =>
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Wrong credentials",
      life: 3000,
    })
  );
}
</script>

<template>
  <Toast />
  <div
    class="mx-auto flex flex-col items-center justify-center px-6 py-8 dark:bg-zinc-700 md:h-screen lg:py-0"
  >
    <img class="h-20 pb-10" src="/img/logo.png" alt="OCR4all logo" />
    <div
      class="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-zinc-800 sm:max-w-md md:mt-0 xl:p-0"
    >
      <div class="space-y-4 p-6 sm:p-8 md:space-y-6">
        <h1
          class="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl"
        >
          Log in to your account
        </h1>
        <Form
          v-slot="{ errors, isSubmitting }"
          class="space-y-4 md:space-y-6"
          @submit="onSubmit"
        >
          <div>
            <label
              for="username"
              class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >Username</label
            >
            <Field
              type="text"
              name="username"
              id="username"
              class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-zinc-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
              :class="{ 'is-invalid': errors.username }"
              required=""
            />
            <div class="invalid-feedback">{{ errors.username }}</div>
          </div>
          <div>
            <label
              for="password"
              class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >Password</label
            >
            <Field
              type="password"
              id="password"
              name="password"
              class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-zinc-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
              :class="{ 'is-invalid': errors.password }"
              required=""
            />
            <div class="invalid-feedback">{{ errors.password }}</div>
          </div>
          <button
            :disabled="isSubmitting"
            type="submit"
            class="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <span
              v-show="isSubmitting"
              class="spinner-border spinner-border-sm mr-1"
            ></span>
            Sign
          </button>
        </Form>
      </div>
    </div>
  </div>
</template>
