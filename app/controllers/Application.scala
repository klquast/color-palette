package controllers

import play.api._
import play.api.mvc._
import models.{Color, Palette}

object Application extends Controller {

  def index = Action {
    Ok(views.html.index())
  }

  def viewPalette = Action {
    Ok(views.html.viewPalette())
  }

  def editPalette = Action {
    Ok(views.html.editPalette(Api.cachedPalettes, Api.cachedFavorites))
  }

  def overview = Action {
    Ok(views.html.overview())
  }
}

