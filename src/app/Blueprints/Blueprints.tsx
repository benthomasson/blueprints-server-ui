import * as React from 'react';
import {
  ColaLayout,
  ComponentFactory,
  DefaultEdge,
  DefaultGroup,
  DefaultNode,
  EdgeStyle,
  Graph,
  GraphComponent,
  Layout,
  LayoutFactory,
  Model,
  ModelKind,
  NodeShape,
  SELECTION_EVENT,
    useComponentFactory,
    useModel,
  Visualization,
  VisualizationProvider,
  VisualizationSurface
} from '@patternfly/react-topology';
import withTopologySetup from '../TopologyDemo/utils/withTopologySetup';
import defaultComponentFactory from '../TopologyDemo/components/defaultComponentFactory';
import stylesComponentFactory from '../TopologyDemo/components/stylesComponentFactory';
 import { logos } from '../TopologyDemo/utils/logos';
import {
  AlternateTerminalTypes,
  createBadgeNodes,
  createGroupedGroupNodes,
  createGroupNodes,
  createNode,
  createStatusNodeShapes,
  createUnGroupedGroupNodes,
  EDGE_ANIMATION_SPEED_COUNT,
  EDGE_ANIMATION_SPEEDS,
  EDGE_STYLE_COUNT,
  EDGE_STYLES,
  EDGE_TERMINAL_TYPES,
  EDGE_TERMINAL_TYPES_COUNT,
  RIGHT_LABEL_COLUMN_WIDTH,
  STATUS_VALUES
} from '../TopologyDemo/utils/styleUtils';

import useSWR from 'swr'

const fetcher = url => fetch(url).then(r => r.json())

const baselineLayoutFactory: LayoutFactory = (type: string, graph: Graph): Layout | undefined => {
  switch (type) {
    case 'Cola':
      return new ColaLayout(graph);
    default:
      return new ColaLayout(graph, { layoutOnDrag: false });
  }
};

const baselineComponentFactory: ComponentFactory = (kind: ModelKind, type: string) => {
  switch (type) {
    case 'group':
      return DefaultGroup;
    default:
      switch (kind) {
        case ModelKind.graph:
          return GraphComponent;
        case ModelKind.node:
          return DefaultNode;
        case ModelKind.edge:
          return DefaultEdge;
        default:
          return undefined;
      }
  }
};

const NODE_SHAPE = NodeShape.ellipse;
const NODE_DIAMETER = 75;

const NODES = [
  {
    id: 'node-0',
    type: 'node',
    label: 'Node 0',
    width: NODE_DIAMETER,
    height: NODE_DIAMETER,
    shape: NODE_SHAPE
  },
  {
    id: 'node-1',
    type: 'node',
    label: 'Node 1',
    width: NODE_DIAMETER,
    height: NODE_DIAMETER,
    shape: NODE_SHAPE
  },
  {
    id: 'node-2',
    type: 'node',
    label: 'Node 2',
    width: NODE_DIAMETER,
    height: NODE_DIAMETER,
    shape: NODE_SHAPE
  },
  {
    id: 'node-3',
    type: 'node',
    label: 'Node 3',
    width: NODE_DIAMETER,
    height: NODE_DIAMETER,
    shape: NODE_SHAPE
  },
  {
    id: 'node-4',
    type: 'node',
    label: 'Node 4',
    width: NODE_DIAMETER,
    height: NODE_DIAMETER,
    shape: NODE_SHAPE
  },
  {
    id: 'node-5',
    type: 'node',
    label: 'Node 5',
    width: NODE_DIAMETER,
    height: NODE_DIAMETER,
    shape: NODE_SHAPE
  },
  {
    id: 'Group-1',
    children: ['node-0', 'node-1', 'node-2'],
    type: 'group',
    group: true,
    label: 'Group-1',
    style: {
      padding: 40
    }
  }
];

const EDGES = [
  {
    id: 'edge-node-4-node-5',
    type: 'edge',
    source: 'node-4',
    target: 'node-5',
    edgeStyle: EdgeStyle.default
  },
  {
    id: 'edge-node-0-node-2',
    type: 'edge',
    source: 'node-0',
    target: 'node-2',
    edgeStyle: EdgeStyle.default
  }
];
window.NODES = NODES;
window.EDGES = EDGES;

