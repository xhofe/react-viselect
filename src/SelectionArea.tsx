import VanillaSelectionArea from "@viselect/vanilla";
import type {
  SelectionEvents,
  PartialSelectionOptions,
  SelectionEvent,
} from "@viselect/vanilla";
import React, {
  useEffect,
  createContext,
  useContext,
  useRef,
  useState,
  useEffectEvent,
} from "react";

export interface SelectionAreaProps
  extends PartialSelectionOptions,
    React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  className?: string;
  onBeforeStart?: SelectionEvents["beforestart"];
  onBeforeDrag?: SelectionEvents["beforedrag"];
  onStart?: SelectionEvents["start"];
  onMove?: SelectionEvents["move"];
  onStop?: SelectionEvents["stop"];
  deps?: unknown[];
}

const SelectionContext = createContext<VanillaSelectionArea | undefined>(
  undefined
);

export const useSelection = () => useContext(SelectionContext);

export const SelectionArea: React.FunctionComponent<SelectionAreaProps> = (
  props
) => {
  const [instance, setInstance] = useState<VanillaSelectionArea | undefined>(
    undefined
  );
  const root = useRef<HTMLDivElement>(null);
  const {
    boundaries = root.current,
    onBeforeStart,
    onBeforeDrag,
    onStart,
    onMove,
    onStop,
    deps = [],
    ...opt
  } = props;

  const eventOnBeforeStart = useEffectEvent((evt: SelectionEvent) => {
    onBeforeStart?.(evt);
  });
  const eventOnBeforeDrag = useEffectEvent((evt: SelectionEvent) => {
    onBeforeDrag?.(evt);
  });
  const eventOnStart = useEffectEvent((evt: SelectionEvent) => {
    onStart?.(evt);
  });
  const eventOnMove = useEffectEvent((evt: SelectionEvent) => {
    onMove?.(evt);
  });
  const eventOnStop = useEffectEvent((evt: SelectionEvent) => {
    onStop?.(evt);
  });

  useEffect(() => {
    const selection = new VanillaSelectionArea({
      boundaries: boundaries as HTMLElement,
      ...opt,
    });

    selection.on("beforestart", eventOnBeforeStart);
    selection.on("beforedrag", eventOnBeforeDrag);
    selection.on("start", eventOnStart);
    selection.on("move", eventOnMove);
    selection.on("stop", eventOnStop);

    setInstance(selection);
    return () => {
      selection.destroy();
      setInstance(undefined);
    };
  }, [...deps, boundaries]);

  return (
    <SelectionContext.Provider value={instance}>
      {props.boundaries ? (
        props.children
      ) : (
        <div ref={root} className={props.className} id={props.id}>
          {props.children}
        </div>
      )}
    </SelectionContext.Provider>
  );
};
