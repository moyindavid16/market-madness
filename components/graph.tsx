
interface graphProps {
  width?: number;
  height?: number;
  alt?: string;
}

const Graph: React.FC<graphProps> = ({
  width = 600,
  height = 400,
  alt = 'I AM A GRAPH'
}) => {
  return (
    <div className="placeholder-graph">
      <img
          src={'/components/graph.jpg'}
        width={width}
        height={height}
        alt={alt}
      />
    </div>
  );
};

export default Graph;