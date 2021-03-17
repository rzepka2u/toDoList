/***********************************************************************
 * App Controllers. These controllers will be called on page initialization. *
 ***********************************************************************/

myApp.controllers = {

  //////////////////////////
  // Controleur onglets //
  //////////////////////////
  tabbarPage: function(page) {
    // Set button functionality to open/close the menu.
    page.querySelector('[component="button/menu"]').onclick = function() {
      document.querySelector('#mySplitter').left.toggle();
    };

    // Set button functionality to push 'new_task.html' page.
    Array.prototype.forEach.call(page.querySelectorAll('[component="button/new-task"]'), function(element) {
      element.onclick = function() {
        document.querySelector('#myNavigator').pushPage('html/new_task.html');
      };

      element.show && element.show(); // Fix ons-fab in Safari.
    });
  },

  ////////////////////////
  // Controleur Menu //
  ////////////////////////
  menuPage: function(page) {
    // Set functionality for 'No Category' and 'All' default categories respectively.
    myApp.services.categories.bindOnCheckboxChange(page.querySelector('#default-category-list ons-list-item[category-id=""]'));
    myApp.services.categories.bindOnCheckboxChange(page.querySelector('#default-category-list ons-list-item:not([category-id])'));

    // Change splitter animation depending on platform.
    document.querySelector('#mySplitter').left.setAttribute('animation', ons.platform.isAndroid() ? 'overlay' : 'reveal');
  },

  ////////////////////////////
  // Controleur ajout tache //
  ////////////////////////////
  newTaskPage: function(page) {
    // Bouton save
    Array.prototype.forEach.call(page.querySelectorAll('[component="button/save-task"]'), function(element) {
      element.onclick = function() {
        var newTitle = page.querySelector('#title-input').value;

        if (newTitle) {
          // Si le champ de texte n'est pas vide alors on peut ajouter la nouvelle tache
          myApp.services.tasks.create(
              {
                title: newTitle,
                category: page.querySelector('#category-input').value,
                description: page.querySelector('#description-input').value,
                highlight: page.querySelector('#highlight-input').checked,
                urgent: page.querySelector('#urgent-input').checked
              }
          );

          // Set selected category to 'All', refresh and pop page.
          document.querySelector('#default-category-list ons-list-item ons-radio').checked = true;
          document.querySelector('#default-category-list ons-list-item').updateCategoryView();
          document.querySelector('#myNavigator').popPage();

        } else {
          // Affichage d'une barre d'erreur
          ons.notification.toast('Il faut obligatoirement ajouter un titre', {timeout:3000});
        }
      };
    });
  },

  ////////////////////////////////
  // Controleur de l'edition d'une tache //
  ///////////////////////////////
  detailsTaskPage: function(page) {
    // Récupèration de l'élément passé en argument à pushPage
    var element = page.data.element;

    // Remplissage avec les données stockées.
    page.querySelector('#title-input').value = element.data.title;
    page.querySelector('#category-input').value = element.data.category;
    page.querySelector('#description-input').value = element.data.description;
    page.querySelector('#highlight-input').checked = element.data.highlight;
    page.querySelector('#urgent-input').checked = element.data.urgent;

    // Définis la fonctionnalité du bouton pour enregistrer une tâche existante.
    page.querySelector('[component="button/save-task"]').onclick = function() {
      var newTitle = page.querySelector('#title-input').value;

      if (newTitle) {
        // Si le titre entré n'est pas vide, demande de confirmation avant de sauvegarder
        ons.notification.confirm(
            {
              title: 'Enregister les modifications ?',
              message: 'Les données précédentes seront écrasées',
              buttonLabels: ['Annuler', 'Enregistrer']
            }
        ).then(function(buttonIndex) {
          if (buttonIndex === 1) {
            // si le bouton 'Enregistrer' a été cliqué, écrasement de la tâche
            myApp.services.tasks.update(element,
                {
                  title: newTitle,
                  category: page.querySelector('#category-input').value,
                  description: page.querySelector('#description-input').value,
                  urgent: page.querySelector('#urgent-input').checked,
                  highlight: page.querySelector('#highlight-input').checked
                }
            );

            // Set selected category to 'All', refresh and pop page.
            document.querySelector('#default-category-list ons-list-item ons-radio').checked = true;
            document.querySelector('#default-category-list ons-list-item').updateCategoryView();
            document.querySelector('#myNavigator').popPage();
          }
        });

      } else {
        // Affichage d'une barre d'erreur
        ons.notification.toast('Il faut obligatoirement ajouter un titre', {timeout:3000});
      }
    };
  }

};
