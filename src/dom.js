// Gets an array of all targeteted ekements, classes and ID's
export function getTargetElements(selectors, root) {
  const query = selectors.join(', ')
  return Array.from(root.querySelectorAll(query))
}