package controllers

import play.api._
import play.api.mvc._
import models.{Color, Palette}
import play.api.libs.json._

import scala.collection.mutable.ListBuffer

/*

# Favorites API
GET /api/favorites                  controllers.Api.getAllFavorites()
DELETE /api/favorites/:hexValue     controllers.Api.removeFavorite(hexValue: String)
PUT /api/favorites/:hexValue        controllers.Api.createFavorite(hexValue: String)

# Palette API
GET /api/palettes                   controllers.Api.getAllPalettes
GET /api/palettes/:paletteId        controllers.Api.getPaletteById(paletteId: Int)
PUSH /api/palettes                  controllers.Api.createPalette()
PUT /api/palettes/:paletteId        controllers.Api.updatePalette(paletteId: Int)
DELETE /api/palettes/:paletteId     controllers.Api.removePalette(paletteId: Int)
*/

object Api extends Controller {


  implicit val colorFormat = Json.format[Color]
  implicit val paletteFormat = Json.format[Palette]

  val cachedFavorites: ListBuffer[String] = ListBuffer("000000", "FFFFFF", "FF0000", "00FF00", "0000FF")
  val cachedPalettes: ListBuffer[Palette] = ListBuffer(
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
  var nextNewPaletteId = 3
    
  // FAVORITES  
  def getAllFavorites = Action {
    Ok(Json.toJson(cachedFavorites))
  }
  def removeFavorite(hexValue: String) = Action {
    cachedFavorites -= hexValue
    Ok(Json.toJson(cachedFavorites))
  }
  def createFavorite(hexValue: String) = Action {
    cachedFavorites += hexValue
    Ok(Json.toJson(cachedFavorites))
  }
  
  // PALETTES
  def getAllPalettes = Action {
    Ok(Json.toJson(cachedPalettes))
  }
  def getPaletteById(paletteId: Int) = Action {
    cachedPalettes.find(p => p.id.get == paletteId)
      .map(p => Ok(Json.toJson(p)))
      .getOrElse(NotFound)
  }
  def createPalette = Action(parse.json) { request =>
    request.body.validate[Palette].map{ requestPalette =>
      cachedPalettes += requestPalette.copy(id = Some(nextNewPaletteId))
      nextNewPaletteId += 1
      Ok(Json.toJson(Map("id" -> (nextNewPaletteId - 1))))
    }.recoverTotal( e => BadRequest("Detected Error: " + JsError.toFlatJson(e)) )
  }
  def updatePalette(paletteId: Int) = Action(parse.json) { request =>
    request.body.validate[Palette].map{ requestPalette =>
      cachedPalettes.find(p => p.id.get == paletteId)
        .map{ p => 
          cachedPalettes -= p
          cachedPalettes += requestPalette.copy(id = Some(paletteId))
          Ok(Json.toJson(cachedPalettes))
        }.getOrElse(NotFound)
    }.recoverTotal( e => BadRequest("Detected Error: " + JsError.toFlatJson(e)) )
  }
  def removePalette(paletteId: Int) = Action {
    cachedPalettes.find(p => p.id.get == paletteId)
      .map{ p => 
        cachedPalettes -= p
        Ok(Json.toJson(cachedPalettes))
      }.getOrElse(NotFound)
  }
}



