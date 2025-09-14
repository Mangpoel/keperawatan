/*
SQLyog Community v13.3.0 (64 bit)
MySQL - 10.4.32-MariaDB : Database - sistem_keperawatan
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`sistem_keperawatan` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `sistem_keperawatan`;

/*Table structure for table `kompetensi` */

DROP TABLE IF EXISTS `kompetensi`;

CREATE TABLE `kompetensi` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `kategori` varchar(100) NOT NULL,
  `uraian` text NOT NULL,
  `bobot` decimal(5,2) NOT NULL,
  `target_tahun` int(11) NOT NULL,
  `status` tinyint(4) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `kompetensi` */

insert  into `kompetensi`(`id`,`kategori`,`uraian`,`bobot`,`target_tahun`,`status`,`created_at`,`updated_at`) values 
(1,'A','Melakukan perawatan tali pusat',0.50,60,1,'2025-09-10 13:08:40','2025-09-10 13:08:40'),
(2,'B','Melakukan perawatan luka ',1.00,30,1,'2025-09-10 13:09:23','2025-09-10 13:09:23'),
(3,'A','Pengkajian pasien secara holistik (pengkajian dan diagnosa )',0.50,60,1,'2025-09-10 13:09:51','2025-09-10 13:09:51'),
(4,'A','Mempersiapkan kepulangan pasien',0.50,60,1,'2025-09-10 13:10:19','2025-09-10 13:10:19'),
(5,'B','Melakukan pemasangan infus',1.00,20,1,'2025-09-10 13:12:31','2025-09-10 13:12:31'),
(6,'A','Memandikan pasien dewasa / anak',0.50,60,1,'2025-09-10 13:13:02','2025-09-10 13:13:02'),
(7,'A','Memandikan pasien bayi',0.50,60,0,'2025-09-10 13:13:29','2025-09-10 13:15:40'),
(8,'A','Memberikan edukasi kepada pasien',0.50,50,1,'2025-09-10 14:31:46','2025-09-10 14:33:53');

/*Table structure for table `logbook` */

DROP TABLE IF EXISTS `logbook`;

CREATE TABLE `logbook` (
  `logbook_id` int(11) NOT NULL AUTO_INCREMENT,
  `kode_pegawai` varchar(50) DEFAULT NULL,
  `bulan` int(2) NOT NULL,
  `tahun` year(4) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`logbook_id`),
  KEY `fk_logbook_pegawai` (`kode_pegawai`),
  CONSTRAINT `fk_logbook_pegawai` FOREIGN KEY (`kode_pegawai`) REFERENCES `pegawai` (`kode_pegawai`)
) ENGINE=InnoDB AUTO_INCREMENT=2025100002 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `logbook` */

insert  into `logbook`(`logbook_id`,`kode_pegawai`,`bulan`,`tahun`,`status`,`created_at`,`updated_at`) values 
(2025080001,'93N',8,2025,1,'2025-09-13 15:14:20','2025-09-13 15:14:20'),
(2025090001,'D737',9,2025,1,'2025-09-12 15:57:49','2025-09-13 10:56:33'),
(2025090002,'D1178',9,2025,1,'2025-09-12 16:03:18','2025-09-13 10:56:36'),
(2025090003,'D737',9,2025,1,'2025-09-13 10:50:49','2025-09-13 10:56:39'),
(2025090004,'93N',9,2025,1,'2025-09-13 10:56:11','2025-09-13 10:56:11'),
(2025100001,'93N',10,2025,1,'2025-09-13 23:03:23','2025-09-13 23:03:23');

/*Table structure for table `logbook_detail` */

DROP TABLE IF EXISTS `logbook_detail`;

