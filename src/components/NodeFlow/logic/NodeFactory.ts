import {
  CheckboxInterface,
  IntegerInterface,
  defineNode,
  NodeInterface,
  NumberInterface,
  SelectInterface,
  TextInputInterface,
} from "baklavajs";

import { useCustomFetch } from "@/composables/useCustomFetch";
import SidebarButton from "@/components/NodeFlow/Custom/CSidebarButton.vue";

function untangleItems(entries: object[], returnValue: string) {
  let defaultValue: string | null = null;
  const items: string[] = [];

  for (const item of entries) {
    if (item.selected === true) defaultValue = item.value;
    items.push(item.value);
  }
  switch (returnValue) {
    case "default":
      return defaultValue;
    case "entries":
      return items;
  }
}

function collectNodeParameters(nodeData: any) {
  const parameters = [];
  for (const entry of nodeData.entries) {
    switch (entry.type) {
      case "string":
        parameters[entry.argument] = "strings";
        break;
      case "select":
        parameters[entry.argument] = "selects";
        break;
      case "integer":
        parameters[entry.argument] = "integers";
        break;
      case "decimal":
        parameters[entry.argument] = "decimals";
        break;
      case "boolean":
        parameters[entry.argument] = "booleans";
        break;
    }
  }
  return parameters;
}
function createNodeType(nodeData: any) {
  const inputs: { [index: string]: any } = {};
  const descriptions: { [index: string]: any } = {};

  descriptions["processor"] = nodeData.description;
  descriptions["parameters"] = [];

  for (const entry of nodeData.entries) {
    descriptions["parameters"].push({
      title: entry.argument,
      description: entry.description,
    });

    switch (entry.type) {
      case "string":
        inputs[entry.argument] = () =>
          new TextInputInterface(entry.argument, entry.value).setPort(false);
        break;
      case "select":
        inputs[entry.argument] = () =>
          new SelectInterface(
            entry.argument,
            untangleItems(entry.items, "default"),
            untangleItems(entry.items, "entries"),
          ).setPort(false);
        break;
      case "integer":
        inputs[entry.argument] = () =>
          new IntegerInterface(entry.argument, entry.value).setPort(false);
        break;
      case "decimal":
        inputs[entry.argument] = () =>
          new NumberInterface(
            entry.argument,
            entry.value,
            entry.min,
            entry.max,
          ).setPort(false);
        break;
      case "boolean":
        inputs[entry.argument] = () =>
          new CheckboxInterface(entry.argument, entry.value).setPort(false);
        break;
    }
  }
  inputs["Input"] = () => new NodeInterface("Input", 0);
  inputs["Description"] = () =>
    new NodeInterface("Description", descriptions)
      .setComponent(markRaw(SidebarButton))
      .setPort(false);

  const outputs = {
    Output: () => new NodeInterface("Output", 0),
  };

  return defineNode({
    type: nodeData.name,
    title: nodeData.name,
    inputs: inputs,
    outputs: outputs,
  });
}

function replaceCategories(category: string) {
  switch (category) {
    case "Image preprocessing":
      return "Preprocessing";
    case "Layout analysis":
      return "Layout Analysis";
    case "Text recognition and optimization":
      return "Text Recognition";
    default:
      return category;
  }
}

function constructNodes(nodeData: object[]) {
  nodeData = nodeData.filter(
    (node) => !["imp", "launcher"].includes(node.type),
  );

  const nodesParameters: object[] = [];
  const nodes: object[] = [];

  for (const data of nodeData) {
    const node = createNodeType(data);
    const nodeParameters: object = {
      name: data.name,
      parameters: collectNodeParameters(data),
      id: data.id,
    };
    nodesParameters.push(nodeParameters);
    /** Temporary opionated blacklist for alpha version, should be removed later on  **/
    const blacklist = [
      "LAREX launcher",
      "ocrd-pagetopdf",
      "ocrd-tesserocr-fontshape",
      "ocrd-tesserocr-segment-word",
      "ocrd-tesserocr-segment-line",
      "ocrd-tesserocr-segment-region",
      "ocrd-fileformat-transform",
    ];
    if (!blacklist.includes(data.name))
      nodes.push({
        node: node,
        category: replaceCategories(data.categories[0]),
      });
  }
  return [nodes, nodesParameters];
}

export function importNodesFromAPI(): PromiseLike<
  [object[], object[]] | object[]
> {
  return useCustomFetch("/spi/list")
    .get()
    .json()
    .then((data) => constructNodes(data.data.value));
}
