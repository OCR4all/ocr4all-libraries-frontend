<script setup lang="ts">
const props = defineProps<{
  label: string;
  id: string;
  type: string;
  right: string;
}>();

const options = ref([
  {
    name: "Can View",
    value: "read"
  },
  {
    name: "Can Edit",
    value: "write"
  },
  {
    name: "Admin",
    value: "admin"
  }
])

const role = ref(options.value.find(option => {
  return option.value === props.right
}))

const emit = defineEmits(["remove"]);

function get() {
  return {
    name: props.id,
    role: role.value!.value
  }
}

defineExpose({
  get,
});
</script>
<template>
  <div class="flex justify-between">
    <div class="flex items-center gap-x-2">
      <AvatarInitials :name="label" :admin="false" :selectable="false" size="lg" />
      <div class="flex flex-col -space-y-0.5">
        <p class="font-bold">{{ label }}</p>
        <p>{{ id }}</p>
      </div>
    </div>
    <div class="flex space-x-2">
      <Select
        v-model="role"
        :options="options"
        optionLabel="name"
        placeholder="Select Rights"
        class="w-full"
      ></Select>
      <Button severity="danger" text @click="emit('remove', props.type, props.id)">
        <i class="pi pi-times text-surface-800 hover:text-surface-950 dark:text-surface-200 dark:hover:text-surface-0" />
      </Button>
    </div>
  </div>
</template>
