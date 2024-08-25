<script setup lang="ts">
import { SelectChangeEvent } from "primevue/select";

const props = defineProps<{
  label: string;
  id: string;
  type: string;
  right: string;
}>();

const options = ref([
  {
    name: "Can View",
    value: "read",
  },
  {
    name: "Can Edit",
    value: "write",
  },
  {
    name: "Admin",
    value: "admin",
  },
  {
    name: "Remove",
    value: "remove",
  },
]);

const role = ref(
  options.value.find((option) => {
    return option.value === props.right;
  }),
);

const emit = defineEmits(["remove"]);

function get() {
  return {
    name: props.id,
    role: role.value!.value,
  };
}

function change(event: SelectChangeEvent) {
  if (event.value.value === "remove") emit("remove", props.type, props.id);
}

defineExpose({
  get,
});
</script>
<template>
  <div class="flex justify-between">
    <div class="flex items-center gap-x-4">
      <AvatarInitials
        :name="label"
        :admin="false"
        :selectable="false"
        size="lg"
      />
      <div class="flex flex-col -space-y-0.5">
        <p class="font-bold">{{ label }}</p>
        <p>{{ id }}</p>
      </div>
    </div>
    <div class="flex space-x-2">
      <Select
        v-model="role"
        :options="options"
        @change="change"
        optionLabel="name"
        placeholder="Select Rights"
        class="w-full"
      >
        <template #option="slotProps">
          <div
            v-if="slotProps.option.value === 'remove'"
            class="text-red-700 dark:text-red-400"
          >
            Remove
          </div>
          <div v-else>{{ slotProps.option.name }}</div>
        </template>
      </Select>
    </div>
  </div>
</template>
