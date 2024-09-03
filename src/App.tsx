import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import "./App.css";
import rough from "roughjs";
import { Options } from "roughjs/bin/core";

const lineOptions: Options = {
  fill: "red",
  stroke: "white",
  strokeWidth: 2,
  roughness: 0.8,
  bowing: 2,
};

const rectOptions: Options = {
  fill: "rgba(255,0,200,0.2)",
  stroke: "rgba(0,0,0,0)",
  fillStyle: "zigzag",
  fillWeight: 4,
  strokeWidth: 5,
  roughness: 0.2,
  bowing: 2,
  hachureAngle: 70, // angle of hachure,
  hachureGap: 10,
};

function App() {
  const [, render] = useReducer((prev) => prev + 1, {});
  return (
    <div>
      <RoughCanvas>
        <Rect x={5} y={5} width={90} height={90} options={rectOptions} />
        <Rect x={105} y={5} width={90} height={90} options={rectOptions} />
        <Rect x={5} y={105} width={90} height={90} options={rectOptions} />
        <Rect x={105} y={105} width={90} height={90} options={rectOptions} />
        <Line x1={0} x2={0} y1={0} y2={200} options={lineOptions} />
        <Line x1={100} x2={100} y1={0} y2={200} options={lineOptions} />
        <Line x1={200} x2={200} y1={0} y2={200} options={lineOptions} />
        <Line y1={0} y2={0} x1={0} x2={200} options={lineOptions} />
        <Line y1={100} y2={100} x1={0} x2={200} options={lineOptions} />
        <Line y1={200} y2={200} x1={0} x2={200} options={lineOptions} />
      </RoughCanvas>

      <button onClick={() => render()}>Render</button>
    </div>
  );
}

const RoughContext = createContext<ReturnType<
  typeof rough.svg | typeof rough.canvas
> | null>(null);

function RoughCanvas({ children }: PropsWithChildren) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rc, setRc] = useState<ReturnType<typeof rough.canvas> | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        setRc(rough.canvas(canvasRef.current));
      }
    }
  }, []);

  return (
    <RoughContext.Provider value={rc}>
      <canvas width={200} height={200} className="vector" ref={canvasRef}>
        {children}
      </canvas>
    </RoughContext.Provider>
  );
}

type RectProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  options?: Options;
};

function Rect({ x, y, width, height, options }: RectProps) {
  const rc = useContext(RoughContext);

  useEffect(() => {
    if (rc) {
      rc.rectangle(x, y, width, height, options);
    }
  }, [rc, x, y, width, height, options]);

  return null;
}

type LineProps = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  options?: Options;
};

function Line({ x1, x2, y1, y2, options }: LineProps) {
  const rc = useContext(RoughContext);

  useEffect(() => {
    if (rc) {
      rc.line(x1, y1, x2, y2, options);
    }
  }, [rc, x1, x2, y1, y2, options]);

  return null;
}

export default App;
