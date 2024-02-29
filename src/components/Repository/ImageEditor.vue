<script setup lang="ts">
import Konva from "konva";

const router = useRouter()
const containerName = router.currentRoute.value.query.id;

const visible: Ref<boolean | null> = ref(null)
const stage: Ref<KonvaNode<Konva.Stage> | null> = ref(null)
const container: Ref<HTMLDivElement | null> = ref(null)
const rasterImage: Ref<HTMLImageElement | null> = ref(null);

const testRef = ref(null)

function toggle(){
  visible.value = !visible.value
  console.log(testRef.value)
}

onMounted(() => {
  console.log(testRef.value)
})

function setImage(image: string){
  Konva.Image.fromURL(image, function (node) {
    const imageLayer = new Konva.Layer();
    stage.value?.getStage().add(imageLayer);
    imageLayer.add(node)
  });
  fitStageToParent()
}
interface KonvaNode<NodeTy extends Konva.Node> {
  getNode(): NodeTy;
  getStage(): Konva.Stage;
}

const stageConfig = ref({
  width: 0,
  height: 0,
  draggable: true,
});

function fitStageToParent() {
  if (!container.value) {
    return console.error("Could not fit stage to container because it is null");
  }

  const editorContainer = container.value;
  const [width, height] = [editorContainer.offsetWidth, editorContainer.offsetHeight];
  stageConfig.value.width = width;
  stageConfig.value.height = height;
}

defineExpose({
  setImage,
  toggle,
  fitStageToParent
})
</script>
<template>
  <div
    id="stage-container"
    ref="container"
  >
    <v-stage
      ref="stage"
      :config="stageConfig">
      <v-layer>
        <v-image
          v-show="rasterImage"
          :config="{
            x: 0,
            y: 0,
            image: rasterImage,
            shadowEnabled: true,
            shadowOffsetX: 5,
            shadowOffsetY: 5,
            shadowBlur: 1200,
          }"
        ></v-image>
      </v-layer>
    </v-stage>
  </div>
</template>
