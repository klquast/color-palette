# --- !Ups

CREATE TABLE palette (
  paletteId INT AUTO_INCREMENT,
  name VARCHAR(96) NOT NULL ,
  description varchar(1024) NOT NULL ,
  lastModified DATETIME NOT NULL ,
  isFavorite BIT NOT NULL ,
  PRIMARY KEY(paletteId));
  
CREATE TABLE paletteColor (
  paletteColorId INT AUTO_INCREMENT,
  hexValue VARCHAR(12) NOT NULL ,
  orderNumber INT NOT NULL ,
  paletteId INT NOT NULL ,
  PRIMARY KEY(paletteColorId),
  FOREIGN KEY(paletteId) REFERENCES palette(paletteId));
  
CREATE TABLE favoriteColor (
  favoriteColorId INT AUTO_INCREMENT ,
  hexValue VARCHAR(12) NOT NULL ,
  PRIMARY KEY(favoriteColorId));
  
  -- PALETTES
INSERT INTO palette (name, description, lastModified, isFavorite) VALUES 
    ('Palette Number 1', 'This was inserted as a default by the app initializing', "2013-09-21", 0),
    ('Palette Number 2', 'This was inserted as a default by the app initializing', "2013-12-11", 1);
    
  -- PALETTECOLORS
INSERT INTO paletteColor (hexValue, orderNumber, paletteId) VALUES 
    ('A8E43B', 2, 1),
    ('B8245B', 1, 1),
    ('A8A44B', 0, 1),
    ('D8444B', 3, 1),
    ('A8E411', 4, 1),
    ('000000', 2, 2),
    ('A8A44B', 0, 2),
    ('FFFFFF', 1, 2);
    
  -- FAVORITECOLORS
INSERT INTO favoriteColor (hexValue) VALUES 
    ('A8A44B'),
    ('445896');

# --- !Downs

DROP TABLE `paletteColor`;
DROP TABLE `favoriteColor`;
DROP TABLE `palette`;
      
      
      