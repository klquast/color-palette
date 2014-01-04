name := "color-palette"

version := "1.0-SNAPSHOT"

libraryDependencies ++= Seq(
  "com.typesafe.slick" %% "slick" % "1.0.1",
  jdbc,
  anorm,
  cache
)     

play.Project.playScalaSettings
