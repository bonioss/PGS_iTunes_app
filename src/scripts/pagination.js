import $ from "jquery";

(function pagination($) {

  var currentPage = 1;

  var paginate = {
    startPos: function (pageNumber, perPage) {
     
      return pageNumber * perPage;
    },

    getPage: function (items, startPos, perPage) {
      // declare an empty array to hold our page items
      var page = [];

      // only get items after the starting position
      items = items.slice(startPos, items.length);

      if(items.length <perPage){
        perPage =items.length;
      }

      // loop remaining items until max per page
      for (var i = 0; i < perPage; i++) {
        page.push(items[i]);
      }
      return page;
    },

    totalPages: function (items, perPage) {
      // determine total number of pages
      return Math.ceil(items.length / perPage);
    },

    createBtns: function (totalPages, currentPage) {
      // create buttons to manipulate current page
      var pagination = $('<div class="pagination" />');

      if (currentPage !== 1) {
        pagination.append('<button class="pagination-button-prev"><< prev</button>');
      }

      // add a "last" button

      if (currentPage !== totalPages) {
        pagination.append($('<button class="pagination-button-next">next >></button>'));

      }



      return pagination;
    },

    createPage: function (items, currentPage, perPage) {
    
      $(".pagination").remove();

      // set context for the items
      var container = items.parent(),
        // detach items from the page and cast as array
        items = items.detach().toArray(),
        // get start position and select items for page
        startPos = this.startPos(currentPage - 1, perPage),
        page = this.getPage(items, startPos, perPage);

      // loop items and read to page
      $.each(page, function () {
        
        if (this.window === undefined) {
          container.append($(this));
        }
      });

      // prep pagination buttons and add to page
      let totalPages = this.totalPages(items, perPage);
      let pageButtons = this.createBtns(totalPages, currentPage);

      container.after(pageButtons);

      //sticky footer
      if (currentPage === totalPages) {

        var restItems = items.length % perPage;
        if (restItems > 0 && restItems <= 3) {
          document.querySelector("footer").style.marginTop = "20%";
        } else if (restItems > 3 && restItems <= 6) {
          document.querySelector("footer").style.marginTop = "12%";
        }

      } else {
        document.querySelector("footer").style.marginTop = "4%";
      }

    }
  };

  $.fn.paginate = function (perPage) {
    var items = $(this);

    // default perPage to 9
    if (isNaN(perPage) || perPage === undefined) {
      perPage = 9;
    }

    
    if (items.length <= perPage) {
      return true;
    }

    // ensure items stay in the same DOM position
    if (items.length !== items.parent()[0].children.length) {
      items.wrapAll('<div class="pagination-items" />');
    }

    // paginate the items starting at page 1
    paginate.createPage(items, 1, perPage);

    // handle click events on the buttons
    $(document).on("click", ".pagination-button-next", function (e) {
      // get current page from active button
      currentPage += 1;
      let totalPages = paginate.totalPages(items, perPage);

      // ensure newPage is in available range
      if (currentPage > 0 && currentPage <= totalPages) {
        paginate.createPage(items, currentPage, perPage);
      }
    });

    $(document).on("click", ".pagination-button-prev", function (e) {
      // get current page from active button
      currentPage -= 1;
      let totalPages = paginate.totalPages(items, perPage);

      // ensure newPage is in available range
      if (currentPage > 0 && currentPage <= totalPages) {
        paginate.createPage(items, currentPage, perPage);
      }
    });

  };

})($);
