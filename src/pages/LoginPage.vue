<script setup lang="ts">
import { useAuthStore } from "@/stores/auth.store";
import { Form, Field } from "vee-validate";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
const toast = useToast();

import { useI18n } from "vue-i18n";
const { t } = useI18n();
function onSubmit(
  values: { username: string; password: string },
  { setErrors }: any,
) {
  const authStore = useAuthStore();
  const { username, password } = values;

  return authStore.login(username, password).catch((error: any) =>
    toast.add({
      severity: "error",
      summary: t("pages.login.toasts.login.error.summary"),
      detail: t("pages.login.toasts.login.error.detail"),
      life: 3000,
    }),
  );
}
</script>

<template>
  <Toast />
  <div
    class="mx-auto flex h-screen flex-col items-center justify-center bg-surface-100 px-6 py-8 dark:bg-surface-700 lg:py-0"
  >
    <img class="h-20 pb-10" src="/img/logo.png" alt="OCR4all logo" />
    <div
      class="w-full rounded-md border bg-white dark:border-surface-700 dark:bg-surface-850 sm:max-w-md md:mt-0 xl:p-0"
    >
      <div class="space-y-4 p-6 sm:p-8 md:space-y-6">
        <h1
          class="text-xl font-bold leading-tight tracking-tight text-surface-900 dark:text-white md:text-2xl"
        >
          {{ $t("pages.login.directive") }}
        </h1>
        <Form
          v-slot="{ errors, isSubmitting }"
          class="space-y-4 md:space-y-6"
          @submit="onSubmit"
        >
          <div>
            <label
              for="username"
              class="mb-2 block text-sm font-medium text-surface-900 dark:text-white"
              >{{ $t("pages.login.input.username") }}</label
            >
            <Field
              type="text"
              name="username"
              id="username"
              class="block w-full rounded-md border border-surface-300 bg-surface-50 p-2.5 text-surface-900 focus:border-primary-600 focus:ring-primary-600 dark:border-surface-600 dark:bg-surface-700 dark:text-white dark:placeholder-surface-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:text-sm"
              :class="{ 'is-invalid': errors.username }"
              required=""
            />
            <div class="invalid-feedback">{{ errors.username }}</div>
          </div>
          <div>
            <label
              for="password"
              class="mb-2 block text-sm font-medium text-surface-900 dark:text-white"
              >{{ $t("pages.login.input.password") }}</label
            >
            <Field
              id="password"
              type="password"
              name="password"
              class="block w-full rounded-md border border-surface-300 bg-surface-50 p-2.5 text-surface-900 focus:border-primary-600 focus:ring-primary-600 dark:border-surface-600 dark:bg-surface-700 dark:text-white dark:placeholder-surface-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:text-sm"
              :class="{ 'is-invalid': errors.password }"
              required=""
            />
            <div class="invalid-feedback">{{ errors.password }}</div>
          </div>
          <button
            :disabled="isSubmitting"
            type="submit"
            class="w-full rounded-md bg-primary-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            <span
              v-show="isSubmitting"
              class="spinner-border spinner-border-sm mr-1"
            ></span>
            {{ $t("pages.login.sign-in") }}
          </button>
        </Form>
      </div>
    </div>
  </div>
</template>
