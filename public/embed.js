(function () {
  window.Xendor = {
    init: function ({ containerId, destino }) {
      import('/embed/script.js').then((mod) => {
        mod.mountXendor(containerId, destino)
      })
    }
  }
})()