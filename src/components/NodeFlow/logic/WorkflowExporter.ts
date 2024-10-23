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

function getProcessors(connectionMap, nodeMap, parameterGroups, includeDisplayName: boolean) {
  const processors = [];
  // Removes all connections which contain non input root nodes
  for (const entry of connectionMap) {
    if (entry.type !== "InputNode") {
      const node = nodeMap.get(entry.name);
      if (node !== undefined) {
        const params = parameterGroups.find(
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
            if(includeDisplayName){
              processors.push({
                "path-id": entry.name,
                name: params.name,
                id: params.id,
                ...(booleans.length !== 0 && { booleans: booleans }),
                ...(decimals.length !== 0 && { decimals: decimals }),
                ...(integers.length !== 0 && { integers: integers }),
                ...(selects.length !== 0 && { selects: selects }),
                ...(strings.length !== 0 && { strings: strings }),
              });
            }else{
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
  }
  return processors;
}

function buildExportString(processString: string[], mode: string): string {
  switch(mode){
    case "Docker":
      return [
        "docker",
        "run",
        "--rm",
        "-u",
        "$(id -u)",
        "-v",
        "$PWD:/data",
        "-w",
        "/data",
        "--",
        "ocrd/all:maximum"].concat(processString).join(" ")
    case "Native":
      return processString.join(" ")
    default:
      return ""
  }
}

function buildProcessStringFromPaths(paths: number[][], processors){
  const call = [
    "ocrd",
    "process"
  ]
  paths.forEach(function (path: string[], pathIndex: number){
    console.log(pathIndex)
    let latestOutput = ""
    path.forEach(function (processorId: string, processorIndex: number){
      const processor = processors.find(
        (proc) => proc["path-id"] === processorId,
      );
      const processorCall = []

      processorCall.push(`${processor.name}`.replace(/^(ocrd-)/,""))

      processorCall.push("-I")
      latestOutput === "" ? processorCall.push("OCR-D-IMG") : processorCall.push(latestOutput)
      processorCall.push("-O")
      const outputName = `P${pathIndex}_${processor.name}_${processorIndex}`
      processorCall.push(outputName)
      latestOutput = outputName

      if(Object.hasOwn(processor, "booleans")){
        for(const entry of processor.booleans){
          processorCall.push("-P")
          processorCall.push(entry.argument)
          processorCall.push(entry.value)
        }
      }
      if(Object.hasOwn(processor, "decimals")){
        for(const entry of processor.decimals){
          processorCall.push("-P")
          processorCall.push(entry.argument)
          processorCall.push(entry.value)
        }
      }
      if(Object.hasOwn(processor, "integers")){
        for(const entry of processor.integers){
          processorCall.push("-P")
          processorCall.push(entry.argument)
          processorCall.push(entry.value)
        }
      }
      if(Object.hasOwn(processor, "selects")){
        for(const entry of processor.selects){
          processorCall.push("-P")
          processorCall.push(entry.argument)
          processorCall.push(entry.value)
        }
      }
      if(Object.hasOwn(processor, "strings")){
        for(const entry of processor.strings){
          processorCall.push("-P")
          processorCall.push(entry.argument)
          processorCall.push(entry.value)
        }
      }
      call.push("'" + processorCall.join(" ") + "'")
    })
  })
  return call
}

function findAllPaths(node, currentPath = []) {
  // Create a new path array for this iteration
  const newPath = [...currentPath, node.id];

  // If this is a leaf node (no children or empty children array)
  if (!node.children || node.children.length === 0) {
    return [newPath];
  }

  // Recursively process all children and collect their paths
  return node.children.flatMap(child =>
    findAllPaths(child, newPath)
  );
}

function getAllPaths(input) {
  return input.flatMap(node => findAllPaths(node));
}

export function checkWorkflowExportability(state): string {
  const graph = state.graph

  const inputNode = hasInputNode(graph)
  if(!inputNode){
    return "no-input-node"
  }else if(graph.nodes.some(processor => processor.type === 'calamari-predict')){
    return "non-ocrd-node"
  }
  return "yes"
}

export function exportWorkflowToFile(state, parameterGroups, mode): string{
  const graph = state.graph

  const inputNode = hasInputNode(graph)

  const connectionNodeMap = new Map()
  const nodeMap = new Map()

  for(const node of graph.nodes){
    nodeMap.set(node.id, node)
    for(const value of Object.values(node.inputs)){
      connectionNodeMap.set(value.id, node.id)
    }
    for(const value of Object.values(node.outputs)){
      connectionNodeMap.set(value.id, node.id)
    }
  }

  const flatMap= []
  flatMap.push({
    id: inputNode,
    name: inputNode,
    parent: 0
  })

  for(const connection of graph.connections){
    const fromNode = connectionNodeMap.get(connection.from)
    const toNode = connectionNodeMap.get(connection.to)

    flatMap.push({
      id: toNode,
      name: toNode,
      parent: fromNode
    })

  }

  const filteredFlatMap = filterFlatMap(flatMap, nodeMap);
  const tree = flatMapToTree(filteredFlatMap);
  const paths = getPaths(tree);
  const processors = getProcessors(filteredFlatMap, nodeMap, parameterGroups, true);
  const processString = buildProcessStringFromPaths(getAllPaths(paths), processors)
  return buildExportString(processString, mode)
}

export function saveWorkflowToBackend(state, parameterGroups) {
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
  const processors = getProcessors(filteredFlatMap, nodeMap, parameterGroups, false);
  const tree = flatMapToTree(filteredFlatMap);
  const paths = getPaths(tree);

  return { paths: paths, processors: processors };
}
