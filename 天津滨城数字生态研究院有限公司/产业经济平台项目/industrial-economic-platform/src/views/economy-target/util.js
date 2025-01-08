const styleList = [
  {
    value: 100,
    symbolSize: 120,
    label: {
      show: true,
      color: 'white',
      fontSize: 18,
      fontWeight: 500,
      width: 120,
      overflow: 'breakAll',
    },
    itemStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 1,
        y2: 1,
        colorStops: [
          { offset: 0, color: '#8faef9' },
          { offset: 1, color: '#356DF6' }
        ]
      },
      shadowOffsetX: 0,
      shadowOffsetY: 2,
      shadowBlur: 8,
      shadowColor: 'rgba(19,38,82,0.31)'
    }
  },
  {
    value: 60,
    symbolSize: 73,
    label: {
      show: true,
      color: '#356DF6',
      fontSize: 13,
      fontWeight: 500,
      width: 73,
      overflow: 'breakAll',
    },
    itemStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 1,
        y2: 1,
        colorStops: [
          { offset: 0, color: '#F0F5FF' },
          { offset: 0.26, color: '#EBF1FF' },
          { offset: 1, color: '#A3BEFF' }
        ]
      },
      shadowOffsetX: 2,
      shadowOffsetY: 2,
      shadowBlur: 8,
      shadowColor: 'rgba(19,38,82,0.12)'
    }
  },
  {
    value: 40,
    symbolSize: 66,
    label: {
      show: true,
      color: '#86909C',
      fontSize: 12,
      fontWeight: 500,
      width: 66,
      overflow: 'breakAll',
    },
    itemStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 1,
        y2: 1,
        colorStops: [
          { offset: 0, color: '#FEFEFF' },
          { offset: 1, color: '#F0F5FF' }
        ]
      },
      shadowOffsetX: 0,
      shadowOffsetY: 2,
      shadowBlur: 8,
      shadowColor: 'rgba(19,38,82,0.12)'
    }
  }
];

export const graphOption = {
  backgroundColor: 'white',
  animation: false,
  animationDuration: 0,
  series: {
    width: null,
    height: null,
    center: ['50%', '50%'],
    left: 0,
    top: 0,
    type: 'graph',
    layout: 'force',
    animation: false,
    force: {
      initLayout: 'none',
      gravity: null,
      repulsion: [250, 350],
      edgeLength: [50, 130],
      layoutAnimation: null,
      friction: 0.6,
    },
    roam: 'move',
    zoom: 1,
    draggable: true,
    lineStyle: {
      color: '#E5E6EB',
      width: 1,
      opacity: 1
    },
  }
};

class MyNode {
  constructor(name) {
    this.name = name;
    this.list = [];
  }

  setList(list) {
    this.list = list;
  }

  addList(name) {
    this.list.push(name);
  }

  decList(name) {
    const index = this.list.indexOf(name);
    if (index !== -1) {
      this.list.splice(index, 1);
    }
  }
}

export const getGraphByKeywordAndDepth = (graph, keyword, maxDepth) => {
  // 判断graph数据是否合法
  const idNumberMap = new Map();
  const nameNumberMap = new Map();
  // eslint-disable-next-line array-callback-return
  graph.nodes.map((item) => {
    if (idNumberMap.has(item.id)) {
      const value = idNumberMap.get(item.id);
      idNumberMap.set(item.id, value + 1);
    } else {
      idNumberMap.set(item.id, 1);
    }
    if (nameNumberMap.has(item.id)) {
      const value = nameNumberMap.get(item.id);
      nameNumberMap.set(item.id, value + 1);
    } else {
      nameNumberMap.set(item.id, 1);
    }
  });
  // 判断是否包含keyword
  if (!graph.nodes.some((item) => item.name === keyword)) {
    return {
      nodes: [],
      edges: []
    };
  }
  const nodeNameToIdMap = new Map();
  const nodeIdToNameMap = new Map();
  graph.nodes.map((item) => nodeNameToIdMap.set(item.name, item.id));
  graph.nodes.map((item) => nodeIdToNameMap.set(item.id, item.name));
  const nodeMap = new Map();
  for (let i = 0; i < graph.nodes.length; i += 1) {
    const node = graph.nodes[i];
    const target = new MyNode(node.name);
    nodeMap.set(target.name, target);
  }
  for (let i = 0; i < graph.edges.length; i += 1) {
    const edge = graph.edges[i];
    const name1 = nodeIdToNameMap.get(edge.source);
    const name2 = nodeIdToNameMap.get(edge.target);
    if (name1 && name2) {
      nodeMap.get(name1).addList(name2);
      nodeMap.get(name2).addList(name1);
    }
  }
  const queue = [];
  queue.push({
    name: keyword,
    depth: 1
  });
  const result = [];
  while (queue.length > 0) {
    const node = queue.shift();
    if (node.depth > maxDepth) {
      break;
    }
    result.push(node);
    nodeMap.get(node.name).list.forEach((item) => {
      // eslint-disable-next-line no-shadow
      if (!result.some((resultItem) => item === resultItem.name)) {
        if (!queue.some((queueItem) => item === queueItem.name)) {
          queue.push({
            name: item,
            depth: node.depth + 1,
            beforeNode: node.name
          });
        }
      }
    });
  }
  const output = {
    nodes: [],
    edges: []
  };
  result.forEach((item) => {
    output.nodes.push({
      name: item.name,
      ...styleList[item.depth - 1]
    });
    if (item.beforeNode) {
      output.edges.push({
        source: item.beforeNode,
        target: item.name,
        value: item.depth === 2 ? 15 : 15
      });
    }
  });
  return output;
};
