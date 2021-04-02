// App logic.
window.myApp = {};

document.addEventListener('init', function(event) {
  var page = event.target;

  // Lancement, association des controleurs
  if (myApp.controllers.hasOwnProperty(page.id)) {
    myApp.controllers[page.id](page);
  }

  // Se produit au lancement de l'application
  if (page.id === 'menuPage' || page.id === 'pendingTasksPage') {
    if (document.querySelector('#menuPage')
      && document.querySelector('#pendingTasksPage')
      && !document.querySelector('#pendingTasksPage ons-list-item')
    ) {
      Object.keys(localStorage).forEach(function (key) {
        let data = JSON.parse(localStorage.getItem(key));
        myApp.services.tasks.create(data);
      });
    }
  }

});

