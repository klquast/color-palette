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
    val palettes = Seq(
      Palette("first", Seq(Color("FFF", true, "description", Some(1), 0), Color("000", true, "description 2", Some(2), 1)), true, "first palette", Some(1)),
      Palette("second", Seq(Color("FFF", true, "description", Some(1), 0), Color("000", true, "description 2", Some(2), 1)), true, "first palette", Some(2)))
    Ok(views.html.editPalette(palettes))
  }

  def overview = Action {
    Ok(views.html.overview())
  }
}