CREATE TABLE `logbook_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `logbook_id` int(11) DEFAULT NULL,
  `kompetensi_id` int(11) DEFAULT NULL,
  `inisial_pasien` varchar(50) DEFAULT NULL,
  `tanggal` date DEFAULT NULL,
  `jumlah` int(11) DEFAULT 1,
  `spv` varchar(100) DEFAULT NULL,
  `nilai_skp` decimal(6,2) DEFAULT 0.00,
  `status_logbook` tinyint(1) DEFAULT 0,
  `status` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `logbook_id` (`logbook_id`),
  KEY `kompetensi_id` (`kompetensi_id`),
  CONSTRAINT `logbook_detail_ibfk_1` FOREIGN KEY (`logbook_id`) REFERENCES `logbook` (`logbook_id`),
  CONSTRAINT `logbook_detail_ibfk_2` FOREIGN KEY (`kompetensi_id`) REFERENCES `kompetensi` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `logbook_detail` */

insert  into `logbook_detail`(`id`,`logbook_id`,`kompetensi_id`,`inisial_pasien`,`tanggal`,`jumlah`,`spv`,`nilai_skp`,`status_logbook`,`status`,`created_at`,`updated_at`) values 
(1,2025090001,1,'Tn. Budi, ny. juli, by. ny, tn AS','2025-09-12',4,'E113',2.00,1,1,'2025-09-12 22:07:40','2025-09-13 15:58:16'),
(2,2025090001,1,'Tn. Budi, ny. juli, by. ny, tn AS','2025-09-12',3,'E113',1.50,1,1,'2025-09-12 23:05:59','2025-09-13 16:26:03'),
(3,2025090001,2,'Ny. er, tn. Ar, Tn. GH, Ny. Ae, Ny. YU','2025-09-12',5,'E113',5.00,0,1,'2025-09-12 23:10:23','2025-09-13 12:00:35'),
(4,2025090001,1,'Ny. GH, Ny. Ae, Ny. YU','2025-09-13',2,'E113',1.00,0,0,'2025-09-12 23:12:15','2025-09-14 20:03:27'),
(5,2025090001,8,'Ny. GH, Ny. Ae, Ny. AS, Ny. AB, Tn. qw, tn, qe, tn','2025-09-14',8,'E113',4.00,0,1,'2025-09-12 23:18:17','2025-09-12 23:18:17'),
(6,2025080001,1,'Ny. AB','2025-08-01',1,'E113',0.50,1,1,'2025-09-13 15:15:47','2025-09-13 16:26:08'),
(7,2025080001,1,'Ny. AB, Ny. B, Ny. C, Ny.D, ny. E','2025-08-02',5,'E113',2.50,0,1,'2025-09-13 15:16:33','2025-09-13 15:16:33'),
(8,2025080001,5,'Ny. AB, Ny. B','2025-08-02',2,'E113',2.00,0,1,'2025-09-13 15:17:05','2025-09-13 15:17:05');

/*Table structure for table `pegawai` */

DROP TABLE IF EXISTS `pegawai`;

CREATE TABLE `pegawai` (
  `kode_pegawai` varchar(50) NOT NULL,
  `nama_pegawai` varchar(100) NOT NULL,
  `unit_id` int(11) DEFAULT NULL,
  `divisi` varchar(100) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`kode_pegawai`),
  KEY `fk_pegawai_unit` (`unit_id`),
  CONSTRAINT `fk_pegawai_unit` FOREIGN KEY (`unit_id`) REFERENCES `unit` (`unit_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `pegawai` */

insert  into `pegawai`(`kode_pegawai`,`nama_pegawai`,`unit_id`,`divisi`,`status`,`created_at`,`updated_at`) values 
('93N','Ns. Ni Putu Yulia Dewi, S.Kep',102,'Keperawatan',1,'2025-09-13 10:55:44','2025-09-13 10:55:44'),
('A1047','I Komang Mahardika,S.Kom',111,'SIMRS-PT',1,'2025-09-10 22:28:45','2025-09-10 22:43:01'),
('D1178','Ni Komang Trinita Dewi, Amd.Keb',110,'Keperawatan',1,'2025-09-12 16:03:10','2025-09-12 16:03:10'),
('D737','Putu Teny Agustina Trijayanti, Amd.Keb',110,'Keperawatan',1,'2025-09-10 14:24:24','2025-09-13 11:22:34'),
('E1037','Ns. Ida Ayu Gde Oka Barasutawati, S.Kep',104,'Keperawatan',1,'2025-09-10 13:25:33','2025-09-10 13:25:33'),
('E113','Bdn. Ni Wayan Ariyanti, S.Tr.Keb.',110,'Keperawatan',1,'2025-09-10 14:23:50','2025-09-13 11:22:39'),
('E162','Ns. Ni Putu Yeni Aripin, S.Kep.',107,'Keperawatan',1,'2025-09-10 14:26:01','2025-09-13 11:23:03'),
('E316','Rahma Candra Saputra',101,'Keperawatan',0,'2025-09-09 22:44:05','2025-09-09 22:44:51'),
('E535','Ns. Ni Luh Ariestini, S.Kep',108,'Keperawatan',1,'2025-09-10 14:25:14','2025-09-13 11:23:13'),
('N98','Ns. Ni Made Lina Pertiwi, S.Kep',102,'Keperawatan',1,'2025-09-10 13:23:58','2025-09-10 13:23:58');

