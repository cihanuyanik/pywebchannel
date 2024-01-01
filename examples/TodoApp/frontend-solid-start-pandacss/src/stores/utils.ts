import { produce, SetStoreFunction } from "solid-js/store";

/**
 * Creates a mutate function built on top of given setter function
 * @param store SolidJs store object
 * @param set SolidJs store object setter
 * @returns mutator function
 */
export function createMutator<TStore>(set: SetStoreFunction<TStore>) {
  return (transition: (state: TStore) => void) => {
    set(produce(transition));
  };
}
