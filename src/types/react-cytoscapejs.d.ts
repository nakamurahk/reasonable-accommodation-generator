declare module 'react-cytoscapejs' {
  import { Core, ElementDefinition, LayoutOptions, Stylesheet } from 'cytoscape';
  import { Component } from 'react';

  interface CytoscapeComponentProps {
    elements: ElementDefinition[];
    layout?: LayoutOptions;
    style?: React.CSSProperties;
    cy?: (cy: Core) => void;
    stylesheet?: Stylesheet[];
    className?: string;
    id?: string;
  }

  export default class CytoscapeComponent extends Component<CytoscapeComponentProps> {}
}
