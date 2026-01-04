import VanillaSelectionArea from "@viselect/vanilla";
import type {
  SelectionEvents,
  PartialSelectionOptions,
} from "@viselect/vanilla";
import React, {
  useEffect,
  createContext,
  useContext,
  useRef,
  useState,
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

  useEffect(() => {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const {
      boundaries = root.current,
      onBeforeStart,
      onBeforeDrag,
      onStart,
      onMove,
      onStop,
      ...opt
    } = props;

    const selection = new VanillaSelectionArea({
      boundaries: boundaries as HTMLElement,
      ...opt,
    });

    selection.on("beforestart", (evt) => onBeforeStart?.(evt));
    selection.on("beforedrag", (evt) => onBeforeDrag?.(evt));
    selection.on("start", (evt) => onStart?.(evt));
    selection.on("move", (evt) => onMove?.(evt));
    selection.on("stop", (evt) => onStop?.(evt));

    setInstance(selection);
    return () => {
      selection.destroy();
      setInstance(undefined);
    };
  }, props.deps ?? []);

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
