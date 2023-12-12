////////////////////////////////////////////////////
// Auto generated file
// Generation time: 2023-12-04 22:39:07
////////////////////////////////////////////////////

// Signal interface
export interface Signal<CallBack> {
  connect(callback: CallBack): void;
  disconnect(callback: CallBack): void;
}
