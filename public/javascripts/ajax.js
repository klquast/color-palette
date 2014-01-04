/*------------------------------------------------------------------------------------------------------------------
*                                            Ajax Utility
------------------------------------------------------------------------------------------------------------------*/
var Ajaxable = function(url){
    this.create = function(newObject) {
        return $.ajax({
            type: "POST",
            url: "/api/" + url,
            data: JSON.stringify(newObject),
            contentType: "application/json"
        })
    };
    this.update = function(id, updatedObject) {
        return $.ajax({
            type: "PUT",
            url: "/api/" + url + "/" + id,
            data: JSON.stringify(updatedObject),
            contentType: "application/json"
        })
    };
    this.delete = function(id) {
        return $.ajax({
            type: "DELETE",
            url: "/api/" + url + "/" + id
        })
    };
    this.getById = function(id) {
        return $.ajax({
            type: "GET",
            url: "/api/" + url + "/" + id
        })
    };
    this.getAll = function() {
        return $.ajax({
            type: "GET",
            url: "/api/" + url
        })
    };
}

/*------------------------------------------------------------------------------------------------------------------
*                                            Ajaxable Objects
------------------------------------------------------------------------------------------------------------------*/
var favoritesAjax = new Ajaxable("favorites");
var palettesAjax = new Ajaxable("palettes");
