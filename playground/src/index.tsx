import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { SelectionArea, type SelectionEvent } from "../../src";
import "./index.css";

const SelectableArea = ({
  boxes,
  offset,
  className,
}: {
  boxes: number;
  offset: number;
  className: string;
}) => {
  const [selected, setSelected] = useState<Set<number>>(() => new Set());

  const extractIds = (els: Element[]): number[] =>
    els
      .map((v) => v.getAttribute("data-key"))
      .filter(Boolean)
      .map((id) => idMap.get(Number(id)))
      .map(Number);

  const onStart = ({ event, selection }: SelectionEvent) => {
    if (!event?.ctrlKey && !event?.metaKey) {
      selection.clearSelection();
      setSelected(() => new Set());
    }
  };

  // randomize and unique boxids
  const uniqueBoxids = useMemo(
    () => [
      ...new Set(
        Array.from({ length: boxes }, () => Math.floor(Math.random() * 100) + 1)
      ),
    ],
    [boxes]
  );

  const idMap = useMemo(() => {
    const map = new Map<number, number>();
    uniqueBoxids.forEach((id, index) => {
      map.set(id, id);
    });
    return map;
  }, [uniqueBoxids]);

  const onMove = ({
    store: {
      changed: { added, removed },
    },
  }: SelectionEvent) => {
    setSelected((prev) => {
      const next = new Set(prev);
      extractIds(added).forEach((id) => next.add(id));
      extractIds(removed).forEach((id) => next.delete(id));
      return next;
    });
  };

  return (
    <SelectionArea
      className={`container ${className}`}
      onStart={onStart}
      onMove={onMove}
      selectables=".selectable"
      // boundaries={`.container.${className}`}
      // deps={[uniqueBoxids]}
    >
      {/* <div className={`container ${className}`}> */}
      {uniqueBoxids.map((id) => (
        <div
          className={selected.has(id) ? "selected selectable" : "selectable"}
          data-key={id}
          key={id}
        />
      ))}
      {/* </div> */}
    </SelectionArea>
  );
};

function App() {
  const [boxes, setBoxes] = useState([21, 42, 252]);
  return (
    <React.StrictMode>
      <h1>React</h1>
      <button
        onClick={() =>
          setBoxes([
            Math.floor(Math.random() * 100) + 1,
            Math.floor(Math.random() * 100) + 1,
            Math.floor(Math.random() * 100) + 1,
          ])
        }
      >
        Randomize
      </button>
      <SelectableArea boxes={boxes[0]} offset={0} className="green" />
      <SelectableArea boxes={boxes[1]} offset={42} className="blue" />
      <SelectableArea boxes={boxes[2]} offset={82} className="red" />
    </React.StrictMode>
  );
}

const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(<App />);
