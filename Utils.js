module.exports = {
  disableButtons(components) {
    for (let x = 0; x < components.length; x++) {
        for (let y = 0; y < components[x].components.length; y++) {
            components[x].components[y].disabled = true;
        }
    }
    return components;
}
}