function hasInputNode(graph) {
  for (const node of graph.nodes) {
    if (node.type === "InputNode") return node.id;
  }
  return "";
}

function getPaths(_tree) {
  const paths = [];
  const tree = JSON.parse(
    JSON.stringify(_tree, (key, value) =>
      ["name", "parent_id"].includes(key) ? undefined : value,
    ),
  );
  for (const child of tree.children) {
    paths.push(child);
  }

  return paths;
}
function flatMapToTree(flatMap) {
  const nodes = [];
  const toplevelNodes = [];
  const lookupList = {};

  for (let i = 0; i < flatMap.length; i++) {
    const node = {
      id: flatMap[Number(i)].id,
      name: flatMap[Number(i)].name,
      parent_id:
        flatMap[Number(i)].parent === 0 ? null : flatMap[Number(i)].parent,
      children: [],
    };
    if (lookupList[node.id] === undefined) {
      lookupList[node.id] = [node];
    } else {
      lookupList[node.id] = lookupList[node.id].concat([node]);
    }

    nodes.push(node);
    if (node.parent_id == null) {
      toplevelNodes.push(node);
    }
  }

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[Number(i)];
    if (!(node.parent_id == null)) {
      for (const parent of lookupList[node.parent_id]) {
        parent.children = parent.children.concat([node]);
      }
    }
  }
  return toplevelNodes[0];
}

function filterFlatMap(flatMap, idNameMap) {
  // Removes all connections which contain non input root nodes
  const nonInputRootNodes = new Map(idNameMap);
  for (const entry of flatMap) {
    nonInputRootNodes.delete(entry.id);
  }
  const filteredNodes = Array.from(nonInputRootNodes.keys());
  const filteredFlatMap = [];
  for (const entry of flatMap) {
    if (filteredNodes.indexOf(entry.parent) === -1) filteredFlatMap.push(entry);
  }
  return filteredFlatMap;
}

function getProcessors(connectionMap, nodeMap, parameterGroups) {
  const processors = [];
  // Removes all connections which contain non input root nodes
  for (const entry of connectionMap) {
    if (entry.type !== "InputNode") {
      const node = nodeMap.get(entry.name);
      if (node !== undefined) {
        const params = parameterGroups.value.find(
          (param) => param.name === node.type,
        );
        if (params !== undefined) {
          const booleans = [];
          const decimals = [];
          const integers = [];
          const selects = [];
          const strings = [];

          for (const [inputName, inputValue] of Object.entries(node.inputs)) {
            for (const [key, value] of Object.entries(params.parameters)) {
              if (inputValue.value !== null && key === inputName) {
                switch (value) {
                  case "booleans":
                    booleans.push({
                      argument: inputName,
                      value: inputValue.value,
                    });
                    break;
                  case "decimals":
                    decimals.push({
                      argument: inputName,
                      value: inputValue.value,
                    });
                    break;
                  case "integers":
                    integers.push({
                      argument: inputName,
                      value: inputValue.value,
                    });
                    break;
                  case "selects":
                    selects.push({
                      argument: inputName,
                      values: [inputValue.value],
                    });
                    break;
                  case "strings":
                    strings.push({
                      argument: inputName,
                      value: inputValue.value,
                    });
                    break;
                }
              }
            }
          }
          if (
            processors.filter(
              (processor) => processor["path-id"] === entry.name,
            ).length === 0
          ) {
            processors.push({
              "path-id": entry.name,
              id: params.id,
              ...(booleans.length !== 0 && { booleans: booleans }),
              ...(decimals.length !== 0 && { decimals: decimals }),
              ...(integers.length !== 0 && { integers: integers }),
              ...(selects.length !== 0 && { selects: selects }),
              ...(strings.length !== 0 && { strings: strings }),
            });
          }
        }
      }
    }
  }
  return processors;
}

export function exportWorkflow(state, parameterGroups) {
  const graph = state.graph;
  const inputNode = hasInputNode(graph);
  if (!inputNode) {
    return false;
  }

  const connectionNodeMap = new Map();
  const nodeMap = new Map();

  for (const node of graph.nodes) {
    nodeMap.set(node.id, node);
    for (const value of Object.values(node.inputs)) {
      connectionNodeMap.set(value.id, node.id);
    }
    for (const value of Object.values(node.outputs)) {
      connectionNodeMap.set(value.id, node.id);
    }
  }

  const flatMap = [];
  flatMap.push({
    id: inputNode,
    name: inputNode,
    parent: 0,
  });

  for (const connection of graph.connections) {
    const fromNode = connectionNodeMap.get(connection.from);
    const toNode = connectionNodeMap.get(connection.to);

    flatMap.push({
      id: toNode,
      name: toNode,
      parent: fromNode,
    });
  }

  const filteredFlatMap = filterFlatMap(flatMap, nodeMap);
  const processors = getProcessors(filteredFlatMap, nodeMap, parameterGroups);
  const tree = flatMapToTree(filteredFlatMap);
  const paths = getPaths(tree);

  return { paths: paths, processors: processors };
}
