import { produce, SetStoreFunction } from "solid-js/store";

////////////////////////////////////////////////////////////////////
// Common types and interfaces
////////////////////////////////////////////////////////////////////

/**
 * This module defines types and functions for managing entities with ids and selection states.
 */

/**
 * Define a generic type for a dictionary with string keys and values of type T
 */
export type Dictionary<T> = { [id: string]: T };

/**
 * Define a type for an entity with a string id
 */
export type EntityWithId = { id: string };

/**
 *  Define a type for an entity with a string id and a boolean isSelected property
 */
export type SelectableEntityWithId = EntityWithId & { isSelected: boolean };

/**
 *  Define a type for an update object that has a string id and partial properties of type T
 */
export type Update<T> = EntityWithId & Partial<T>;

/**
 *  Define a type for an entity state that has an array of ids, a dictionary of entities, and methods for adding, removing, updating, clearing, and reloading entities
 */
export type EntityState<T extends EntityWithId> = {
  ids: string[];
  entities: Dictionary<T>;
  /**
   * Add one or more entities to the state.
   * @param entities - A single entity or an array of entities to add.
   */
  add(entities: T | T[]): void;
  /**
   * Remove one or more entities from the state by their ids.
   * @param ids - A single id or an array of ids to remove.
   */
  remove(ids: string | string[]): void;
  /**
   * Update one or more entities in the state by their ids and partial properties.
   * @param updates - A single update object or an array of update objects to apply.
   */
  update(updates: Update<T> | Update<T>[]): void;
  /**
   * Clear all entities from the state.
   */
  clear(): void;
  /**
   * Reload the state with a new array of entities.
   * @param entities - An array of entities to reload the state with.
   */
  reload(entities: T[]): void;
};

// Define a type for a selectable entity state that extends the entity state and has an array of selected ids and methods for selecting, unselecting, and clearing selection
export type SelectableEntityState<T extends SelectableEntityWithId> =
  EntityState<T> & {
    selectedIds: string[];
    /**
     * Select one or more entities in the state by their ids.
     * @param ids - A single id or an array of ids to select.
     */
    select(ids: string | string[]): void;
    /**
     * Unselect one or more entities in the state by their ids.
     * @param ids - A single id or an array of ids to unselect.
     */
    unselect(ids: string | string[]): void;
    /**
     * Clear the selection of all entities in the state.
     */
    clearSelection(): void;
  };

// Define a type for an adaptor that has a method for getting the initial state of an entity state
export type Adaptor<T extends EntityWithId> = {
  /**
   * Get the initial state of an entity state.
   * @returns An empty entity state object.
   */
  getInitialState: () => EntityState<T>;
};

// Define a type for a selectable adaptor that has a method for getting the initial state of a selectable entity state
export type SelectableAdaptor<T extends SelectableEntityWithId> = {
  /**
   * Get the initial state of a selectable entity state.
   * @returns An empty selectable entity state object.
   */
  getInitialState: () => SelectableEntityState<T>;
};

////////////////////////////////////////////////////////////////////
// Entity Adaptor
////////////////////////////////////////////////////////////////////

/**
 * Add one entity to the state.
 * @param state - The state object to modify.
 * @param entity - The entity to add.
 */
function addOne(state: any, entity: any): void {
  // Push the entity id to the ids array
  state.ids.push(entity.id);
  // Assign the entity to the entities dictionary by its id
  state.entities[entity.id] = entity;

  // If the state has a selectedIds property
  if (state.selectedIds !== undefined) {
    // If the entity has a isSelected property that is true
    if (entity.isSelected) {
      // Push the entity id to the selectedIds array
      state.selectedIds.push(entity.id);
    }
  }
}

/**
 * Add many entities to the state.
 * @param state - The state object to modify.
 * @param entities - An array of entities to add.
 */
function addMany(state: any, entities: any[]): void {
  // Loop through each entity in the array
  for (const entity of entities) {
    // Call the addOne function with the state and the entity
    addOne(state, entity);
  }
}

/**
 * Remove one entity from the state by its id.
 * @param state - The state object to modify.
 * @param id - The id of the entity to remove.
 */
function removeOne(state: any, id: string): void {
  // Filter out the id from the ids array
  state.ids = state.ids.filter((_id: string) => _id !== id);
  // Delete the entity from the entities dictionary by its id
  delete state.entities[id];

  // If the state has a selectedIds property
  if (state.selectedIds !== undefined) {
    // Filter out the id from the selectedIds array
    state.selectedIds = state.selectedIds.filter((_id: string) => _id !== id);
  }
}

/**
 * Remove many entities from the state by their ids.
 * @param state - The state object to modify.
 * @param ids - An array of ids of the entities to remove.
 */
