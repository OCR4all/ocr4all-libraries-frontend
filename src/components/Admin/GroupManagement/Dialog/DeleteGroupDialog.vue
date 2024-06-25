<script setup lang="ts">
import { useCustomFetch } from "@/composables/useCustomFetch";

const dialogRef = inject('dialogRef');

const data = ref([]);

onMounted(() => {
  data.value = dialogRef.value.data;
})

async function deleteGroups(){
  for (const group of data.value.data) {
    await useCustomFetch(`/administration/security/group/remove?label=${group.label}`)
      .json()
      .then((response) => {
        if(response.error.value){

        }else{
          dialogRef.value.close()
        }
      });
  }
}
</script>
<template>
  <div class="m-4">
    <p class="text-lg text-surface-950 dark:text-surface-0">
      {{
        $t("admin.user-management.dialog.delete.single.body.warning")
      }}
    </p>
    <ul class="px-4">
      <li v-for="group in data.data" :key="group.label" class="list-disc font-semibold text-surface-950 dark:text-surface-0">
        {{ group.name }}
      </li>
    </ul>
  </div>
  <ActionButton rounded size="large" @click="dialogRef.close()">
    <i class="pi pi-times"></i>
    {{ $t("admin.user-management.dialog.delete.footer.button.cancel") }}
  </ActionButton>
  <ActionButton rounded type="delete" size="large" @click="deleteGroups">
    <i class="pi pi-check"></i>
    {{ $t("admin.user-management.dialog.delete.footer.button.save") }}
  </ActionButton>
</template>
