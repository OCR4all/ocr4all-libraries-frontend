import { IBaklavaViewModel } from "baklavajs";
export function addNodeWithCoordinates(
  baklava: IBaklavaViewModel,
  nodeType: any,
  x: number,
  y: number
) {
  const node = new nodeType();
  baklava.displayedGraph.addNode(node);
  node.position.x = x;
  node.position.y = y;
  return node;
}