function removeMany(state: any, ids: string[]): void {
  // Filter out the ids from the ids array
  state.ids = state.ids.filter((id: string) => !ids.includes(id));
  // Loop through each id in the array
  for (const id of ids) {
    // Delete the entity from the entities dictionary by its id
    delete state.entities[id];
  }

  // If the state has a selectedIds property
  if (state.selectedIds !== undefined) {
    // Filter out the ids from the selectedIds array
    state.selectedIds = state.selectedIds.filter(
      (id: string) => !ids.includes(id),
    );
  }
}

/**
 * Update one entity in the state by its id and partial properties.
 * @param state - The state object to modify.
 * @param update - An update object that has the id and partial properties of the entity to update.
 */
function updateOne(state: any, update: Update<any>): void {
  // If the state has a selectedIds property
  if (state.selectedIds !== undefined) {
    // If the update object has a isSelected property that is true and the entity in the state has a isSelected property that is false
    if (update.isSelected && !state.entities[update.id].isSelected) {
      // Push the update id to the selectedIds array
      state.selectedIds.push(update.id);
      // Else if the update object has a isSelected property that is false and the entity in the state has a isSelected property that is true
    } else if (!update.isSelected && state.entities[update.id].isSelected) {
      // Filter out the update id from the selectedIds array
      state.selectedIds = state.selectedIds.filter(
        (id: string) => id !== update.id,
      );
    }
  }

  // Loop through each property in the update object
  for (const prop of Object.keys(update)) {
    // Assign the property value to the entity in the state by its id and property name
    state.entities[update.id][prop] = update[prop];
  }
}

/**
 * Update many entities in the state by their ids and partial properties.
 * @param state - The state object to modify.
 * @param updates - An array of update objects that have the ids and partial properties of the entities to update.
 */
function updateMany(state: any, updates: Update<any>[]): void {
  // Loop through each update object in the array
  for (const update of updates) {
    // Call the updateOne function with the state and the update object
    updateOne(state, update);
  }
}

/**
 * Clear all entities from the state.
 * @param state - The state object to modify.
 */
function clearAll(state: any): void {
  // Assign an empty array to the ids property
  state.ids = [];
  // Assign an empty object to the entities property
  state.entities = {};
  // If the state has a selectedIds property
  if (state.selectedIds !== undefined) {
    // Assign an empty array to the selectedIds property
    state.selectedIds = [];
  }
}

/**
 * Reload the state with a new array of entities.
 * @param state - The state object to modify.
 * @param entities - An array of entities to reload the state with.
 */
function reloadEntities(state: any, entities: any[]): void {
  // Call the clearAll function with the state
  clearAll(state);
  // Call the addMany function with the state and the entities array
  addMany(state, entities);
}

/**
 * Select one entity in the state by its id.
 * @param state - The state object to modify.
 * @param id - The id of the entity to select.
 */
function selectOne(state: any, id: string): void {
  // If the entity in the state has a isSelected property that is false
  if (!state.entities[id].isSelected) {
    // Assign true to the isSelected property of the entity in the state by its id
    state.entities[id].isSelected = true;
    // Push the id to the selectedIds array
    state.selectedIds.push(id);
  }
}

/**
 * Select many entities in the state by their ids.
 * @param state - The state object to modify.
 * @param ids - An array of ids of the entities to select.
 */
function selectMany(state: any, ids: string[]): void {
  // Loop through each id in the array
  for (const id of ids) {
    // Call the selectOne function with the state and the id
    selectOne(state, id);
  }
}

/**
 * Unselect one entity in the state by its id.
 * @param state - The state object to modify.
 * @param id - The id of the entity to unselect.
 */
function unselectOne(state: any, id: string): void {
  // If the entity in the state has a isSelected property that is true
  if (state.entities[id].isSelected) {
    // Assign false to the isSelected property of the entity in the state by its id
    state.entities[id].isSelected = false;
    // Filter out the id from the selectedIds array
    state.selectedIds = state.selectedIds.filter((_id: string) => _id !== id);
  }
}

/**
 * Unselect many entities in the state by their ids.
 * @param state - The state object to modify.
 * @param ids - An array of ids of the entities to unselect.
 */
function unselectMany(state: any, ids: string[]): void {
  // Loop through each id in the array
  for (const id of ids) {
    // Call the unselectOne function with the state and the id
    unselectOne(state, id);
  }
}

/**
 * Clear the selection of all entities in the state.
 * @param state - The state object to modify.
 */
function clearAllSelections(state: any): void {
  // Loop through each id in the selectedIds array
  for (const selectedId of state.selectedIds) {
    // Assign false to the isSelected property of the entity in the state by its id
    state.entities[selectedId].isSelected = false;
  }
  // Assign an empty array to the selectedIds property
  state.selectedIds = [];
}

////////////////////////////////////////////////////////////////////

/**
 * This function creates an adaptor object that provides a method for getting the initial state of an entity state or a selectable entity state.
 * @param setAccessor - A function that returns a function that sets the state of a store.
 * @param selectable - A boolean flag that indicates whether the entities are selectable or not. Default is false.
 * @returns An adaptor object that has a getInitialState method that returns an entity state or a selectable entity state object.
 */
