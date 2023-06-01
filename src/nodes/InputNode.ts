import { Node, NodeInterface } from "baklavajs";
import SidebarButton from "@/components/NodeFlow/Custom/CSidebarButton.vue";
export default class InputNode extends Node<any, any> {
  public type = "InputNode";
  public title = "Input";
  public descriptions = {
    processor:
      "The Input node denotes the starting point of a workflow and represents the input images.",
    parameters: [],
  };

  public inputs = {
    description: new NodeInterface("Description", this.descriptions)
      .setComponent(markRaw(SidebarButton))
      .setPort(false),
  };

  public outputs = {
    output: new NodeInterface("Output", 0),
  };

  public constructor() {
    super();
    this.initializeIo();
  }
}
