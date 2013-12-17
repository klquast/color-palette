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
      Palette(
        "first",
        Seq(
          Color("FFF", "description", 0, Option("bright")),
          Color("000", "description 2", 1, None)),
        true,
        "first palette",
        Some(1)),
      Palette(
        "second", 
        Seq(
          Color("FFF", "description", 0, None),
          Color("000", "description 2", 1, Option("dark"))),
        true, 
        "first palette", 
        Some(2)))
    Ok(views.html.editPalette(palettes))
  }

  def overview = Action {
    Ok(views.html.overview())
  }
}

