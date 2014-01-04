package models.tables

import scala.slick.driver.H2Driver.simple._

private[models]
case class FavoriteColor(
                         favoriteColorId: Option[Int],
                         hexValue: String
                         )

private[models]
object FavoriteColorTable extends Table[FavoriteColor]("favoriteColor") {
  def favoriteColorId = column[Int]("favoriteColorId", O.PrimaryKey, O.AutoInc)
  def hexValue = column[String]("hexValue")

  def * = favoriteColorId.? ~ hexValue <> (FavoriteColor.apply _, FavoriteColor.unapply _)

}