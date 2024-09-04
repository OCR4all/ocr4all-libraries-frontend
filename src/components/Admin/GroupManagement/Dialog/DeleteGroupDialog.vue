<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";
import { IGroup } from "@/types/auth/group.types";
import type { DynamicDialogInstance } from "primevue/dynamicdialogoptions";

const dialogRef: Ref<DynamicDialogInstance> | undefined = inject("dialogRef");

const data: Ref<IGroup[]> = ref([]);

onMounted(() => {
  data.value = dialogRef?.value.data;
});

async function deleteGroups() {
  /** TODO: User Promise.all **/
  for (const group of data.value) {
    await useCustomFetch(
      `/administration/security/group/remove?label=${group.label}`,
    )
      .json()
      .then((response) => {
        if (response.error.value) {
        } else {
          dialogRef?.value.close();
        }
      });
  }
}
</script>
<template>
  <div class="m-4">
    <p class="text-lg text-surface-950 dark:text-surface-0">
      {{
        data.length > 1
          ? $t("admin.user-management.dialog.delete.multiple.body.warning")
          : $t("admin.user-management.dialog.delete.single.body.warning")
      }}
    </p>
    <ul class="px-4">
      <li
        v-for="group in data"
        :key="group.label"
        class="list-disc font-semibold text-surface-950 dark:text-surface-0"
      >
        {{ group.name }}
      </li>
    </ul>
  </div>
  <ActionButton rounded size="large" @click="dialogRef?.close()">
    <i class="pi pi-times"></i>
    {{ $t("admin.user-management.dialog.delete.footer.button.cancel") }}
  </ActionButton>
  <ActionButton rounded type="delete" size="large" @click="deleteGroups">
    <i class="pi pi-check"></i>
    {{ $t("admin.user-management.dialog.delete.footer.button.save") }}
  </ActionButton>
</template>