export function createAdaptor<T extends EntityWithId | SelectableEntityWithId>(
  setAccessor: () => SetStoreFunction<any>,
  selectable = false,
  // @ts-ignore
): Adaptor<T> | SelectableAdaptor<T> {
  return {
    // @ts-ignore
    getInitialState: (): EntityState<T> | SelectableEntityState<T> => {
      // Initialize an empty state object with ids and entities properties
      let initState = {
        ids: [] as string[],
        entities: {} as Dictionary<T>,
      };

      // If the selectable flag is true
      if (selectable) {
        // Add a selectedIds property to the state object
        // @ts-ignore
        initState["selectedIds"] = [] as string[];
      }

      // Add an add method to the state object that takes one or more entities and adds them to the state
      // @ts-ignore
      initState["add"] = (entities: T | T[]) => {
        // Call the setAccessor function and pass a function that modifies the state using the produce function
        setAccessor()(
          produce((state) => {
            // If the entities parameter is an array
            if (Array.isArray(entities)) {
              // Call the addMany function with the state and the entities array
              addMany(state, entities);
              // Else
            } else {
              // Call the addOne function with the state and the single entity
              addOne(state, entities);
            }
          }),
        );
      };

      // Add a remove method to the state object that takes one or more ids and removes the corresponding entities from the state
      // @ts-ignore
      initState["remove"] = (ids: string | string[]) => {
        // Call the setAccessor function and pass a function that modifies the state using the produce function
        setAccessor()(
          produce((state) => {
            // If the ids parameter is an array
            if (Array.isArray(ids)) {
              // Call the removeMany function with the state and the ids array
              removeMany(state, ids);
              // Else
            } else {
              // Call the removeOne function with the state and the single id
              removeOne(state, ids);
            }
          }),
        );
      };

      // Add an update method to the state object that takes one or more update objects and updates the corresponding entities in the state
      // @ts-ignore
      initState["update"] = (updates: Update<T> | Update<T>[]) => {
        // Call the setAccessor function and pass a function that modifies the state using the produce function
        setAccessor()(
          produce((state) => {
            // If the updates parameter is an array
            if (Array.isArray(updates)) {
              // Call the updateMany function with the state and the updates array
              updateMany(state, updates);
              // Else
            } else {
              // Call the updateOne function with the state and the single update object
              updateOne(state, updates);
            }
          }),
        );
      };

      // Add a clear method to the state object that clears all entities from the state
      // @ts-ignore
      initState["clear"] = () => {
        // Call the setAccessor function and pass a function that modifies the state using the produce function
        setAccessor()(
          produce((state) => {
            // Call the clearAll function with the state
            clearAll(state);
          }),
        );
      };

      // Add a reload method to the state object that reloads the state with a new array of entities
      // @ts-ignore
      initState["reload"] = (entities: T[]) => {
        // Call the setAccessor function and pass a function that modifies the state using the produce function
        setAccessor()(
          produce((state) => {
            // Call the reloadEntities function with the state and the entities array
            reloadEntities(state, entities);
          }),
        );
      };

      // If the selectable flag is true
      if (selectable) {
        // Add a select method to the state object that takes one or more ids and selects the corresponding entities in the state
        // @ts-ignore
        initState["select"] = (ids: string | string[]) => {
          // Call the setAccessor function and pass a function that modifies the state using the produce function
          setAccessor()(
            produce((state) => {
              // If the ids parameter is an array
              if (Array.isArray(ids)) {
                // Call the selectMany function with the state and the ids array
                selectMany(state, ids);
                // Else
              } else {
                // Call the selectOne function with the state and the single id
                selectOne(state, ids);
              }
            }),
          );
        };

        // Add an unselect method to the state object that takes one or more ids and unselects the corresponding entities in the state
        // @ts-ignore
        initState["unselect"] = (ids: string | string[]) => {
          // Call the setAccessor function and pass a function that modifies the state using the produce function
          setAccessor()(
            produce((state) => {
              // If the ids parameter is an array
              if (Array.isArray(ids)) {
                // Call the unselectMany function with the state and the ids array
                unselectMany(state, ids);
                // Else
              } else {
                // Call the unselectOne function with the state and the single id
                unselectOne(state, ids);
              }
            }),
          );
        };

        // Add a clearSelection method to the state object that clears the selection of all entities in the state
        // @ts-ignore
        initState["clearSelection"] = () => {
          // Call the setAccessor function and pass a function that modifies the state using the produce function
          setAccessor()(
            produce((state) => {
              // Call the clearAllSelections function with the state
              clearAllSelections(state);
            }),
          );
        };
      }

      // Return the state object
      // @ts-ignore
      return initState;
    },
  };
}
