# Online-File-Sharing
Online File Sharing app using PHP, JS, CSS, HTML

*MySql DATABASE*

Database Name: test

Run this SQL

CREATE TABLE `test`.`files` ( `id` INT NULL AUTO_INCREMENT , `name` VARCHAR(255) NULL , `email` VARCHAR(255) NULL , `link` VARCHAR(255) NULL , `created_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (`id`)) ENGINE = InnoDB;
