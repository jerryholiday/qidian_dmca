-- MySQL dump 10.13  Distrib 8.0.22, for Win64 (x86_64)
--
-- Host: localhost    Database: dmca
-- ------------------------------------------------------
-- Server version	8.0.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `account` varchar(256) NOT NULL,
  `password` longtext,
  `isDeprecated` tinyint DEFAULT '0',
  `lastUsedTime` datetime DEFAULT NULL,
  `lastCheckTime` datetime DEFAULT NULL,
  PRIMARY KEY (`account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES ('aangelia768@gmail.com','Yinyue2537',1,'2023-02-07 17:56:05','2023-02-23 03:34:53'),('amragepnsk@gmail.com','vlvi27177',0,'2024-08-17 09:46:30','2024-08-17 16:00:19'),('ashleeanntoqwhjf@gmail.com','brlbo3664',1,'2023-06-26 18:48:50','2023-07-11 05:15:51'),('cherread23@gmail.com','Yinyue2537',1,'2023-02-02 17:51:27','2023-02-02 06:16:13'),('delphietbpajge@gmail.com','lspmm2507',1,'2023-06-26 07:11:16','2023-07-10 22:45:19'),('fruinbradford9@gmail.com','Frown958548',1,'2023-06-21 01:49:57','2023-07-10 22:51:50'),('gdgxd979@gmail.com','nDau33E85JKTW9Xm',0,'2024-08-17 11:52:21','2024-08-17 11:48:25'),('jabezsjdogij@gmail.com','pwjyk21902',1,'2022-03-08 15:36:08','2022-03-20 22:54:37'),('jilljohn245@gmail.com','Yinyue2537',2,'2023-09-04 04:54:47','2023-10-10 18:33:21'),('koshulafy@gmail.com','Yinyue2537',1,'2023-02-01 22:14:56','2023-02-01 21:53:07'),('lambertsonhugo2@gmail.com','Fee58200663',2,'2023-06-16 21:09:06','2023-09-04 04:54:48'),('orteucfdwvh@gmail.com','jnjwl7405',1,'2022-03-08 15:40:07','2022-03-08 15:36:09'),('raghibazoypi@gmail.com','rkthb8678',0,'2024-08-17 13:58:22','2024-08-17 13:54:17'),('readjacky564@gmail.com','Yinyue2537',1,'2023-01-01 00:00:00','2023-01-01 00:00:00'),('shireyyin101@gmail.com','Yinyue2537',1,'2024-01-18 19:05:07','2024-06-20 02:16:16');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-04 11:00:59