/*Table structure for table `unit` */

DROP TABLE IF EXISTS `unit`;

CREATE TABLE `unit` (
  `unit_id` int(11) NOT NULL,
  `nama_unit` varchar(100) NOT NULL,
  `divisi` varchar(100) DEFAULT NULL,
  `kode_kaunit` varchar(50) DEFAULT NULL,
  `nama_kaunit` varchar(100) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`unit_id`),
  UNIQUE KEY `uq_kode_kaunit` (`kode_kaunit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `unit` */

insert  into `unit`(`unit_id`,`nama_unit`,`divisi`,`kode_kaunit`,`nama_kaunit`,`status`,`created_at`,`updated_at`) values 
(100,'example','Keperawatan','B123','Ns. Ni Luh Kusma Dewi, S.Kep',0,'2025-09-09 22:10:15','2025-09-10 20:20:54'),
(101,'ICU','Keperawatan','E316','Rahma Candra Saputra, Amd.Kep.',1,'2025-09-09 21:36:25','2025-09-09 21:36:25'),
(102,'Rawat Inap 1','Keperawatan','E684','Ns. Ni Luh Kusma Dewi, S.Kep',1,'2025-09-09 21:37:45','2025-09-09 22:09:19'),
(103,'Rawat Inap 2','Keperawatan','E454','Ns. I Gusti Ayu Eka Nopiyanti, S.Kep',1,'2025-09-09 22:08:08','2025-09-09 22:08:08'),
(104,'Rawat Jalan','Keperawatan','E1037','Ns. Ida Ayu Gde Oka Barasutawati, S.Kep',1,'2025-09-09 22:26:52','2025-09-09 22:26:52'),
(105,'Komite Keperawatan','Keperawatan','D13','dr. IA Candra Puspita Dewi, M.Biomed',1,'2025-09-10 13:28:39','2025-09-10 13:28:39'),
(106,'Pelayanan Kamar Operasi dan CSSD','Keperawatan','E001','Sukma SARI',1,'2025-09-10 14:12:03','2025-09-10 14:16:25'),
(107,'IVF','Keperawatan','E162','Ns. Ni Putu Yeni Aripin, S.Kep.',1,'2025-09-10 14:21:21','2025-09-10 14:21:21'),
(108,'UGD','Keperawatan','E535','Ns. Ni Luh Ariestini, S.Kep',1,'2025-09-10 14:22:08','2025-09-10 14:22:08'),
(110,'Kamar Bersalin','Keperawatan','E113','Bdn. Ni Wayan Ariyanti, S.Tr.Keb.',1,'2025-09-10 14:23:11','2025-09-10 14:23:11'),
(111,'SIMRS','SIMRS','A1047','I Komang Mahardika,S.Kom',1,'2025-09-10 22:33:22','2025-09-10 22:33:22');

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `kode_pegawai` varchar(20) NOT NULL,
  `status` tinyint(1) DEFAULT 1,
  `role` tinyint(1) NOT NULL DEFAULT 3,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `fk_user_pegawai` (`kode_pegawai`),
  CONSTRAINT `fk_user_pegawai` FOREIGN KEY (`kode_pegawai`) REFERENCES `pegawai` (`kode_pegawai`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `user` */

insert  into `user`(`id`,`username`,`password`,`kode_pegawai`,`status`,`role`,`created_at`,`updated_at`) values 
(2,'admin','$2b$10$vB5OKmjacLmGG8LEDXskiu3dgHKHmfLqdfmb5gL06DFVfhkWTE26.','A1047',1,1,'2025-09-10 22:24:50','2025-09-13 16:21:52'),
(4,'113','$2b$10$GOR7i3qNskQMG5eYRHB7huA3dky/zvJ5s/uttX7RrocfLPHP6pnc6','E113',1,2,'2025-09-12 23:31:05','2025-09-12 23:31:05'),
(5,'737','$2b$10$xktJd8/vwntMcw2p5cnSQOvYbBuyaeY4YSwGPKg4gEnZGCGn3SBDC','D737',1,3,'2025-09-12 23:31:31','2025-09-12 23:31:31'),
(6,'1037','$2b$10$gGann.1gI7tJ8WuPijmEMOTVZV6Fq.gVjn4NjkaQ7uhFRfPu07y.G','E1037',0,2,'2025-09-13 16:14:05','2025-09-13 16:23:30');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
