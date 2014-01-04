package models.tables

import scala.slick.driver.H2Driver.simple._

private[models]
case class PaletteColor(
    paletteColorId: Option[Int],
    hexValue: String,
    orderNumber: Int,
    paletteId: Int
    )

private[models]
object PaletteColorTable extends Table[PaletteColor]("paletteColor") {
  def paletteColorId = column[Int]("paletteColorId", O.PrimaryKey, O.AutoInc)
  def hexValue = column[String]("hexValue")
  def orderNumber = column[Int]("orderNumber")
  def paletteId = column[Int]("paletteId")

  def * = paletteColorId.? ~ hexValue ~ orderNumber ~ paletteId <> (PaletteColor.apply _, PaletteColor.unapply _)

  //def palette = foreignKey("category_parentCategoryId", parentCategoryId, CategoryTable)(_.categoryId)
}

