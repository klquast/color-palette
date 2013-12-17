package models

case class Palette(name: String, colors: Seq[Color], isFavorite: Boolean, description: String, id: Option[Int]) 