function Hello() {
  const { data, error, isLoading } = useSWR('http://localhost:8000/', fetcher)

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>
  return <div>hello {data.name}!</div>
}

function useHello () {
  const { data, error, isLoading } = useSWR('http://localhost:8000/', fetcher)

    console.log(data);
    console.log(error);
    console.log(isLoading);

  return {
    hello: data,
    isLoading,
    isError: error
  }
}

function useNodes () {
  const { data, error, isLoading } = useSWR('http://localhost:8000/nodes', fetcher)

    console.log(data);
    console.log(error);
    console.log(isLoading);

  return {
    nodes: data,
    isLoading,
    isError: error
  }
}

function useEdges () {
  const { data, error, isLoading } = useSWR('http://localhost:8000/edges', fetcher)

    console.log(data);
    console.log(error);
    console.log(isLoading);

  return {
    edges: data,
    isLoading,
    isError: error
  }
}

export const Blueprints: React.FC = () => {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const { hello, isLoading, isError } = useHello();
  const { nodes, isLoading, isError } = useNodes();
  const { edges, isLoading, isError } = useEdges();


  const controller = React.useMemo(() => {
    const model: Model = {
      nodes: nodes,
      edges: edges,
      graph: {
        id: 'g1',
        type: 'graph',
        layout: 'Cola'
      }
    };

    const newController = new Visualization();
    newController.registerLayoutFactory(baselineLayoutFactory);
    newController.registerComponentFactory(baselineComponentFactory);

    newController.addEventListener(SELECTION_EVENT, setSelectedIds);

    newController.fromModel(model, false);



    return newController;
  }, [nodes, edges]);


  return (
    <VisualizationProvider controller={controller}>
      <VisualizationSurface state={{ selectedIds }} />
    </VisualizationProvider>
  );
};


export const GroupedGroupsStyles = withTopologySetup(() => {
  useComponentFactory(defaultComponentFactory);
  useComponentFactory(stylesComponentFactory);
  const groupedGroupNodes: NodeModel[] = createGroupedGroupNodes('GroupedGroup');
  const ungroupedGroupNodes: NodeModel[] = createUnGroupedGroupNodes('Group 1');

  const groupNode = {
    id: 'Group 1',
    type: 'group',
    label: 'Node Group Title',
    children: ['GroupedGroup', ...ungroupedGroupNodes.map(n => n.id)],
    group: true,
    style: { padding: 17 },
    data: {
      badge: 'Label',
      badgeColor: '#F2F0FC',
      badgeTextColor: '#5752d1',
      badgeBorderColor: '#CBC1FF',
      collapsedWidth: 75,
      collapsedHeight: 75,
      showContextMenu: true,
      labelIconClass: logos.get('icon-java')
    }
  };

  const groupedGroupNodes2: NodeModel[] = createGroupedGroupNodes('GroupedGroup2', 500);
  const ungroupedGroupNodes2: NodeModel[] = createUnGroupedGroupNodes('Group 2', 500);

  const groupNode2 = {
    id: 'Group 2',
    type: 'group',
    label: 'Node Group Title',
    children: ['GroupedGroup2', ...ungroupedGroupNodes2.map(n => n.id)],
    group: true,
    style: { padding: 17 },
    data: {
      badge: 'Label',
      badgeColor: '#F2F0FC',
      badgeTextColor: '#5752d1',
      badgeBorderColor: '#CBC1FF',
      collapsedWidth: 75,
      collapsedHeight: 75,
      selected: true,
      showContextMenu: true,
      labelIconClass: logos.get('icon-jenkins')
    }
  };

  useModel({
    graph: {
      id: 'g1',
      type: 'graph'
    },
    nodes: [
      ...groupedGroupNodes,
      ...ungroupedGroupNodes,
      groupNode,
      ...groupedGroupNodes2,
      ...ungroupedGroupNodes2,
      groupNode2
    ]
  });
  return null;
});
