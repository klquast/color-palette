package models.tables

import scala.slick.driver.H2Driver.simple._
import java.sql._

private[models]
case class Palette(
    paletteId: Option[Int],
    name: String,
    description: String,
    lastModified: Date,
    isFavorite: Boolean
    )

private[models]
object PaletteTable extends Table[Palette]("palette") {
  def paletteId = column[Int]("paletteId", O.PrimaryKey, O.AutoInc)
  def name = column[String]("name")
  def description = column[String]("description")
  def lastModified = column[Date]("lastModified")
  def isFavorite = column[Boolean]("isFavorite")

  def * = paletteId.? ~ name ~ description ~ lastModified ~ isFavorite <> (Palette.apply _, Palette.unapply _)

}


